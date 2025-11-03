
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import SheetMusic, { DifficultyLevel } from '../Models/SheetMusic';

@Injectable({
    providedIn: 'root'
})

export class SheetMusicService {

    public sheetMusics: SheetMusic[] = [];
    public count = 0;

    constructor(private _httpClient: HttpClient) { }

    //Get
    getSheetMusicById(id: number): Observable<SheetMusic> {
        return this._httpClient.get<SheetMusic>(`http://localhost:8080/api/sheetMusic/sheetMusicById/${id}`);
    }

    getSheetMusics(): Observable<SheetMusic[]> {
        return this._httpClient.get<SheetMusic[]>(`http://localhost:8080/api/sheetMusic/sheetsMusic`);
    }

    getSheetMusicsByUserId(id: number): Observable<SheetMusic[]> {
        return this._httpClient.get<SheetMusic[]>(`http://localhost:8080/api/sheetMusic/sheetsMusicByUserId/${id}`)
    }

     getFavoritesSheetMusicsByUserId(id: number): Observable<SheetMusic[]> {
        return this._httpClient.get<SheetMusic[]>(`http://localhost:8080/api/sheetMusic/favoriteSheetsMusicByUserId/${id}`)
    }
    
    getSheetsMusicByName(name: String): Observable<SheetMusic[]> {
        return this._httpClient.get<SheetMusic[]>(`http://localhost:8080/api/sheetMusic/sheetsMusic/${name}`)
    }

    getSheetsMusicByDifficultyLevel(difficulty_level: DifficultyLevel): Observable<SheetMusic[]> {
        return this._httpClient.get<SheetMusic[]>(`http://localhost:8080/api/sheetMusic/sheetsMusicByDifficultyLevel/${difficulty_level}`)
    }

    
}