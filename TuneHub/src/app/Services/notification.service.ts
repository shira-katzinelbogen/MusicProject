import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Service for handling real-time notifications.
 * Configuration is hardcoded for simplicity in the current environment.
 */
@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    // Direct API and Socket endpoints
    private readonly apiUrl = 'http://localhost:3000/api/notifications';
    private readonly socketUrl = 'http://localhost:3000';
    private socket: Socket;

    private notificationsSubject = new BehaviorSubject<any[]>([]);
    public notifications$ = this.notificationsSubject.asObservable();

    constructor(private http: HttpClient) {
        // Initialize Socket connection directly
        this.socket = io(this.socketUrl);
    }

    /**
     * Establishes real-time connection for a specific user.
     * @param userId Unique identifier of the user.
     */
    public connectSocket(userId: string): void {
        this.socket.emit('register', userId);

        this.socket.on('new_notification', (notification: any) => {
            this.handleIncomingNotification(notification);
        });
    }

    /**
     * Fetches notification history from the database.
     * @param userId User ID for retrieval.
     * @param page Pagination page number.
     */
    public getNotifications(userId: string, page: number = 1): Observable<any> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('limit', '20');

        return this.http.get<any>(`${this.apiUrl}/${userId}`, { params });
    }

    /**
   * @description Updates the status of a specific notification to 'read'.
   * @param notificationId The unique identifier of the notification to be updated.
   * @returns Observable of the API response.
   */
    public markAsRead(notificationId: string): Observable<any> {
        // Sends a PUT request to the specific notification endpoint
        return this.http.put(`${this.apiUrl}/mark-read/${notificationId}`, {});
    }

    /**
     * Adds fetched data to the observable state.
     */
    public appendNotifications(newNotifications: any[]): void {
        const current = this.notificationsSubject.value;
        this.notificationsSubject.next([...current, ...newNotifications]);
    }

    /**
     * Internal logic for handling new real-time messages.
     */
    private handleIncomingNotification(notification: any): void {
        const current = this.notificationsSubject.value;
        const index = current.findIndex(n =>
            n.entityId === notification.entityId &&
            n.type === notification.type &&
            !n.isRead
        );

        if (index > -1) {
            current[index] = notification;
            this.notificationsSubject.next([...current]);
        } else {
            this.notificationsSubject.next([notification, ...current]);
        }
    }

    /**
   * Update all notifications for a specific user to 'read' status.
   */
    public markAllAsRead(userId: string): Observable<any> {
        return this.http.put(`${this.apiUrl}/mark-all-read/${userId}`, {});
    }

    /**
     * Permanently delete a notification record.
     */
    public deleteNotification(notificationId: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${notificationId}`);
    }
}