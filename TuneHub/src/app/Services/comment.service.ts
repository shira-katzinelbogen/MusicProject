
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

  constructor(private http: HttpClient) {}

  // -------------------------------
  // POST: העלאת תגובה
  // -------------------------------
 uploadComment(dto: Comment): Observable<Comment> {
  // const params = new HttpParams().set('userId', userId);
  return this.http.post<Comment>(`${this.apiUrl}/upload`, dto, { withCredentials: true });
}

// uploadComment(dto: Comment, userId: number): Observable<Comment> {
//   // const params = new HttpParams().set('userId', userId);
//   return this.http.post<Comment>(`${this.apiUrl}/upload`, dto, { withCredentials: true });
// }
// { params }, 

  // -------------------------------
  // GET: הבאת תגובות עם פאגינציה
  // -------------------------------
  getCommentsPaged(postId: number, page: number, size: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size);
    console.log(`${this.apiUrl}/byPost/${postId}/paged?page=${page}&size=${size}`);

    return this.http.get<any>(`${this.apiUrl}/byPost/${postId}/paged`, { withCredentials: true });
      //  { params });
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
