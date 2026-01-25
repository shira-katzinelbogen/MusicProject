import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AdminService {

  private baseUrl = 'http://localhost:8080/api';

  constructor(private _httpClient: HttpClient) { }

  sendWarningNotification(postId: number): Observable<any> {
    const url = `${this.baseUrl}/post/admin/sendPostOwnerWarningNotification/${postId}`;
    const body = {};
    return this._httpClient.post(url, body, { withCredentials: true });
  }

  deletePostWithNotification(postId: number): Observable<any> {
    const url = `${this.baseUrl}/post/deletePostByPostId/${postId}`;
    return this._httpClient.delete(url, { withCredentials: true });
  }
}