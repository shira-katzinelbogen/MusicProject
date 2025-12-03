import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'http://localhost:8080/api/users/chat';

  constructor(private http: HttpClient) { }

  sendMessage(message: string, conversationId: string): Observable<string> {
    const requestBody = { message, conversationId };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(this.apiUrl, requestBody, { headers, responseType: 'text' });
  }
}
