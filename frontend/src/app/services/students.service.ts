import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { debounceTime, distinctUntilChanged, Observable, switchMap } from 'rxjs';
import { environment } from '../environment/environment';
import { Student } from '../models/student.model';
import { Auth } from './auth.service';
import { StudentStats } from '../models/stats.model';

@Service()
export class StudentService {
  http = inject(HttpClient);
  authService = inject(Auth);

  private baseUrl = `${environment.apiUrl}/students`;
  
  // GET perfil estudiante
  profileResource = httpResource(() => {
    return this.authService.userRole() === 'student' 
      ? `${this.baseUrl}/profile` 
      : undefined; 
  });

  // GET estadísticas estudainte
  myStatsResource = httpResource<StudentStats>(() => {
    return this.authService.userRole() === 'student' 
      ? `${this.baseUrl}/my-stats` 
      : undefined; 
  });

  //GET estudiante por su id
  getStudentById(id: string): Observable<Student> {
    return this.http.get<Student>(`${this.baseUrl}/${id}`);
  }

  //GET estudiantes de un profesor + los filtros
  getMyStudents(filters: { query: string; course: string | null; group: string | null }): Observable<Student[]> {
    const params = new URLSearchParams();

    if (filters.query) params.append('query', filters.query.trim());
    if (filters.course) params.append('course', filters.course.toString());
    if (filters.group) params.append('group', filters.group.toString());

    return this.http.get<Student[]>(`${this.baseUrl}/my-students?` + params.toString());
  }
  
  // PUT perfil estudiante
  updateProfile(data: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/profile`, data);
  }
  // PUT añadir un alumno al profesor
  assignProfessor(studentId: string): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${studentId}/professor`, {}); // body vacio porqeu realmente no hace falta mandar el id
  }
  // DELETE eliminar un laumno de un profesor
  removeStudentFromProfessor(studentId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${studentId}/professor`);
  }

  // GET búsqueda de alumnos según email, nombre,... en "tiempo real"
  searchStudents(buscar$: Observable<string>): Observable<any[]> {
    return buscar$.pipe(
      debounceTime(350), // esperar a que el usuario pare unos milisegundos para no sobrecargar el back. ej: m-a-ri-a          
      distinctUntilChanged(), // evitar enviar cuando no cambia mar, y luego mar otra vez bloquea
      switchMap(query => { // devuleve otro observable(la peticion)  y si veulve e enviarse un valor, cancela la anterior
        const cleanedQuery = query.trim();
        if (!cleanedQuery) return [[]];
        
        return this.http.get<any[]>(`${this.baseUrl}?query=${cleanedQuery}`);
      })
    );
  }


}
