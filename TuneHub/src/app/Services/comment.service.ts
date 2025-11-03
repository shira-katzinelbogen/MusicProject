
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import Comment from '../Models/Comment';

@Injectable({
    providedIn: 'root'
})

export class CommentService {

    public comments: Comment[] = [];
    public count = 0;

    constructor(private _httpClient: HttpClient) { }

    //Get
    getCommentById(id: number): Observable<Comment> {
        return this._httpClient.get<Comment>(`http://localhost:8080/api/comment/commentById/${id}`);
    }

    getComments(): Observable<Comment[]> {
        return this._httpClient.get<Comment[]>(`http://localhost:8080/api/comment/comments`);
    }

    getCommentsByPostId(id: number): Observable<Comment[]> {
        return this._httpClient.get<Comment[]>(`http://localhost:8080/api/comment/commentsByPostId/${id}`)
    }

      getCommentsByUserId(id: number): Observable<Comment[]> {
        return this._httpClient.get<Comment[]>(`http://localhost:8080/api/comment/commentsByUserId/${id}`)
    }


    getCommentByDate(date:Date): Observable<Comment>{
        return this._httpClient.get<Comment>(`http://localhost:8080/api/comment/commentByDate/${date}`)
    }



    //Post
    // uploadPost(post: Post): Observable<Post> {
    //     return this._httpClient.post<Post>(`http://localhost:8080/api/Post/uploadPost`, post);
    // }


}
