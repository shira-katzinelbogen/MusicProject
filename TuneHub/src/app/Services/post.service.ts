
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import Post from '../Models/Post';

@Injectable({
    providedIn: 'root'
})

export class PostService {

    public posts: Post[] = [];
    public count = 0;

    constructor(private _httpClient: HttpClient) { }

    //Get
    getPostById(id: number): Observable<Post> {
        return this._httpClient.get<Post>(`http://localhost:8080/api/post/postById/${id}`);
    }

    getPosts(): Observable<Post[]> {
        return this._httpClient.get<Post[]>(`http://localhost:8080/api/post/posts`);
    }

    getPostsByUserId(id: number): Observable<Post[]> {
        return this._httpClient.get<Post[]>(`http://localhost:8080/api/post/postsByUserId/${id}`)
    }

    getPostsByTitle(title: String): Observable<Post[]> {
        return this._httpClient.get<Post[]>(`http://localhost:8080/api/post/postsByTitle/${title}`)
    }

     getPostByPostCategoryId(id: number): Observable<Post> {
        return this._httpClient.get<Post>(`http://localhost:8080/api/post/postsByPostCategoryId/${id}`)
    }

    getPostByDate(date:Date): Observable<Post>{
            return this._httpClient.get<Post>(`http://localhost:8080/api/post/postByDate/${date}`)
    }

    //Post
    // uploadPost(post: Post): Observable<Post> {
    //     return this._httpClient.post<Post>(`http://localhost:8080/api/Post/uploadPost`, post);
    // }


}
