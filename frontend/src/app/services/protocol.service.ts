import { HttpClient, httpResource } from '@angular/common/http';
import { computed, inject, Service, signal } from '@angular/core';
import { environment } from '../environment/environment';
import { Protocol } from '../models/protocols.model';

@Service()
export class ProtocolService {
  http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/protocols`;

  protocols = computed<Protocol[]>(() => (this.protocolsResource.value() as Protocol[]) ?? []);
  protocolkeys = computed(() => {
    return this.protocols().map(protocol => protocol.title);
  });

  selectedProtocolId = signal<string | null>(null); 

  protocolsResource = httpResource(() => this.baseUrl);
  protocolResource = httpResource(() => {
    return this.selectedProtocolId() ? `${this.baseUrl}/${this.selectedProtocolId()}` : undefined; 
  });
  
}
