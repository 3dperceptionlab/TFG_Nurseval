import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Service, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../environment/environment';

@Service()
export class Procedure {
  http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/procedures`;

  selectedProcedureId = signal<string | null>(null);

  proceduresResource = httpResource(() => this.baseUrl);
  procedureResource = httpResource(() => {
    const id = this.selectedProcedureId();
    return id ? `${this.baseUrl}/${id}` : undefined; 
  });
  

    // POST añadir anotacion
  async addAnnotation(procedureId: string, annotation: any) {
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
