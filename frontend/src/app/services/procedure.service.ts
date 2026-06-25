import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Service, signal } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { environment } from '../environment/environment';
import { Auth } from './auth.service';
import { procedureSummary } from '../models/procedure.model';

@Service()
export class ProcedureService {
  http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/procedures`;

  authService = inject(Auth);
  selectedProcedureId = signal<string | null>(null);
  
  procedureResource = httpResource(() => {
    const id = this.selectedProcedureId();
    return id ? `${this.baseUrl}/${id}` : undefined; 
  });

  myStudentProceduresResource = httpResource(() => {
    return `${this.baseUrl}/pending`; 
  });
  
  getMyHistory(): Observable<procedureSummary[]> {
    return this.http.get<procedureSummary[]>(`${this.baseUrl}/my-history`);
  }
  
  getStudentProcedures(studentId: string): Observable<procedureSummary[]> {
    return this.http.get<procedureSummary[]>(`${this.baseUrl}/student/` + studentId);
  }

    // POST añadir anotacion
  addAnnotation(procedureId: string, annotation: any) {
    return firstValueFrom(
      this.http.post(`${this.baseUrl}/${procedureId}/annotations`, annotation)
    );
  }

  // PUT Editar anotacion
  editAnnotation(procedureId: string, annotationId: string, data: any) {
    return this.http.put(`${this.baseUrl}/${procedureId}/annotations/${annotationId}`, data);
  }

  // DELETE Eliminar anotacion
  eliminarAnotacion(procedureId: string, annotationId: string) {
    return this.http.delete(`${this.baseUrl}/${procedureId}/annotations/${annotationId}`);
  }
}
