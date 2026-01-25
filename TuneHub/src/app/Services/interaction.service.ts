import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import Follow, { EFollowStatus } from '../Models/Follow';
import { Favorite, FavoriteType } from '../Models/Favorite';

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
  private favoritesOpen = new BehaviorSubject<boolean>(false);

  constructor(private _httpClient: HttpClient) { }

  toggleFollow(targetUserId: number): Observable<EFollowStatus> {
    return this._httpClient.post<EFollowStatus>(`${this.apiUrl}/follow/toggle/${targetUserId}`, {}, { withCredentials: true });
  }

  getFollowStatus(targetUserId: number): Observable<EFollowStatus> {
    return this._httpClient.get<EFollowStatus>(`${this.apiUrl}/follow/status/${targetUserId}`, { withCredentials: true });
  }

  addLike(targetType: string, targetId: number): Observable<NotificationSimpleDTO> {
    return this._httpClient.post<NotificationSimpleDTO>(
      `${this.apiUrl}/like/add/${targetType}/${targetId}`, {}, { withCredentials: true }
    );
  }

  removeLike(targetType: string, targetId: number): Observable<NotificationSimpleDTO> {
    return this._httpClient.delete<NotificationSimpleDTO>(
      `${this.apiUrl}/like/remove/${targetType}/${targetId}`, { withCredentials: true });
  }

  addFavorite(targetType: string, targetId: number): Observable<any> {
    return this._httpClient.post(`${this.apiUrl}/favorite/add/${targetType}/${targetId}`, {}, { withCredentials: true });
  }

  removeFavorite(targetType: string, targetId: number): Observable<any> {
    return this._httpClient.delete(`${this.apiUrl}/favorite/remove/${targetType}/${targetId}`, { withCredentials: true });
  }

  approveFollow(followerId: number) {
    return this._httpClient.post(
      `${this.apiUrl}/follow/approve/${followerId}`,
      {},
      { withCredentials: true }
    );
  }

  getFavoritesByType(type: FavoriteType, search: string = ''): Observable<Favorite[]> {
    const serverType = type.toUpperCase().replace(' ', '_') as FavoriteType;
    let params = { type: serverType, search: search };
    return this._httpClient.get<Favorite[]>(`${this.apiUrl}/byType`, {
      params: params,
      withCredentials: true
    });
  }
}
