import { Component, OnInit, OnDestroy } from '@angular/core';
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

  activeCategory: ENotificationCategory | 'ALL' = 'ALL';

  categories: { key: ENotificationCategory | 'ALL'; label: string; unreadCount: number }[] = [
    { key: 'ALL', label: 'All', unreadCount: 0 },
    { key: ENotificationCategory.FOLLOW_UPDATES, label: 'Follow Updates', unreadCount: 0 },
    { key: ENotificationCategory.LIKES_FAVORITES, label: 'Likes & Favorites', unreadCount: 0 },
    { key: ENotificationCategory.COMMENTS, label: 'Comments', unreadCount: 0 },
    { key: ENotificationCategory.APPROVED_FOLLOWS, label: 'Approved Follows', unreadCount: 0 },
    { key: ENotificationCategory.FOLLOW_REQUESTS, label: 'Follow Requests', unreadCount: 0 },
    { key: ENotificationCategory.ADMIN, label: 'Admin Messages', unreadCount: 0 }
  ];
;

  constructor(
    private _notificationService: NotificationService,  private _interactionService: InteractionService
  ) {}


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
      this.stompClient?.subscribe('/user/queue/notifications', (msg: IMessage) => {
        const notification: NotificationResponseDTO = JSON.parse(msg.body);
        this.notifications.unshift(notification);
        this._notificationService.incrementUnreadCount();
        this.applyFilter();
      });

      this.stompClient?.subscribe('/user/queue/notifications/mark-all-read', () => {
        this.notifications.forEach(n => n.isRead = true);
        this._notificationService.resetUnreadCount();
        this.applyFilter();
      });
    };

    this.stompClient.activate();
  }


  markAsRead(notification: NotificationResponseDTO) {
    if (!notification.isRead) {
      this._notificationService.markAsRead(notification.id).subscribe(() => {
        notification.isRead = true;
        this._notificationService.decrementUnreadCount();
        this.applyFilter();
      });
    }
  }


  markAllAsRead(): void {
    this._notificationService.markAllAsRead().subscribe({
      next: () => {
        this.notifications.forEach(n => n.isRead = true);
        this._notificationService.resetUnreadCount();
        this.applyFilter();
      },
      error: err => console.error('Failed to mark all as read', err)
    });
  }


  deleteNotification(id: number) {
    this._notificationService.deleteNotification(id).subscribe(() => {
      this.notifications = this.notifications.filter(n => n.id !== id);
      this.applyFilter();
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
    this.page = 0;
    this.notifications = [];
    this.hasMore = true;
  }

  let request$;

  if (this.unreadOnly) {
    request$ = this._notificationService.getUnreadByCategory(
      this.page,
      this.size,
      this.activeCategory === 'ALL' ? undefined  : this.activeCategory
    );

    
  } else {
    request$ = this._notificationService.getAllByCategory(
      this.page,
      this.size,
      this.activeCategory === 'ALL' ? undefined  : this.activeCategory
    );
  }

  request$.subscribe(pageData => {
    this.notifications.push(...pageData.content);
    if (pageData.last) this.hasMore = false;
    this.applyFilter();
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
    if (this.activeCategory === 'ALL') {
      const order: ENotificationCategory[] = [
        ENotificationCategory.FOLLOW_UPDATES,
        ENotificationCategory.LIKES_FAVORITES,
        ENotificationCategory.COMMENTS,
        ENotificationCategory.APPROVED_FOLLOWS,
        ENotificationCategory.FOLLOW_REQUESTS,
        ENotificationCategory.ADMIN
      ];

      this.filteredNotifications = this.notifications
        .slice()
        .sort((a, b) => order.indexOf(a.type) - order.indexOf(b.type));

    } else {
      this.filteredNotifications = this.notifications.filter(
        n => n.type === this.activeCategory
      );
    }
  }

}

