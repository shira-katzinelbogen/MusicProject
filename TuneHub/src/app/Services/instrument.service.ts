
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
  
 // ✅ פונקציה לאחזור כל הכלים
    getInstruments(): Observable<Instrument[]> {
        return this._httpClient.get<Instrument[]>(`${this.apiUrl}/instruments`, { withCredentials: true });
    }

    // ✅ תיקון שמות מתודות דומות (אם נחוץ)
    getInstrumentById(id: number): Observable<Instrument> {
        // נתיב API דמה לטובת כלי נגינה ב-Java
        return this._httpClient.get<Instrument>(`http://localhost:8080/api/instrument/instrumentById/${id}`);
    }

    getInstrumentsByUserId(id: number): Observable<Instrument[]> {
        // נתיב API דמה לטובת כלי נגינה של משתמש ב-Java
        return this._httpClient.get<Instrument[]>(`http://localhost:8080/api/users/${id}/instruments`)
    }
    getPostById(id: number): Observable<Instrument> {
        return this._httpClient.get<Instrument>(`http://localhost:8080/api/post/postById/${id}`, { withCredentials: true });
    }

    getPosts(): Observable<Instrument[]> {
        return this._httpClient.get<Instrument[]>(`http://localhost:8080/api/post/posts`, { withCredentials: true });
    }

    getPostsByUserId(id: number): Observable<Instrument[]> {
        return this._httpClient.get<Instrument[]>(`http://localhost:8080/api/post/postsByUserId/${id}`, { withCredentials: true })
    }

    private apiUrl = 'http://localhost:8080/api/instrument';

  

   


    //Post
    // uploadPost(post: Post): Observable<Post> {
    //     return this._httpClient.post<Post>(`http://localhost:8080/api/Post/uploadPost`, post);
    // }


}
