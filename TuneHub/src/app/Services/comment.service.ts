
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

 
  private baseUrl = 'http://localhost:8080/api/comments';

  constructor(private http: HttpClient) {}

  // -------------------------------
  // POST: העלאת תגובה
  // -------------------------------
  uploadComment(dto: any, userId: number): Observable<any> {
    const params = new HttpParams().set('userId', userId);

    return this.http.post<any>(`${this.baseUrl}/upload`, dto, { params });
  }

  // -------------------------------
  // GET: הבאת תגובות עם פאגינציה
  // -------------------------------
  getCommentsPaged(postId: number, page: number, size: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size);

    return this.http.get<any>(`${this.baseUrl}/byPost/${postId}/paged`, { params });
  }
    //Get
    // getCommentById(id: number): Observable<Comment> {
    //     return this._httpClient.get<Comment>(`http://localhost:8080/api/comment/commentById/${id}`);
    // }

    // getComments(): Observable<Comment[]> {
    //     return this._httpClient.get<Comment[]>(`http://localhost:8080/api/comment/comments`);
    // }

    // getCommentsByPostId(id: number): Observable<Comment[]> {
    //     return this._httpClient.get<Comment[]>(`http://localhost:8080/api/comment/commentsByPostId/${id}`)
    // }

    //   getCommentsByUserId(id: number): Observable<Comment[]> {
    //     return this._httpClient.get<Comment[]>(`http://localhost:8080/api/comment/commentsByUserId/${id}`)
    // }


    // getCommentByDate(date:Date): Observable<Comment>{
    //     return this._httpClient.get<Comment>(`http://localhost:8080/api/comment/commentByDate/${date}`)
    // }



    //Post
    // uploadPost(post: Post): Observable<Post> {
    //     return this._httpClient.post<Post>(`http://localhost:8080/api/Post/uploadPost`, post);
    // }


}
