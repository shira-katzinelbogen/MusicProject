import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CommentService } from '../../../Services/comment.service';
import { UserStateService } from '../../../Services/user-state.service';



@Component({
  selector: 'app-add-comment',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, RouterModule],
  templateUrl: './add-comment.component.html',
  styleUrl: './add-comment.component.css'
})
export class AddCommentComponent implements OnInit {
  postId!: number;
  commentContent: string = '';
  isUploading: boolean = false;
  uploadSuccess: boolean = false;
  uploadError: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private commentService: CommentService,
    private userState: UserStateService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('postId');
      if (id) {
        this.postId = +id; 
      } else {
        this.router.navigate(['/posts']);
      }
    });
  }

  submitComment(): void {
    const content = this.commentContent.trim();
    if (!content || !this.postId) {
      this.uploadError = "no content";
      return;
    }

    const currentUser = this.userState.getCurrentUserValue();
    if (!currentUser?.id) {
      this.uploadError = "user not connect";
      return;
    }

    this.isUploading = true;
    this.uploadSuccess = false;
    this.uploadError = null;

    const dto = { content, postId: this.postId };

    this.commentService.uploadComment(dto)
      .subscribe({
        next: () => {
          this.isUploading = false;
          this.uploadSuccess = true;
          this.commentContent = ''; 
          
          setTimeout(() => {
            this.router.navigate(['/posts']); 
          }, 1000);
        },
        error: (err) => {
          this.isUploading = false;
          this.uploadError = 'error in adding comment';
          console.error('error:', err);
        }
      });
  }
}