import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import sheetMusic, { DifficultyLevel, Scale } from '../Models/SheetMusic';
import Instrument from '../Models/Instrument';
import SheetMusicCategory from '../Models/SheetMusicCategory';
import Users from '../Models/Users';
import { Observable } from 'rxjs';
import { SheetMusicResponseAI } from '../Models/SheetMusicResponseAI';
import SheetMusic from '../Models/SheetMusic';

@Injectable({
  providedIn: 'root'
})
export class SheetMusicService {
  private apiUrl = 'http://localhost:8080/api/sheetMusic';

  constructor(private http: HttpClient) { }




  // ✅ פונקציה חדשה לניתוח PDF עם AI
  analyzePDF(file: File): Observable<SheetMusicResponseAI> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    // 💡 שימו לב: הקריאה היא ל-analyzePDF מה-SheetMusicAIController בשרת
    return this.http.post<SheetMusicResponseAI>(`${this.apiUrl}/analyzePDF`, formData, { withCredentials: true });
  }

  // ... שאר המתודות ...

  // 💡 עדכון קל ב-uploadSheetMusic כדי לכלול את שדות המלל החדשים
  // (בהנחה שזה DTO חדש ששולח את הכלים והקטגוריות כרשימה)
  uploadSheetMusic(formData: FormData): Observable<sheetMusic> {
    return this.http.post<sheetMusic>(`${this.apiUrl}/uploadSheetMusic`, formData, { withCredentials: true });
  }

  getSheetMusicById(id: number): Observable<sheetMusic> {
    return this.http.get<sheetMusic>(`${this.apiUrl}/sheetMusicById/${id}`, { withCredentials: true });
  }

   getSheetsMusicByTitle(title: string): Observable<sheetMusic[]> {
    return this.http.get<sheetMusic[]>(`${this.apiUrl}/sheetsMusicByTitle/${title}`, { withCredentials: true });
  }

  getAllSheetMusics(): Observable<sheetMusic[]> {
    return this.http.get<sheetMusic[]>(`${this.apiUrl}/sheetsMusic`, { withCredentials: true });
  }

  getSheetMusicsByUserId(id: number): Observable<sheetMusic[]> {
    return this.http.get<sheetMusic[]>(`${this.apiUrl}/sheetsMusicByUserId/${id}`, { withCredentials: true });
  }

  getFavoritesSheetMusicsByUserId(id: number): Observable<sheetMusic[]> {
    return this.http.get<sheetMusic[]>(`${this.apiUrl}/favoriteSheetsMusicByUserId/${id}`, { withCredentials: true });
  }

  getSheetsMusicByName(name: string): Observable<sheetMusic[]> {
    return this.http.get<sheetMusic[]>(`${this.apiUrl}/sheetsMusic/${name}`, { withCredentials: true });
  }

  getSheetsMusicByDifficultyLevel(difficulty_level: DifficultyLevel): Observable<sheetMusic[]> {
    return this.http.get<sheetMusic[]>(`${this.apiUrl}/sheetsMusicByDifficultyLevel/${difficulty_level}`, { withCredentials: true });
  }
}
