import { Component, Input, OnInit, OnChanges, ChangeDetectorRef } from '@angular/core';
import { CommentService } from '../../../Services/comment.service';
import { CommonModule } from '@angular/common';
import { InteractionService } from '../../../Services/interaction.service';
import Comment from '../../../Models/Comment';
import { MatIconModule } from '@angular/material/icon';
import { FileUtilsService } from '../../../Services/fileutils.service';
import { TimeAgoPipe } from "../../../Pipes/time-ago.pipe";
import { NoResultsComponent } from "../../Shared/no-results/no-results.component";
import { NavigationService } from '../../../Services/navigation.service';

@Component({
  selector: 'app-comment',
  imports: [MatIconModule, CommonModule, TimeAgoPipe, NoResultsComponent],
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

  constructor(
    private commentService: CommentService,
    public fileUtilsService: FileUtilsService,
    public navigationService: NavigationService,
    private cdr: ChangeDetectorRef,
    private _interactionService: InteractionService
  ) { }

  ngOnInit(): void {
    if (this.postId) {
      this.resetAndLoad();
    }
  }

  ngOnChanges(): void {
    if (this.postId) {
      this.resetAndLoad();
    }
  }

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
          const newComments = response.comments.map((c: Comment) => ({
            ...c,
            likes: c.likes ?? 0,
            isLiked: c.isLiked ?? false,
            dateUploaded: c.dateUploaded ? new Date(c.dateUploaded) : null
          }));

         this.comments.push(...newComments);


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


  onScroll(event: Event): void {
    const container = event.target as HTMLElement | null;

    if (!(container instanceof HTMLElement)) {
      return;
    }
    const threshold = 100;

    const reachedBottom =
      container.scrollTop + container.clientHeight >= container.scrollHeight - threshold;

    if (reachedBottom && !this.loading && this.page < this.totalPages) {
      this.loadComments();
    }
  }

toggleLike(comment: Comment): void {
  if (!comment.isLiked) {
    this._interactionService.addLike('COMMENT', comment.id!).subscribe({
      next: (res: any) => {
        comment.likes = Number(res);
        comment.isLiked = true;
        this.cdr.detectChanges(); 
      }
    });
  } else {
    this._interactionService.removeLike('COMMENT', comment.id!).subscribe({
      next: (res: any) => {
        comment.likes = Number(res);
        comment.isLiked = false;
        this.cdr.detectChanges();
      }
    });
  }
}


  trackByCommentId(index: number, comment: Comment) {
  return comment.id; // מזהה ייחודי לכל תגובה
}

}
