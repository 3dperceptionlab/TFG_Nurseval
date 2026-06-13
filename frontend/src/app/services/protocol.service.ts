import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Service, signal } from '@angular/core';
import { environment } from '../environment/environment';

@Service()
export class Protocol {
  http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/protocols`;

  selectedProtocolId = signal<string | null>(null); 

  protocolsResource = httpResource(() => this.baseUrl);
  protocolResource = httpResource(() => {
    return this.selectedProtocolId() ? `${this.baseUrl}/${this.selectedProtocolId()}` : undefined; 
  });
  


}
