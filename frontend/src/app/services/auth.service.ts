import { HttpClient, HttpHeaders, httpResource } from '@angular/common/http';
import { computed, inject, Service, signal } from '@angular/core';
import { environment } from '../environment/environment';
import {  firstValueFrom, tap } from 'rxjs';
import { LoginResponse, User } from '../models/auth.model';

@Service()
export class Auth {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/auth`;

  private tokenSignal = signal<string | null>(localStorage.getItem('accessToken'));

  currentUser = computed(() => this.profileResource.value() ?? null);
  isLoading = computed(() => this.profileResource.isLoading());
  isAuthenticated = computed(() => this.tokenSignal() !== null);

  userRole = computed<string>(() => {
    if (!this.tokenSignal()) {
      return 'guest';
    }

    const user = this.currentUser();
    return user && 'role' in user ? user.role : 'guest';
  });

  profileResource = httpResource<User>(() => {
    return this.tokenSignal() ? `${this.baseUrl}/me` : undefined;
  });

  async init(): Promise<void> {
    if (!this.tokenSignal()) return;

    try {
      await firstValueFrom(
        this.http.get<User>(`${this.baseUrl}/me`).pipe(
          tap(user => this.profileResource.set(user)) 
        )
      );
    } catch {
      this.logout();
    }
  }

  // statsResource = httpResource(() => {
  //   return this.tokenSignal() ? `${this.baseUrl}/me/stats` : undefined;
  // });
  
  checkEmail(email: string) {
    return this.http.get<boolean>(`${this.baseUrl}/check-email?email=${email}`);
  }

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
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<User>(`${this.baseUrl}/register`, userData);
  }

  logout() {
    localStorage.removeItem('accessToken');
    this.tokenSignal.set(null); 
  }
}
