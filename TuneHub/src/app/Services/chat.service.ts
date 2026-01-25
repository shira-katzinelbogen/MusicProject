import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ChatService {
  private apiUrl = 'http://localhost:8080/api/users/chat';

  constructor(private _httpClient: HttpClient) { }

  sendMessage(message: string, conversationId: string): Observable<string> {
    return this._httpClient.post(
      this.apiUrl, { message, conversationId }, { responseType: 'text', withCredentials: true }
    );
  }
}
