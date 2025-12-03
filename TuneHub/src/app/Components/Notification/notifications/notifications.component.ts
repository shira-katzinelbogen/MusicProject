import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { NotificationResponseDTO, ENotificationCategory } from '../../../Models/Notification';
import { NotificationService } from '../../../Services/notification.service';
import { InteractionService } from '../../../Services/interaction.service';
import { TimeAgoPipe } from "../../Shared/time-ago-pipe/time-ago-pipe.component";
import { CommonModule } from '@angular/common';
import { MatIconModule } from "@angular/material/icon";
import SockJS from 'sockjs-client';
import { Client, IMessage } from '@stomp/stompjs';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css'],
  imports: [TimeAgoPipe, CommonModule, MatIconModule]
})
export class NotificationsComponent implements OnInit, OnDestroy {

  private stompClient: Client | null = null;
  private unreadSub!: Subscription;

  notifications: NotificationResponseDTO[] = [];
  filteredNotifications: NotificationResponseDTO[] = [];
  unreadCount = 0;

  page = 0;
  size = 10;
  hasMore = true;
  unreadOnly = false;

  thisWeekCount: number = 0;
  newFollowersCount: number = 0;
  interactionsCount: number = 0;

  activeCategory: ENotificationCategory | 'ALL' = 'ALL';

  private interactionTypes = [
    ENotificationCategory.FOLLOW_UPDATES,
    ENotificationCategory.LIKES_FAVORITES,
    ENotificationCategory.COMMENTS,
    ENotificationCategory.FOLLOW_REQUESTS
  ];

  categories: { key: ENotificationCategory | 'ALL'; label: string; unreadCount: number }[] = [
    { key: 'ALL', label: 'All', unreadCount: 0 },
    { key: ENotificationCategory.FOLLOW_UPDATES, label: 'Follow Updates', unreadCount: 0 },
    { key: ENotificationCategory.LIKES_FAVORITES, label: 'Likes & Favorites', unreadCount: 0 },
    { key: ENotificationCategory.COMMENTS, label: 'Comments', unreadCount: 0 },
    { key: ENotificationCategory.APPROVED_FOLLOWS, label: 'Approved Follows', unreadCount: 0 },
    { key: ENotificationCategory.FOLLOW_REQUESTS, label: 'Follow Requests', unreadCount: 0 },
    { key: ENotificationCategory.ADMIN, label: 'Admin Messages', unreadCount: 0 }
  ];

  constructor(
    private _notificationService: NotificationService,
    private _interactionService: InteractionService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadNotifications();
    this.loadUnreadCount();
    this.initWebSocketConnection();

    this.unreadSub = this._notificationService.unreadCount$.subscribe(count => {
      this.unreadCount = count;
      this.refreshCategoryUnreadCounters();
    });
  }

  ngOnDestroy(): void {
    this.unreadSub?.unsubscribe();
    if (this.stompClient) this.stompClient.deactivate();
  }

  private initWebSocketConnection(): void {
    const socket = new SockJS('http://localhost:8080/ws-notifications');

    this.stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
    });

    this.stompClient.onConnect = () => {

      // 🔔 Notification received
      this.stompClient?.subscribe('/user/queue/notifications', (msg: IMessage) => {

        const notification: NotificationResponseDTO = JSON.parse(msg.body);
        this.notifications.unshift(notification);

        this._notificationService.incrementUnreadCount();

        this.applyFilter();
        this.calculateUnread();
        this.calculateThisWeek();
        this.calculateNewFollowers();
        this.calculateInteractions();
      });

      // 📌 Mark all as read
      this.stompClient?.subscribe('/user/queue/notifications/mark-all-read', () => {
        this.notifications = this.notifications.map(n => ({
          ...n,
          isRead: true
        }));

        this._notificationService.resetUnreadCount();

        this.applyFilter();
        this.calculateUnread();
        this.calculateThisWeek();
        this.calculateNewFollowers();
        this.calculateInteractions();

        this.cdr.detectChanges();
      });
    };

    this.stompClient.activate();
  }

  markAsRead(notification: NotificationResponseDTO) {
    if (!notification.isRead) {
      this._notificationService.markAsRead(notification.id).subscribe({
        next: () => {
          this.notifications = this.notifications.map(n =>
            n.id === notification.id ? { ...n, isRead: true } : n
          );

          this._notificationService.decrementUnreadCount();

          this.applyFilter();
          this.calculateUnread();
          this.calculateThisWeek();
          this.calculateNewFollowers();
          this.calculateInteractions();

          this.cdr.detectChanges();
        },
        error: err => console.error('Failed to mark as read:', err)
      });
    }
  }


  markAllAsRead(): void {
    this._notificationService.markAllAsRead().subscribe({
      next: () => {
        this.notifications = this.notifications.map(n => ({
          ...n,
          isRead: true
        }));

        this._notificationService.resetUnreadCount();

        this.applyFilter();
        this.calculateUnread();
        this.calculateThisWeek();
        this.calculateNewFollowers();
        this.calculateInteractions();

        this.refreshCategoryUnreadCounters();

        this.cdr.detectChanges();
      },
      error: err => console.error('Failed to mark all as read', err)
    });
  }

  deleteNotification(id: number) {
    this._notificationService.deleteNotification(id).subscribe(() => {
      this.notifications = this.notifications.filter(n => n.id !== id);
      this.applyFilter();

      this.calculateUnread();
      this.calculateThisWeek();
      this.calculateNewFollowers();
      this.calculateInteractions();
    });
  }

  approveFollow(followerId: number) {
    this._interactionService.approveFollow(followerId).subscribe();
  }

  refreshCategoryUnreadCounters() {
    this._notificationService.getUnreadCountByCategory().subscribe(unreadMap => {
      this.categories.forEach(c => {
        c.unreadCount = unreadMap[c.key as string] ?? 0;
      });
    });
  }

  loadNotifications(reset = false) {
    if (reset) {
      this.notifications = [];
      this.hasMore = true;
    }

    let request$;

    if (this.unreadOnly) {
      request$ = this._notificationService.getUnreadByCategory(
        this.activeCategory === 'ALL' ? undefined : this.activeCategory
      );
    } else {
      request$ = this._notificationService.getAllByCategory(
        this.activeCategory === 'ALL' ? undefined : this.activeCategory
      );
    }

    request$.subscribe({
      next: (pageData) => {
        this.notifications.push(...pageData.content);
        if (pageData.last) this.hasMore = false;

        this.applyFilter();
        this.calculateUnread();
        this.calculateThisWeek();
        this.calculateNewFollowers();
        this.calculateInteractions();
      },
      error: err => console.error('Failed to load notifications:', err)
    });
  }

  private loadUnreadCount(): void {
    this._notificationService.loadUnreadCount();
  }

  setActiveCategory(cat: ENotificationCategory | 'ALL') {
    this.activeCategory = cat;
    this.loadNotifications(true);
  }

  getIconForType(type: ENotificationCategory): string {
    switch (type) {
      case ENotificationCategory.FOLLOW_REQUESTS: return '👤';
      case ENotificationCategory.APPROVED_FOLLOWS: return '✅';
      case ENotificationCategory.LIKES_FAVORITES: return '👍';
      case ENotificationCategory.ADMIN: return '🚨';
      case ENotificationCategory.COMMENTS: return '💬';
      case ENotificationCategory.FOLLOW_UPDATES: return '🔔';
    }
  }

  loadMore() {
    this.page++;
    this.loadNotifications();
  }

  toggleUnread() {
    this.unreadOnly = !this.unreadOnly;
    this.loadNotifications(true);
  }

  private applyFilter(): void {
    let tempNotifications = this.notifications.slice();

    if (this.unreadOnly) {
      tempNotifications = tempNotifications.filter(n => !n.isRead);
    }

    this.filteredNotifications = tempNotifications;
  }

  shouldShowActions(notification: any): boolean {
    if (!notification.isRead) return true;

    const specialTypes = ['ADMIN', 'COMMENTS', 'FOLLOW_REQUESTS'];
    if (specialTypes.includes(notification.type)) return true;

    return false;
  }

  private calculateUnread() {
    this.unreadCount = this.notifications.filter(n => !n.isRead).length;
  }

  private calculateThisWeek() {
    const now = new Date();

    this.thisWeekCount = this.notifications.filter(n => {
      const created = new Date(n.createdAt);
      if (isNaN(created.getTime())) return false; 

      const diffMs = now.getTime() - created.getTime();
      const diffDays = diffMs / (1000 * 60 * 60 * 24);

      return diffDays <= 7; 
    }).length;
  }


  private calculateNewFollowers() {
    this.newFollowersCount = this.notifications.filter(
      n => n.type === ENotificationCategory.FOLLOW_UPDATES
    ).length;
  }

  private calculateInteractions() {
    this.interactionsCount = this.notifications.filter(
      n => this.interactionTypes.includes(n.type)
    ).length;
  }

}
