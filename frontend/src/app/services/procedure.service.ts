import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Service, signal } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { environment } from '../environment/environment';
import { Auth } from './auth.service';
import { ProcedureDetail, procedureSummary } from '../models/procedure.model';
import { EvaluationData } from '../models/forms.model';

@Service()
export class ProcedureService {
  http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/procedures`;

  authService = inject(Auth);
  // GET prácticas pendeintes de evaluar
  pendingProceduresResource = httpResource(() => {
    return this.authService.userRole() === 'professor' ? `${this.baseUrl}/pending` : undefined; 
  });
  
  // GET de una prácticas
  getProcedureById(id: string): Observable<ProcedureDetail> {
    return this.http.get<ProcedureDetail>(`${this.baseUrl}/${id}`);
  }
  // GET mis prácticas
  getMyHistory(): Observable<procedureSummary[]> {
    return this.http.get<procedureSummary[]>(`${this.baseUrl}/my-history`);
  }
  // GET prácticas del estudiante
  getStudentProcedures(studentId: string): Observable<procedureSummary[]> {
    return this.http.get<procedureSummary[]>(`${this.baseUrl}/student/` + studentId);
  }

  // POST añadir anotacion
  addAnnotation(procedureId: string, annotation: any) {
    return this.http.post(`${this.baseUrl}/${procedureId}/annotations`, annotation);
  }

  // PUT Editar anotacion
  editAnnotation(procedureId: string, annotationId: string, data: any) {
    return this.http.put(`${this.baseUrl}/${procedureId}/annotations/${annotationId}`, data);
  }

  // DELETE Eliminar anotacion
  deleteAnnotation(procedureId: string, annotationId: string) {
    return this.http.delete(`${this.baseUrl}/${procedureId}/annotations/${annotationId}`);
  }

  // POST: añadir nota y comentario final de avalaución
  finalizeEvaluation(procedureId: string, evaluation: EvaluationData): Observable<EvaluationData>{
    return this.http.patch<any>(`${this.baseUrl}/${procedureId}/finalize`, evaluation)
  }
}
