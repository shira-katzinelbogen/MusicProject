import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ENotificationCategory } from '../../../Models/Notification';
import { TimeAgoPipe } from "../../../Pipes/time-ago.pipe";
import { MatIcon } from "@angular/material/icon";
import { Router } from '@angular/router';
import { NavigationService } from '../../../Services/navigation.service';
import { EFollowStatus } from '../../../Models/Follow';
import { InteractionService } from '../../../Services/interaction.service';

@Component({
  selector: 'app-notification-item',
  imports: [TimeAgoPipe, MatIcon],
  templateUrl: './notification-item.component.html',
  styleUrl: './notification-item.component.css'
})
export class NotificationItemComponent implements OnInit {

  protected readonly EFollowStatus = EFollowStatus;
  followStatus: EFollowStatus = EFollowStatus.NONE;

  ngOnInit() {
    if (this.note.type === 'FOLLOW_REQUEST_RECEIVED') {
      this.loadFollowStatus();
    }
  }

  @Input({ required: true }) note: any;

  @Output() toggleStatus = new EventEmitter<Event>();
  @Output() delete = new EventEmitter<void>();

  constructor(
    private router: Router,
    private navigationService: NavigationService,
    private interactionService: InteractionService
  ) { }

  navigateToPost(postId: string) {
    if (!postId) return;

    this.router.navigate(['/posts'], {
      queryParams: { highlight: postId }
    });
  }

  handleNotificationClick() {
    const type = this.note.type;

    if (this.note.postId) {
      this.navigateToPost(this.note.postId);
    }
    else if (type === 'FOLLOW_REQUEST_RECEIVED' || type === 'FOLLOW_UPDATES') {
      this.navigationService.goToProfile(this.note.senderId);
    }
  }


  public getIconForType(note: any): string {
    const type = note.type || '';
    const content = note.content || '';

    if (content.includes('bookmarked') || type.includes('LIKE')) {
      return type.includes('LIKE') ? '👍' : '❤️';
    }

    if (type.includes('REQUEST')) {
      return '👤';
    }

    switch (type) {
      case ENotificationCategory.FOLLOW_UPDATES: return 'person_add';
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
    event.stopPropagation();
    // Use the existing toggleStatus EventEmitter
    this.toggleStatus.emit(event);
  }

  loadFollowStatus() {
    const senderId = Number(this.note.senderId);
    this.interactionService.getFollowingStatus(senderId).subscribe({
      next: (status) => {
        this.followStatus = status;
      }
    });
  }

  approveAction(event: Event) {
    event.stopPropagation();
    this.interactionService.approveFollow(Number(this.note.senderId)).subscribe({
      next: () => {
        this.followStatus = EFollowStatus.APPROVED;
      }
    });
  }

  rejectAction(event: Event) {
    event.stopPropagation();
    this.interactionService.rejectFollow(Number(this.note.senderId)).subscribe({
      next: () => {
        this.followStatus = EFollowStatus.DENIED;
      }
    });
  }
}