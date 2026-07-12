import { HttpClient, httpResource } from '@angular/common/http';
import { computed, inject, Service, signal } from '@angular/core';
import { environment } from '../environment/environment';
import { Protocol } from '../models/protocols.model';

@Service()
export class ProtocolService {
  http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/protocols`;

  // GET protocolos
  protocolsResource = httpResource<Protocol[]>(() => this.baseUrl);

  protocols = this.protocolsResource.value;
  protocolkeys = computed(() => {return this.protocols() ? this.protocols()?.map(p => p.title) : [];});
  
}
