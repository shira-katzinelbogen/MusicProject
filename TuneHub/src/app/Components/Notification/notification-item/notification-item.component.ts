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

public getIconForType(note: any): string {
  const type = note.type || '';
  const content = note.content || '';

  if (content.includes('bookmarked') || type.includes('LIKE')) {
    return type.includes('LIKE') ? '👍' : '❤️';
  }

  switch (type) {
    case ENotificationCategory.FOLLOW_REQUESTS: return '👤';
    case ENotificationCategory.FOLLOW_UPDATES: return 'person_add'; // אפשר גם אימוג'י
    case ENotificationCategory.COMMENTS: return '💬';
    case ENotificationCategory.ADMIN: return '🚨';
    default: return '🔔';
  }
}
  /**
   * Emits the toggle event to the parent component.
   * @param {Event} event - The click event object.
  */
  public onToggleClick(event: Event): void {
    // Use the existing toggleStatus EventEmitter
    this.toggleStatus.emit(event);
  }

}
