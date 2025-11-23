import { Component, HostListener, Input, OnInit, OnChanges } from '@angular/core';
import { CommentService } from '../../../Services/comment.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-comment',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css'
})
export class CommentComponent implements OnInit, OnChanges {

  @Input() postId!: number;

  comments: any[] = [];

  page: number = 0;
  size: number = 10;
  totalPages: number = 0;
  loading: boolean = false;

  constructor(private commentService: CommentService) {}

  ngOnInit(): void {
    if (this.postId) {
      this.resetAndLoad();
    }
  }

  ngOnChanges(): void {
    if (this.postId) {
      this.resetAndLoad();  // ← תיקון: לא לטעון על קודמים, תמיד מאפסין
    }
  }

  // 🔄 מאפס הכול בפתיחה מחדש
  resetAndLoad(): void {
    this.comments = [];
    this.page = 0;
    this.totalPages = 0;
    this.loadComments();
  }

  loadComments(): void {
    if (this.loading) return;
    this.loading = true;

    this.commentService.getCommentsPaged(this.postId, this.page, this.size)
      .subscribe({
        next: response => {
          this.comments = [...this.comments, ...response.comments];

          this.totalPages = response.totalPages;

          this.page++;
          this.loading = false;
        },
        error: err => {
          console.error('Error loading comments:', err);
          this.loading = false;
        }
      });
  }

  // 📌 גלילה בתוך הקומפוננטה — לא גלילה של כל הדף!
onScroll(event: Event): void {
  const container = event.target as HTMLElement | null;

  if (!(container instanceof HTMLElement)) {
    return;  // ← מונע את השגיאה של null
  }

  const threshold = 100;

  const reachedBottom =
    container.scrollTop + container.clientHeight >= container.scrollHeight - threshold;

  if (reachedBottom && !this.loading && this.page < this.totalPages) {
    this.loadComments();
  }
}


  // ✅ הפונקציה שמחליפה את fileUtils
 getProfileImage(imagePath: string | null): string {
  // נסי את זה קודם - נתיב בסיסי ברוב הפרויקטים
  return imagePath ? `http://localhost:8080/${imagePath}` : './assets/images/musicians.png';
}
}
