import { HttpClient, httpResource } from '@angular/common/http';
import { computed, inject, Service, signal } from '@angular/core';
import { environment } from '../environment/environment';
import {  tap } from 'rxjs';
import { LoginResponse, User } from '../models/auth.model';

@Service()
export class Auth {
private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/auth`;

  private tokenSignal = signal<string | null>(localStorage.getItem('accessToken'));

  currentUser = computed(() => this.profilelResource.value() ?? null);
  isLoading = computed(() => this.profilelResource.isLoading() || this.statsResource.isLoading());
  isAuthenticated = computed(() => this.tokenSignal() !== null);

  profilelResource = httpResource(() => {
    return this.tokenSignal() ? `${this.baseUrl}/me` : undefined;
  });

  statsResource = httpResource(() => {
    return this.tokenSignal() ? `${this.baseUrl}/me/stats` : undefined;
  });

  // POST login 
  login(credentials: any) {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, credentials).pipe(
      tap(response => {
        localStorage.setItem('accessToken', response.accessToken);
        this.tokenSignal.set(response.accessToken);
      })
    );
  }

  // POST register
  register(userData: any) {
    return this.http.post<User>(`${this.baseUrl}/register`, userData);
  }

  logout() {
    localStorage.removeItem('accessToken');
    this.tokenSignal.set(null); 
  }
}
