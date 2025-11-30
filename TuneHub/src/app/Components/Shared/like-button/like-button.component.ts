// src/app/components/like-button/like-button.component.ts (מתוקן)
import { Component, Input, OnInit } from '@angular/core';
import { InteractionService, NotificationSimpleDTO } from '../../../Services/interaction.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-like-button',
  templateUrl: './like-button.component.html',
  styleUrls: ['./like-button.component.css']
})
export class LikeButtonComponent implements OnInit {
  
  @Input() targetType!: string; 
  @Input() targetId!: number;   
  @Input() initialLikeCount!: number; 
  @Input() isLikedByUser!: boolean; 

  currentLikeCount!: number;

  constructor(private interactionService: InteractionService) { }

  ngOnInit() {
    this.currentLikeCount = this.initialLikeCount;
  }

  /**
   * פונקציית העיקרית שמחליטה איזו פעולה לבצע.
   */
  onToggleLike() {
    let apiCall: Observable<NotificationSimpleDTO>;

    if (this.isLikedByUser) {
      // 1. המשתמש לחץ על לייק קיים: נדרש REMOVE (DELETE)
      apiCall = this.interactionService.removeLike(this.targetType, this.targetId);
    } else {
      // 2. המשתמש לחץ על כפתור הלייק: נדרש ADD (POST)
      apiCall = this.interactionService.addLike(this.targetType, this.targetId);
    }
    
    // מנוי לקריאה שנבחרה
    apiCall.subscribe({
      next: (response: NotificationSimpleDTO) => {
        // עדכון UI
        this.currentLikeCount = response.count;
        this.isLikedByUser = !this.isLikedByUser; 
        console.log(`Like status updated. New count: ${response.count}`);
      },
      error: (err) => {
        console.error('Failed to update like status:', err);
        // ...
      }
    });
  }
}