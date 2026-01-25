import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CommentService } from '../../../Services/comment.service';
import { CommentModalService } from '../../../Services/CommentModalService';


@Component({
  selector: 'app-add-comment',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './add-comment.component.html',
  styleUrls: ['./add-comment.component.css']
})


export class AddCommentComponent implements OnInit {
  commentContent: string = '';
  isUploading: boolean = false;
  uploadError: string | null = null;

  currentPostId: number | null = null;

  constructor(
    private commentService: CommentService,
    private commentModal: CommentModalService,
    private router: Router
  ) { }

  ngOnInit() {
    this.commentModal.postId$.subscribe(id => this.currentPostId = id);
  }

  submitCommentWrapper() {
    if (this.currentPostId !== null) {
      this.submitComment(this.currentPostId);
    }
  }

  submitComment(postId: number) {
    const content = this.commentContent.trim();

    if (!content) {
      this.uploadError = 'Comment cannot be empty';
      return;
    }

    this.isUploading = true;
    this.uploadError = null;

    const dto = { content, postId };

    this.commentService.uploadComment(dto).subscribe({
      next: () => {
        this.isUploading = false;
        // this.commentModal.notifyCommentAdded(newComment);
        this.commentContent = '';
        this.commentModal.close();

      },
      error: (err) => {
        this.isUploading = false;
        this.uploadError = 'Error sending comment';
        console.error('Upload comment error:', err);
      }
    });
  }

  close() {
    this.commentModal.close();
    this.router.navigate(['/posts']);
  }

  get isOpen$() {
    return this.commentModal.isOpen$;
  }

  get postId$() {
    return this.commentModal.postId$;
  }



}
