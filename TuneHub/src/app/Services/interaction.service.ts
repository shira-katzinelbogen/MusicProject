// src/app/services/interaction.service.ts (השינוי העיקרי כאן)
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface NotificationSimpleDTO {
  targetId: number;
  count: number;
  isRead: boolean; 
}

@Injectable({
  providedIn: 'root'
})
export class InteractionService {
  private apiUrl = 'http://localhost:8080/api/interaction'; 

  constructor(private http: HttpClient) {}

  /**
   * הוספת לייק: משתמש בשיטת POST.
   */
  addLike(targetType: string, targetId: number): Observable<NotificationSimpleDTO> {
    const url = `${this.apiUrl}/like/add/${targetType}/${targetId}`;
    // POST הוא ליצירת משאב
    return this.http.post<NotificationSimpleDTO>(url, {});
  }
  
  /**
   * הסרת לייק: משתמש בשיטת DELETE.
   */
  removeLike(targetType: string, targetId: number): Observable<NotificationSimpleDTO> {
    const url = `${this.apiUrl}/like/remove/${targetType}/${targetId}`;
    // DELETE הוא למחיקת משאב
    return this.http.delete<NotificationSimpleDTO>(url); 
  }
}