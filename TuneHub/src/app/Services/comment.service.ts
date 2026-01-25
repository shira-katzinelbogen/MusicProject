
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import Comment from '../Models/Comment';

@Injectable({
  providedIn: 'root'
})

export class CommentService {

  public comments: Comment[] = [];
  public count = 0;
  private apiUrl = 'http://localhost:8080/api/comment';

  constructor(private _httpClient: HttpClient) { }

  uploadComment(dto: Comment): Observable<Comment> {
    return this._httpClient.post<Comment>(`${this.apiUrl}/upload`, dto, { withCredentials: true });
  }

  getCommentsPaged(postId: number, page: number, size: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size);
    return this._httpClient.get<any>(`${this.apiUrl}/byPost/${postId}/paged`, { withCredentials: true });
  }
}
