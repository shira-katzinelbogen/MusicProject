import { Injectable, NgZone } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject, Observable, tap } from 'rxjs';

/**
 * @service NotificationService
 * @description Centralized service for managing real-time notifications via Socket.io 
 * and handling persistent notification data through REST API integration.
 */
@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    /** @description Backend API base endpoint for notifications */
    private readonly apiUrl = 'http://localhost:3000/api/notifications';

    /** @description WebSocket server URL */
    private readonly socketUrl = 'http://localhost:3000';

    /** @description Internal Socket.io instance */
    private socket: Socket | null = null;

    /** @description Reactive state management for the notification list */
    private notificationsSubject = new BehaviorSubject<any[]>([]);

    /** @description Public observable for components to subscribe to notification updates */
    public notifications$ = this.notificationsSubject.asObservable();

    /** @description Reactive state for the unread count only */
    private unreadCountSubject = new BehaviorSubject<number>(0);
    public unreadCount$ = this.unreadCountSubject.asObservable();

    constructor(private http: HttpClient, private zone: NgZone) { }

    /**
     * @description Establishes a WebSocket connection tailored to a specific user.
     * Implements singleton pattern to ensure only one active connection exists.
     * @param userId The unique identifier of the user for room-based targeting.
     */
    public connectSocket(userId: string): void {
        // Prevent multiple concurrent connections
        if (this.socket) {
            this.socket.disconnect();
        }

        /** * Configuration includes:
         * 1. query: Passes userId for server-side room assignment.
         * 2. transports: Forces 'websocket' for superior performance over long-polling.
         */
        this.socket = io(this.socketUrl, {
            query: { userId },
            transports: ['websocket']
        });

        // Event listener for new incoming notifications
        this.socket.on('new_notification', (notification: any) => {
            this.zone.run(() => {
                this.handleIncomingNotification(notification);

                const current = this.unreadCountSubject.value;
                this.unreadCountSubject.next(current + 1);
            });
        });

        // Event listener for real-time deletion (e.g., unliking content)
        this.socket.on('delete_notification', (id: string) => {
            const currentList = this.notificationsSubject.value.filter(n =>
                (n.id || n._id) !== id
            );
            this.notificationsSubject.next(currentList);
        });
    }

    /**
     * @description Fetches paginated notification history from the database.
     * @param userId User identifier for history retrieval.
     * @param page Current page number for infinite scroll.
     * @returns Observable of the paginated API response.
     */
    public getNotifications(userId: string, page: number = 1): Observable<any> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('limit', '20');

        return this.http.get<any>(`${this.apiUrl}/${userId}`, { params });
    }

    /**
     * @description Updates a notification's status to 'read' on the server.
     * @param notificationId The ID of the notification to be updated.
     */
    public markAsRead(notificationId: string): Observable<any> {
        return this.http.patch(`${this.apiUrl}/${notificationId}/read`, {}).pipe(
            tap(() => {
                const current = this.unreadCountSubject.value;
                if (current > 0) {
                    this.unreadCountSubject.next(current - 1);
                }
            })
        );
    }

    /**
       * @description Batch updates all notifications for a specific user as read.
       * @param userId Target user ID.
       */
    public markAllAsRead(userId: string): Observable<any> {
        return this.http.patch(`${this.apiUrl}/mark-all-read/${userId}`, {}).pipe(
            tap(() => {
                this.unreadCountSubject.next(0);
            })
        );
    }

    /**
     * @description Permanently removes a notification from the database.
     * @param notificationId The ID of the notification to be deleted.
     */
    public deleteNotification(notificationId: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${notificationId}`);
    }

    /**
    * @description Appends new notifications while preventing duplicates based on ID.
    * @param {Array} newNotifications - Array of notifications from API.
    */
    public appendNotifications(newNotifications: any[]): void {
        const current = this.notificationsSubject.value;
        const uniqueNew = newNotifications.filter(newNote =>
            !current.some(existingNote => (existingNote.id || existingNote._id) === (newNote.id || newNote._id))
        );
        this.notificationsSubject.next([...current, ...uniqueNew]);
    }

    /**
     * @description Processes incoming socket messages with duplicate detection logic.
     * If an unread notification of the same type and entity exists, it updates it.
     * Otherwise, it prepends the new notification to ensure "last-in-first-out" visibility.
     */
    private handleIncomingNotification(notification: any): void {
        const currentList = [...this.notificationsSubject.value];

        // Logical check for existing unread notifications relating to the same entity
        const existingIndex = currentList.findIndex(n =>
            n.entityId === notification.entityId &&
            n.type === notification.type &&
            !n.isRead
        );

        if (existingIndex > -1) {
            // Update existing entry (e.g., incrementing a like counter or updating timestamp)
            currentList[existingIndex] = notification;
            this.notificationsSubject.next(currentList);
        } else {
            // Add new notification to the top of the list
            this.notificationsSubject.next([notification, ...currentList]);
        }
    }

    /**
     * @description Safe cleanup method to terminate socket connections.
     */
    public disconnect(): void {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
        this.notificationsSubject.next([]);
    }

    /**
 * @description Fetches only the number of unread notifications from the server.
 */
    public getUnreadCount(userId: string): void {
        this.http.get<{ unreadCount: number }>(`${this.apiUrl}/unread-count/${userId}`)
            .subscribe(res => {
                this.unreadCountSubject.next(res.unreadCount);
            });
    }

    public resetUnreadCount(): void {
        this.unreadCountSubject.next(0);
    }

    markAsUnread(id: string): Observable<any> {
        return this.http.patch(`${this.apiUrl}/${id}/unread`, {});
    }
}