import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../environment/environment';
import { catchError, firstValueFrom, of, switchMap, tap } from 'rxjs';
import { User } from '../models/auth.model';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class Auth {
  private http = inject(HttpClient);
  router = inject(Router);
  private baseUrl = `${environment.apiUrl}/auth`;

  private authenticated = signal<boolean>(false);
  private user = signal<User | null>(null);

  isAuthenticated = computed(() => this.authenticated());
  currentUser = computed(() => this.user());

  userRole = computed<string>(() => {
    const user = this.currentUser();
    return user && 'role' in user ? user.role : 'guest';
  });

  // El withCredentials realmente ya lo mete ele interceptor

  // Al arrancar para saber si hay sesion valida. Unico sitio con promesas
  async init(): Promise<void> {
    try {
      const user = await firstValueFrom(this.http.get<User>(`${this.baseUrl}/me`));
      this.setSession(user);
    } catch {
      // El access token pudo expirar -> probamos a refrescar con el refresh token.
        this.clearSession();
    }
  }

  //GET existe email
  checkEmail(email: string) {
    return this.http.get<boolean>(`${this.baseUrl}/check-email?email=${email}`);
  }

  // POST login: backend fija las cookies httpOnly 
  login(credentials: any) {
    return this.http.post<User>(`${this.baseUrl}/login`, credentials).pipe(
      tap(user => this.setSession(user))
    );
  }

  // POST register
  register(userData: any) {
    return this.http.post<User>(`${this.baseUrl}/register`, userData);
  }

  // Usado por el interceptor cuando una petición devuelve 401.
  refreshSession() {
    return this.http.post<User>(`${this.baseUrl}/refresh`, {}).pipe(
      tap(user => this.setSession(user)),
      catchError(err => {
        this.clearSession();
        this.router.navigateByUrl('/login');
        throw err;
      })
    );
  }
  
  logout() {
    return this.http.post(`${this.baseUrl}/logout`, {}).pipe(
      switchMap(() => of(void 0)), // ignora la respuesta y devuelve un "undefeined", tambien se puede map(() => undefined)
      tap(() => this.clearSession()),
      catchError(() => {
        this.clearSession();
        return of(void 0);
      })
    );
  }

  private setSession(user: User) {
    this.user.set(user);
    this.authenticated.set(true);
  }

  private clearSession() {
    this.user.set(null);
    this.authenticated.set(false);
  }
}