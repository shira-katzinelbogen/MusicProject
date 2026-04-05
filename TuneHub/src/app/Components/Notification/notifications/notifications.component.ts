import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from "@angular/material/icon";
import { Subscription } from 'rxjs';
import { NotificationService } from '../../../Services/notification.service';
import { ENotificationCategory } from '../../../Models/Notification';
import { TimeAgoPipe } from "../../../Pipes/time-ago.pipe";
import { NoResultsComponent } from "../../Shared/no-results/no-results.component";
import { UserStateService } from "../../../Services/user-state.service"

/**
 * @description Advanced Notifications Component utilizing Angular Signals for optimal performance.
 * Features include real-time synchronization, multi-category filtering, and infinite scroll pagination.
 */
@Component({
  selector: 'app-notifications',
  standalone: true,
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css'],
  imports: [CommonModule, MatIconModule, TimeAgoPipe, NoResultsComponent]
})

/**
* @component NotificationsComponent
* @description Renders a reactive list of notifications with real-time updates.
*/
export class NotificationsComponent implements OnInit, OnDestroy {


  /** @property Explicitly defined as string to match MongoDB/Socket expectations */
  public userId!: string;
  private userSub: Subscription | undefined;
  private notificationsSub: Subscription | undefined;

  public notifications = signal<any[]>([]);

  // --- Reactive State Management (Signals) ---

  /** @property Currently selected filter category */
  public activeCategory = signal<ENotificationCategory | 'ALL'>('ALL');

  /** @property Toggle state for filtering only unread items */
  public unreadOnly = signal<boolean>(false);

  public currentPage = 1;
  public hasMore = true;

  /** @property UI configuration for category navigation */
  public readonly categories = [
    { key: 'ALL', label: 'All', icon: 'apps' },
    { key: ENotificationCategory.FOLLOW_UPDATES, label: 'Follows', icon: 'person_add' },
    { key: ENotificationCategory.LIKES_FAVORITES, label: 'Likes & Favorites', icon: 'favorite' },
    { key: ENotificationCategory.COMMENTS, label: 'Comments', icon: 'forum' },
    { key: ENotificationCategory.FOLLOW_REQUESTS, label: 'Requests', icon: 'pending' },
    { key: ENotificationCategory.ADMIN, label: 'System', icon: 'verified_user' }
  ];

  constructor(
    private notificationService: NotificationService,
    private userStateService: UserStateService
  ) { }


  ngOnInit(): void {
    /**
     * Reactive subscription to User State.
     * Ensures notifications are re-fetched if the user identity changes.
     */
    this.userSub = this.userStateService.currentUser$.subscribe(user => {
      if (user && user.id) {
        // Ensure ID is treated as a string for Socket.io rooms
        this.userId = String(user.id);

        this.fetchData();

        this.notificationsSub = this.notificationService.notifications$.subscribe(data => {
          this.notifications.set(data);
        });
      }
    });
  }

  /**
   * @description Computed signal that derives the filtered list based on active category and unread status.
   * Runs only when dependencies change, ensuring high efficiency.
   */
  public filteredNotifications = computed(() => {
    let list = this.notifications();

    // Filter by read status
    if (this.unreadOnly()) {
      list = list.filter(n => !n.isRead);
    }

    // Filter by category type
    if (this.activeCategory() !== 'ALL') {
      list = list.filter(n => n.type === this.activeCategory());
    }

    return list;
  });

  /**
   * @description Computed statistics for UI counters and dashboards.
   */
  public stats = computed(() => {
    const all = this.notifications();
    return {
      unread: all.filter(n => !n.isRead).length,
      thisWeek: all.filter(n => this.isWithinDays(n.createdAt, 7)).length,
      interactions: all.filter(n => n.type !== ENotificationCategory.ADMIN).length
    };
  });

  // --- Logic & API Interaction ---

  /**
   * @description Orchestrates the API call to populate the initial list.
   */
  public fetchData(): void {
    if (!this.userId) return;

    this.notificationService.getNotifications(this.userId, this.currentPage).subscribe({
      next: (res) => {
        const processedData = (res.data || []).map((note: any) => ({
          ...note,
          createdAt: note.createdAt ? new Date(note.createdAt) : new Date()
        }));
        this.notificationService.appendNotifications(processedData);
        this.hasMore = res.hasMore ?? false;
      }
    });
  }

  /** @description Cleanup subscriptions to prevent memory leaks */
  ngOnDestroy(): void {
    this.userSub?.unsubscribe();
    this.notificationsSub?.unsubscribe();
  }

  /** @description Updates the active category filter */
  public setCategory(key: any): void {
    this.activeCategory.set(key);
  }

  /** @description Toggles the unread-only view */
  public toggleUnread(): void {
    this.unreadOnly.update(val => !val);
  }

  /** @description Marks a single notification as read and updates local state optimistically */
  public markAsRead(note: any): void {
    if (!note.isRead) {
      this.notificationService.markAsRead(note.id).subscribe({
        next: () => {
          this.notifications.update(list =>
            list.map(n => n.id === note.id ? { ...n, isRead: true } : n)
          );
        }
      });
    }
  }

  /** @description Marks all visible notifications as read */
  public markAllAsRead(): void {
    this.notificationService.markAllAsRead(this.userId.toString()).subscribe({
      next: () => {
        this.notificationService.resetUnreadCount();
        this.notifications.update(list => list.map(n => ({ ...n, isRead: true })));
      }
    });
  }

  /** @description Removes a notification from the list and the database */
  public deleteNotification(id: string): void {
    this.notificationService.deleteNotification(id).subscribe({
      next: () => {
        this.notifications.update(list => list.filter(n => n.id !== id));
      }
    });
  }

  /** @description Logic for infinite scrolling pagination */
  public loadMore(): void {
    if (this.hasMore) {
      this.currentPage++;
      this.fetchData();
    }
  }

  /** @description Utility to determine if a date is within the specified range */
  private isWithinDays(date: string, days: number): boolean {
    if (!date) return false;
    const diff = Date.now() - new Date(date).getTime();
    return diff / (1000 * 60 * 60 * 24) <= days;
  }

  /** @description Returns specific icons/emojis based on the notification category */
  public getIconForType(type: string): string {
    switch (type) {
      case ENotificationCategory.FOLLOW_REQUESTS: return '👤';
      case ENotificationCategory.LIKES_FAVORITES: return '❤️';
      case ENotificationCategory.COMMENTS: return '💬';
      case ENotificationCategory.ADMIN: return '🚨';
      default: return '🔔';
    }
  }


  
  public toggleReadStatus(note: any, event: Event): void {
    event.stopPropagation(); 

    const newStatus = !note.isRead;

    this.notificationService.markAsRead(note.id).subscribe({
      next: () => {
        this.notifications.update(list =>
          list.map(n => n.id === note.id ? { ...n, isRead: newStatus } : n)
        );
      },
      error: (err) => console.error('Failed to update status', err)
    });
  }
}

