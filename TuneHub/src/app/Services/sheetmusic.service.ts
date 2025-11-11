
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
    private apiUrl = 'http://localhost:8080/api/sheetMusic';

    constructor(private _httpClient: HttpClient) { }

    //Get
    getSheetMusicById(id: number): Observable<SheetMusic> {
        return this._httpClient.get<SheetMusic>(`${this.apiUrl}/sheetMusicById/${id}`);
    }

    getAllSheetMusics(): Observable<SheetMusic[]> {
        return this._httpClient.get<SheetMusic[]>(`${this.apiUrl}/sheetsMusic`);
    }

    getSheetMusicsByUserId(id: number): Observable<SheetMusic[]> {
        return this._httpClient.get<SheetMusic[]>(`${this.apiUrl}/sheetsMusicByUserId/${id}`)
    }

    getFavoritesSheetMusicsByUserId(id: number): Observable<SheetMusic[]> {
        return this._httpClient.get<SheetMusic[]>(`${this.apiUrl}/favoriteSheetsMusicByUserId/${id}`)
    }

    getSheetsMusicByName(name: String): Observable<SheetMusic[]> {
        return this._httpClient.get<SheetMusic[]>(`${this.apiUrl}/sheetsMusic/${name}`)
    }

    getSheetsMusicByDifficultyLevel(difficulty_level: DifficultyLevel): Observable<SheetMusic[]> {
        return this._httpClient.get<SheetMusic[]>(`${this.apiUrl}/sheetsMusicByDifficultyLevel/${difficulty_level}`)
    }

    //Post
    // uploadSheetMusic(sheet_music: SheetMusic): Observable<SheetMusic> {
    //     return this._httpClient.post<SheetMusic>(`${this.apiUrl}/uploadSheetMusic`,sheet_music)
    // }

    uploadSheetMusic(data: SheetMusic, file: File): Observable<SheetMusic> {
        const formData = new FormData();
        formData.append('file', file, file.name);
        formData.append('data', JSON.stringify(data));
        return this._httpClient.post<SheetMusic>(
            `${this.apiUrl}/uploadSheetMusic`,
            formData
        );
    }

}