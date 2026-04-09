import { Component, OnInit, OnDestroy, signal, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { MatIconModule } from "@angular/material/icon";
import { Subscription } from 'rxjs';
import { NotificationService } from '../../../Services/notification.service';
import { ENotificationCategory } from '../../../Models/Notification';
import { NoResultsComponent } from "../../Shared/no-results/no-results.component";
import { UserStateService } from "../../../Services/user-state.service"
import { NotificationItemComponent } from "../notification-item/notification-item.component";
import { StatsCounterComponent } from "../../Shared/stats-counter/stats-counter.component";
import { InteractionService } from '../../../Services/interaction.service';

/**
 * @description Advanced Notifications Component utilizing Angular Signals for optimal performance.
 * Features include real-time synchronization, multi-category filtering, and infinite scroll pagination.
 */
@Component({
  selector: 'app-notifications',
  standalone: true,
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css'],
  imports: [CommonModule, MatIconModule, NoResultsComponent, NotificationItemComponent, StatsCounterComponent]
})

/**
* @component NotificationsComponent
* @description Renders a reactive list of notifications with real-time updates.
*/
export class NotificationsComponent implements OnInit, OnDestroy {

  private notificationService = inject(NotificationService);
  private userStateService = inject(UserStateService);
  private interactionService = inject(InteractionService);



  /** @property Explicitly defined as string to match MongoDB/Socket expectations */
  public userId!: string;
  private userSub: Subscription | undefined;

  public notifications = toSignal(this.notificationService.notifications$, { initialValue: [] });

  public activeCategory = signal<ENotificationCategory | 'ALL'>('ALL');
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

  ngOnInit(): void {
    /**
     * Reactive subscription to User State.
     * Ensures notifications are re-fetched if the user identity changes.
     */
    this.userSub = this.userStateService.currentUser$.subscribe(user => {
      if (user && user.id) {
        this.userId = String(user.id);
        this.notificationService.connectSocket(this.userId);
        this.notificationService.getUnreadCount(this.userId);
        this.fetchData();
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
    const activeCat = this.activeCategory();
    if (activeCat === 'ALL') return list;

    return list.filter(n => this.getCategoryFromNotification(n) === activeCat);
  });

  private getCategoryFromNotification(note: any): string {
    const type = note.type || '';
    const content = note.content || '';

    if (type.includes('LIKE') || content.includes('bookmarked')) {
      return 'LIKES_FAVORITES';
    }

    if (type.includes('COMMENT')) {
      return ENotificationCategory.COMMENTS;
    }

    if (type.includes('REQUEST')) {
      return ENotificationCategory.FOLLOW_REQUESTS;
    }
    return 'ADMIN';
  }

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
  }

  /** @description Updates the active category filter */
  public setCategory(key: any): void {
    this.activeCategory.set(key);
  }

  /** @description Toggles the unread-only view */
  public toggleUnread(): void {
    this.unreadOnly.update(val => !val);
  }


  /** @description Marks all visible notifications as read */
  public markAllAsRead(): void {
    this.notificationService.markAllAsRead(this.userId.toString()).subscribe({
      next: () => {
        const currentList = this.notificationService['notificationsSubject'].value;
        const updatedList = currentList.map(n => ({ ...n, isRead: true }));

        this.notificationService['notificationsSubject'].next(updatedList);
        this.notificationService.resetUnreadCount();
      }
    });
  }

  /** @description Removes a notification from the list and the database */
  public deleteNotification(id: string): void {
    const currentList = this.notificationService['notificationsSubject'].value;
    const noteToDelete = currentList.find(n => n._id === id || n.id === id);

    this.notificationService.deleteNotification(id).subscribe({
      next: () => {
        this.notificationService['notificationsSubject'].next(
          currentList.filter(n => n._id !== id && n.id !== id)
        );

        if (noteToDelete && !noteToDelete.isRead) {
          const currentCount = this.notificationService['unreadCountSubject'].value;
          if (currentCount > 0) {
            this.notificationService['unreadCountSubject'].next(currentCount - 1);
          }
        }
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
  public getIconForType(note: any): string {
    if (note.type === 'LIKE_POST') {
      return note.content?.toLowerCase().includes('favorite') ? '❤️' : '👍';
    }

    switch (note.type) {
      case ENotificationCategory.FOLLOW_REQUESTS: return '👤';
      case ENotificationCategory.COMMENTS: return '💬';
      case ENotificationCategory.ADMIN: return '🚨';
      default: return '🔔';
    }
  }

  /**
 * Orchestrates the toggle logic by calling the service and updating the local signal state.
 * @param {any} note - The notification object to be toggled.
 * @param {Event} [event] - Optional DOM event to prevent event bubbling.
 */
  public handleToggleRead(note: any, event?: Event): void {
    if (event) event.stopPropagation();

    const id = note._id;

    this.notificationService.toggleReadStatus(id).subscribe({
      next: (updatedNoteFromDB) => {
        const currentList = this.notificationService['notificationsSubject'].value;
        const newList = currentList.map(n =>
          (n._id === id) ? { ...n, isRead: updatedNoteFromDB.isRead } : n
        );
        this.notificationService['notificationsSubject'].next(newList);

        const currentCount = this.notificationService['unreadCountSubject'].value;

        if (updatedNoteFromDB.isRead) {
          if (currentCount > 0) {
            this.notificationService['unreadCountSubject'].next(currentCount - 1);
          }
        } else {
          this.notificationService['unreadCountSubject'].next(currentCount + 1);
        }

        console.log(`Notification ${id} toggled to: ${updatedNoteFromDB.isRead}`);
      },
      error: (err) => console.error('Failed to toggle status:', err)
    });
  }


  /**
   * Handles the approval of a follow request by coordinating between 
   * the Java Interaction Service and the Node.js Notification Service.
   * @param note The notification object containing senderId and notificationId.
   */
  public handleApprove(note: any): void {
    const senderId = Number(note.senderId); // Sender from Java (number)

    // Tell Java to approve the follow
    this.interactionService.approveFollow(senderId).subscribe({
      next: () => {
        this.updateNotificationInStore(note._id, { localStatus: 'approved' });
      },
      error: (err) => console.error('Failed to approve follow in Java:', err)
    });
  }

  /**
   * Handles the rejection of a follow request.
   * @param note The notification object.
   */
  public handleReject(note: any): void {
    const senderId = Number(note.senderId);

    // Tell Java to reject the request
    this.interactionService.rejectFollow(senderId).subscribe({
      next: () => {
        this.updateNotificationInStore(note._id, { localStatus: 'rejected' });
      },
      error: (err) => console.error('Failed to reject follow in Java:', err)
    });
  }

  private updateNotificationInStore(id: string, updates: Partial<any>) {
    const currentList = this.notificationService['notificationsSubject'].value;
    const newList = currentList.map(n =>
      (n._id === id) ? { ...n, ...updates } : n
    );
    this.notificationService['notificationsSubject'].next(newList);
  }
}

