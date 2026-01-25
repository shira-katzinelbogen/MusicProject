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
    private apiUrl = 'http://localhost:8080/api';

    constructor(private _httpClient: HttpClient) { }

    //Get
    getInstruments(): Observable<Instrument[]> {
        return this._httpClient.get<Instrument[]>(`${this.apiUrl}/instrument/instruments`, { withCredentials: true });
    }

    getInstrumentById(id: number): Observable<Instrument> {
        return this._httpClient.get<Instrument>(`${this.apiUrl}/instrument/instrumentById/${id}`);
    }

    getInstrumentsByUserId(id: number): Observable<Instrument[]> {
        return this._httpClient.get<Instrument[]>(`${this.apiUrl}/users/${id}/instruments`)
    }

    getPostById(id: number): Observable<Instrument> {
        return this._httpClient.get<Instrument>(`${this.apiUrl}/post/postById/${id}`, { withCredentials: true });
    }

    getPosts(): Observable<Instrument[]> {
        return this._httpClient.get<Instrument[]>(`${this.apiUrl}/post/posts`, { withCredentials: true });
    }

    getPostsByUserId(id: number): Observable<Instrument[]> {
        return this._httpClient.get<Instrument[]>(`${this.apiUrl}/post/postsByUserId/${id}`, { withCredentials: true })
    }
}
