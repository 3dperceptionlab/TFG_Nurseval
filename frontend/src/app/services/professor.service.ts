import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { debounceTime, distinctUntilChanged, Observable, switchMap } from 'rxjs';
import { environment } from '../environment/environment';

@Service()
export class Professor {
  http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/students`;
  
  studentsResource = httpResource(() => this.baseUrl,);
  studentProceduresResource = httpResource((id) => `${this.baseUrl}/${id}/proceduress`);
  
  searchStudents(buscar$: Observable<string>): Observable<any[]> {
    return buscar$.pipe(
      debounceTime(350),          
      distinctUntilChanged(),   
      switchMap(query => {
        const cleanedQuery = query.trim();
        if (!cleanedQuery) return [[]];
        
        // Petición a tu Spring Boot
        return this.http.get<any[]>(`${this.baseUrl}?search=${cleanedQuery}`);
      })
    );
  }
}
