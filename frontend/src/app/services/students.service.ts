import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { debounceTime, distinctUntilChanged, Observable, switchMap } from 'rxjs';
import { environment } from '../environment/environment';
import { Student } from '../models/student.model';

@Service()
export class StudentService {
  http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/students`;
  
  studentsResource = httpResource(() => this.baseUrl);
  // myStudentsResource = httpResource(() => `${this.baseUrl}/my-students`);
  
  getMyStudents(filters: { query: string; course: string | null; group: string | null }): Observable<Student[]> {
    const params = new URLSearchParams();

    if (filters.query) params.append('query', filters.query.trim());
    if (filters.course) params.append('course', filters.course.toString());
    if (filters.group) params.append('group', filters.group.toString());

    return this.http.get<Student[]>(`${this.baseUrl}/my-students?` + params.toString());
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
