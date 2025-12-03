import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { NotificationResponseDTO } from '../Models/Notification';
import { Page } from '../Models/page';
import { map } from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private apiUrl = 'http://localhost:8080/api/notification';
    private unreadCountSubject = new BehaviorSubject<number>(0);
    unreadCount$ = this.unreadCountSubject.asObservable();

    constructor(private http: HttpClient) { }

    loadUnreadCount(): void {
        this.getUnreadCount().subscribe(count => this.unreadCountSubject.next(count));
    }

    incrementUnreadCount() {
        this.unreadCountSubject.next(this.unreadCountSubject.value + 1);
    }

    resetUnreadCount() {
        this.unreadCountSubject.next(0);
    }

    getNotifications(page: number, size: number, category?: string, unreadOnly?: boolean) {
        let params = new HttpParams()
            .set("page", page)
            .set("size", size);

        if (category && category !== 'ALL') params = params.set("category", category);
        if (unreadOnly) params = params.set("unreadOnly", true);

        return this.http.get<Page<NotificationResponseDTO>>(this.apiUrl, {
            params,
            withCredentials: true
        });
    }


    getUnreadCount() {
        return this.http.get<number>(`${this.apiUrl}/unread-count`, {
            withCredentials: true
        });
    }


    markAsRead(id: number) {
        return this.http.post(`${this.apiUrl}/${id}/read`, {}, {
            withCredentials: true
        });
    }

    markAllAsRead() {
        return this.http.post(`${this.apiUrl}/read-all`, {}, {
            withCredentials: true
        });
    }

    deleteNotification(id: number) {
        return this.http.delete(`${this.apiUrl}/${id}`, {
            withCredentials: true
        });
    }

    decrementUnreadCount() {
        const currentCount = this.unreadCountSubject.value;
        if (currentCount > 0) {
            this.unreadCountSubject.next(currentCount - 1);
        }
    }

    getAllByCategory(category?: string) {
        let params = new HttpParams()

        if (category) params = params.set("category", category);

        return this.http.get<Page<NotificationResponseDTO>>(
            `${this.apiUrl}/allNotificationsByCategory`,
            { params, withCredentials: true }
        );
    }

    getUnreadByCategory(category?: string) {
        let params = new HttpParams()

        if (category) params = params.set("category", category);

        return this.http.get<Page<NotificationResponseDTO>>(
            `${this.apiUrl}/onlyUnreadNotificationsByCategory`,
            { params, withCredentials: true }
        );
    }
    getUnreadCountByCategory(): Observable<{ [key: string]: number }> {
        return this.http.get<{ [key: string]: number }>(`${this.apiUrl}/unreadByType`, { withCredentials: true });
    }

}
