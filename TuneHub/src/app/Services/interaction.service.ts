// src/app/services/interaction.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import Follow, { EFollowStatus } from '../Models/Follow'; // ✅ ייבוא ה־enum

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

  constructor(private http: HttpClient) { }

  toggleFollow(targetUserId: number): Observable<EFollowStatus> {
    return this.http.post<EFollowStatus>(`${this.apiUrl}/follow/toggle/${targetUserId}`, {}, { withCredentials: true });
  }

  getFollowStatus(targetUserId: number): Observable<EFollowStatus> {
    return this.http.get<EFollowStatus>(`${this.apiUrl}/follow/status/${targetUserId}`, { withCredentials: true });
  }

  addLike(targetType: string, targetId: number): Observable<NotificationSimpleDTO> {
    return this.http.post<NotificationSimpleDTO>(
      `${this.apiUrl}/like/add/${targetType}/${targetId}`, {}, { withCredentials: true }
    );
  }

  removeLike(targetType: string, targetId: number): Observable<NotificationSimpleDTO> {
    return this.http.delete<NotificationSimpleDTO>(
      `${this.apiUrl}/like/remove/${targetType}/${targetId}`, { withCredentials: true } );
  }


  addFavorite(targetType: string, targetId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/favorite/add/${targetType}/${targetId}`, {}, { withCredentials: true } );
  }

  removeFavorite(targetType: string, targetId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/favorite/remove/${targetType}/${targetId}`, { withCredentials: true } );
  }

  approveFollow(followerId: number) {
    return this.http.post(
      `${this.apiUrl}/follow/approve/${followerId}`,
      {},
      { withCredentials: true }
    );
  }
}
