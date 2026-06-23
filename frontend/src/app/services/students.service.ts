import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { debounceTime, distinctUntilChanged, Observable, switchMap } from 'rxjs';
import { environment } from '../environment/environment';

@Service()
export class Student {
  http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/students`;
  
  studentsResource = httpResource(() => this.baseUrl,);
  
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
