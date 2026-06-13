import { computed, inject, Service } from '@angular/core';
import { environment } from '../environment/environment';
import { Auth } from './auth.service';
import { httpResource } from '@angular/common/http';

@Service()
export class Users {
  private auth = inject(Auth);
  private baseUrl = `${environment.apiUrl}/users`;
  
  // Signals expuestos para simplificar la UI
  stats = computed(() => this.statsResource.value() ?? null);
  isLoadingStats = computed(() => this.statsResource.isLoading());  

  statsResource = httpResource(() => {
    return this.auth.isAuthenticated() ? `${this.baseUrl}/me/stats` : undefined;
  });


}
