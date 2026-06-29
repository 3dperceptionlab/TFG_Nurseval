import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { debounceTime, distinctUntilChanged, Observable, switchMap } from 'rxjs';
import { environment } from '../environment/environment';
import { Student } from '../models/student.model';
import { Auth } from './auth.service';
import { Profesor } from '../models/procedimientos.model';
import { StudentStats } from '../models/stats.model';

@Service()
export class StudentService {
  http = inject(HttpClient);
  authService = inject(Auth);

  private baseUrl = `${environment.apiUrl}/students`;
  
  studentsResource = httpResource(() => this.baseUrl);
  profileResource = httpResource(() => {
    return this.authService.userRole() === 'student' 
      ? `${this.baseUrl}/profile` 
      : undefined; 
  });
  myStatsResource = httpResource<StudentStats>(() => {
    return this.authService.userRole() === 'student' 
      ? `${this.baseUrl}/my-stats` 
      : undefined; 
  });


  getStudentById(id: string): Observable<Profesor> {
    return this.http.get<Profesor>(`${this.baseUrl}/${id}`);
  }

  getMyStudents(filters: { query: string; course: string | null; group: string | null }): Observable<Student[]> {
    const params = new URLSearchParams();

    if (filters.query) params.append('query', filters.query.trim());
    if (filters.course) params.append('course', filters.course.toString());
    if (filters.group) params.append('group', filters.group.toString());

    return this.http.get<Student[]>(`${this.baseUrl}/my-students?` + params.toString());
  }
  
  updateProfile(data: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/profile`, data);
  }

  assignProfessor(studentId: string): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${studentId}/professor`, {}); // body vacio porqeu realmente no hace falta mandar el id
  }

  removeStudentFromProfessor(studentId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${studentId}/professor`);
  }

  searchStudents(buscar$: Observable<string>): Observable<any[]> {
    return buscar$.pipe(
      debounceTime(350),          
      distinctUntilChanged(),   
      switchMap(query => {
        const cleanedQuery = query.trim();
        if (!cleanedQuery) return [[]];
        
        return this.http.get<any[]>(`${this.baseUrl}?query=${cleanedQuery}`);
      })
    );
  }


}
