import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../environment/environment';
import { Auth } from './auth.service';
import { Observable } from 'rxjs';
import { ProfessorStats, StudentStats } from '../models/stats.model';

@Service()
export class ProfessorService {
  http = inject(HttpClient);
  authService = inject(Auth);
  
  private baseUrl = `${environment.apiUrl}/professors`;

  profileResource = httpResource(() => {
    return this.authService.userRole() === 'professor' 
      ? `${this.baseUrl}/profile` 
      : undefined; 
  });
  myStatsResource = httpResource<ProfessorStats>(() => {
    return this.authService.userRole() === 'professor' 
      ? `${this.baseUrl}/my-stats` 
      : undefined; 
  });

  updateProfile(data: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/profile`, data);
  }
}
