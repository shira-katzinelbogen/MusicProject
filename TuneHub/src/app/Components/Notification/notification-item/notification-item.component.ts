import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ENotificationCategory } from '../../../Models/Notification';
import { TimeAgoPipe } from "../../../Pipes/time-ago.pipe";
import { MatIcon } from "@angular/material/icon";
import { Router } from '@angular/router';

@Component({
  selector: 'app-notification-item',
  imports: [TimeAgoPipe, MatIcon],
  templateUrl: './notification-item.component.html',
  styleUrl: './notification-item.component.css'
})
export class NotificationItemComponent {
  @Input({ required: true }) note: any;

  @Output() markAsRead = new EventEmitter<void>();
  @Output() toggleStatus = new EventEmitter<Event>();
  @Output() delete = new EventEmitter<void>();
  @Output() approve = new EventEmitter<void>();

  constructor(private router: Router) { }

  navigateToPost(postId: string) {
    if (!postId) return;

    this.router.navigate(['/posts'], {
      queryParams: { highlight: postId }
    });
  }

  public getIconForType(type: string): string {
    switch (type) {
      case ENotificationCategory.FOLLOW_REQUESTS: return '👤';
      case ENotificationCategory.LIKES_FAVORITES: return '❤️';
      case ENotificationCategory.COMMENTS: return '💬';
      case ENotificationCategory.ADMIN: return '🚨';
      default: return '🔔';
    }
  }

  public onClickMarkAsRead(): void {
    if (!this.note.isRead) {
      this.markAsRead.emit();
    }
  }

}
