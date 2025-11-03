
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import SheetMusicCategory from '../Models/SheetMusicCategory';

@Injectable({
    providedIn: 'root'
})

export class SheetMusicCategoryService {

    public sheetMusicCategories: SheetMusicCategory[] = [];
    public count = 0;

    constructor(private _httpClient: HttpClient) { }

    //Get
    getSheetMusicCategoryById(id: number): Observable<SheetMusicCategory> {
        return this._httpClient.get<SheetMusicCategory>(`http://localhost:8080/api/sheetMusicCategory/sheetMusicCategoryById/${id}`);
    }

    getSheetMusicCategories(): Observable<SheetMusicCategory[]> {
        return this._httpClient.get<SheetMusicCategory[]>(`http://localhost:8080/api/sheetMusicCategory/sheetMusicCategories`);
    }

    getSheetsMusicCategoryByName(name: String): Observable<SheetMusicCategory[]> {
        return this._httpClient.get<SheetMusicCategory[]>(`http://localhost:8080/api/sheetMusic/sheetsMusicCategoryByName/${name}`)
    }

    
   

}