import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import sheetMusic, { DifficultyLevel, Scale } from '../Models/SheetMusic';
import Instrument from '../Models/Instrument';
import SheetMusicCategory from '../Models/SheetMusicCategory';
import Users from '../Models/Users';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SheetMusicService {
  private apiUrl = 'http://localhost:8080/api/sheetMusic';

  constructor(private http: HttpClient) {}

  uploadSheetMusic(data: sheetMusic, file: File): Observable<sheetMusic> {
    const formData = new FormData();

    // 1️⃣ הקובץ עצמו
    formData.append('file', file, file.name);

    // 2️⃣ המרת IDs לוודא שהם מספרים
    const categoryId = data.category?.id ? Number(data.category.id) : null;
    const instrumentIds = data.instruments?.map(instr => ({ id: Number(instr.id) })) || [];
    const userId = data.user?.id ? Number(data.user.id) : null;

    // 3️⃣ המרת enums ל־string כפי ש־Spring Boot מצפה (אם הוא מקבל String)
    const levelStr = data.level !== undefined ? DifficultyLevel[data.level] : null;
    const scaleStr = data.scale !== undefined ? Scale[data.scale] : null;

    // 4️⃣ יצירת JSON מדויק עבור ה־DTO
    const dto = {
      name: data.name,
      level: levelStr,
      scale: scaleStr,
      category: categoryId !== null ? { id: categoryId } : null,
      instruments: instrumentIds,
      user: userId !== null ? { id: userId } : null,
      fileName: file.name
    };

    // const blob = new Blob([JSON.stringify(dto)], { type: 'application/json' });
    // formData.append('data', blob);
    formData.append('data', JSON.stringify(dto));

    // 5️⃣ שליחת POST
    return this.http.post<sheetMusic>(`${this.apiUrl}/uploadSheetMusic`, formData);
  }

  // פונקציות קריאה נוספות נשארות ללא שינוי
  getSheetMusicById(id: number): Observable<sheetMusic> {
    return this.http.get<sheetMusic>(`${this.apiUrl}/sheetMusicById/${id}`);
  }

  getAllSheetMusics(): Observable<sheetMusic[]> {
    return this.http.get<sheetMusic[]>(`${this.apiUrl}/sheetsMusic`);
  }

  getSheetMusicsByUserId(id: number): Observable<sheetMusic[]> {
    return this.http.get<sheetMusic[]>(`${this.apiUrl}/sheetsMusicByUserId/${id}`);
  }

  getFavoritesSheetMusicsByUserId(id: number): Observable<sheetMusic[]> {
    return this.http.get<sheetMusic[]>(`${this.apiUrl}/favoriteSheetsMusicByUserId/${id}`);
  }

  getSheetsMusicByName(name: string): Observable<sheetMusic[]> {
    return this.http.get<sheetMusic[]>(`${this.apiUrl}/sheetsMusic/${name}`);
  }

  getSheetsMusicByDifficultyLevel(difficulty_level: DifficultyLevel): Observable<sheetMusic[]> {
    return this.http.get<sheetMusic[]>(`${this.apiUrl}/sheetsMusicByDifficultyLevel/${difficulty_level}`);
  }
}
