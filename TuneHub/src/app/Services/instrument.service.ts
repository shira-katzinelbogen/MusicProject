
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import Instrument from '../Models/Instrument';


@Injectable({
    providedIn: 'root'
})

export class InstrumentsService {

    public posts: Instrument[] = [];
    public count = 0;

    constructor(private _httpClient: HttpClient) { }

    //Get
    getPostById(id: number): Observable<Instrument> {
        return this._httpClient.get<Instrument>(`http://localhost:8080/api/post/postById/${id}`);
    }

    getPosts(): Observable<Instrument[]> {
        return this._httpClient.get<Instrument[]>(`http://localhost:8080/api/post/posts`);
    }

    getPostsByUserId(id: number): Observable<Instrument[]> {
        return this._httpClient.get<Instrument[]>(`http://localhost:8080/api/post/postsByUserId/${id}`)
    }

    private apiUrl = 'http://localhost:8080/api/instrument';

  

    // ✅ פונקציה לאחזור כל הכלים
    getInstruments(): Observable<Instrument[]> {
        return this._httpClient.get<Instrument[]>(`${this.apiUrl}/instruments`);
    }


    //Post
    // uploadPost(post: Post): Observable<Post> {
    //     return this._httpClient.post<Post>(`http://localhost:8080/api/Post/uploadPost`, post);
    // }


}
