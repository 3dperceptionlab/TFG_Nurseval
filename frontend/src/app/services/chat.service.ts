import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';
import { ChatMessageResponse } from '../models/chat.model';

@Service()
export class ChatService {
  http = inject(HttpClient);

  private baseUrl = `${environment.apiUrl}/chat`;

  sendMessage(sessionId: string, message: string): Observable<ChatMessageResponse> {
    return this.http.post<ChatMessageResponse>(`${this.baseUrl}/message`, { sessionId, message });
  }
}
