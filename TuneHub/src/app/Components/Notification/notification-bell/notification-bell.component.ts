import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NotificationService } from '../../../Services/notification.service';

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './notification-bell.component.html',
  styleUrl: './notification-bell.component.css'
})
export class NotificationBellComponent {
  private router = inject(Router);

  /** @description Observable that emits the count of unread notifications */
  unreadCount$ = inject(NotificationService).unreadCount$;

  /**
   * @description Navigates the user to the main notifications page.
   */
  navigateToNotifications(): void {
    this.router.navigate(['/notifications']);
  }
}