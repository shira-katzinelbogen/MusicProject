import { ChangeDetectorRef, Component, Input, OnChanges, OnInit } from '@angular/core';
import { CommentComponent } from '../../Comments/comment/comment.component';
import Post from '../../../Models/Post';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ERole } from '../../../Models/Users';
import { PostService } from '../../../Services/post.service';
import { FileUtilsService } from '../../../Services/fileutils.service';
import { UserStateService } from '../../../Services/user-state.service';
import { CommentService } from '../../../Services/comment.service';
import { InteractionService } from '../../../Services/interaction.service';
import { AdminService } from '../../../Services/admin.service';
import { MatIcon, MatIconModule } from "@angular/material/icon";
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HighlightPipe } from "../../Shared/highlight/highlight.component";

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [RouterModule, MatIconModule, CommonModule, CommentComponent, FormsModule, HighlightPipe],
  templateUrl: './post-card.component.html',
  styleUrl: './post-card.component.css'
})

export class PostCardComponent  {
  showComments: { [key: number]: boolean } = {};


  @Input() post!: Post;
  @Input() isProfileView: boolean = false;
  @Input() showOnlyMedia: 'all' | 'audio' | 'video' = 'all';
  @Input() searchText: string = '';
  @Input() isAdmin: boolean = false;

  showAdminActions: { [postId: number]: boolean } = {};

  newCommentTexts: { [key: number]: string } = {};
  currentUserRoles: string[] = [];



  displayedPosts: Post[] = [];
  constructor(
    private router: Router,
    private _postService: PostService,
    private sanitizer: DomSanitizer,
    public fileUtils: FileUtilsService,
    private userState: UserStateService,
    private commentService: CommentService,
    private _interactionService: InteractionService,
    private cdr: ChangeDetectorRef,
    private _adminService: AdminService
  ) { }




  toggleComments(postId: number) {
    this.showComments[postId] = !this.showComments[postId];
  }

  navigateToAddComment(postId: number): void {
    this.router.navigate(['/add-comment', postId]);
  }

  // ... (אין צורך בפונקציות התגובה המוערות) ...



get mediaTypeToShow(): 'audio' | 'video' | null {
  if (this.showOnlyMedia === 'audio' && this.post.audioPath) return 'audio';
  if (this.showOnlyMedia === 'video' && this.post.videoPath) return 'video';
  if (this.showOnlyMedia === 'all') {
    if (this.post.audioPath) return 'audio';
    if (this.post.videoPath) return 'video';
  }
  return null;
}


  toggleLike(post: Post): void {

    if (!post.isLiked) {
      this._interactionService.addLike('POST', post.id!).subscribe({
        next: (res) => {
          post.likes = res.count;
          post.isLiked = true;
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Failed to add like', err)
      });
    } else {
      this._interactionService.removeLike('POST', post.id!).subscribe({
        next: (res) => {
          post.likes = res.count;
          post.isLiked = false;
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Failed to remove like', err)
      });
    } console.log('like clicked!', post);
  }


  toggleFavorite(post: Post): void {
    if (!post.isFavorite) {
      this._interactionService.addFavorite('POST', post.id!).subscribe({
        next: (res) => {
          post.hearts = res.count; // עכשיו res.count מגיע מהשרת
          post.isFavorite = true;
          this.cdr.detectChanges();
        }
      });
    } else {
      this._interactionService.removeFavorite('POST', post.id!).subscribe({
        next: (res) => {
          post.hearts = res.count;
          post.isFavorite = false;
          this.cdr.detectChanges();
        }
      });
    }
  }



  toggleAdminActions(postId: number) {
    // ... לוגיקה קיימת של סגירת אחרים ופתיחת הנוכחי ...
    Object.keys(this.showAdminActions).forEach(key => {
      const id = Number(key);
      if (id !== postId) this.showAdminActions[id] = false;
    });

    this.showAdminActions[postId] = !this.showAdminActions[postId];
  }

  onSendWarningNotification(postId: number, ownerId: number): void {
    if (!this.isAdmin) return;

    if (confirm(`Send a content warning notification to the post owner (ID: ${ownerId})?`)) {
      this._adminService.sendWarningNotification(postId).subscribe({ // <--- קריאה ל-AdminService
        next: () => {
          alert(`Warning sent for Post ID: ${postId}`);
          this.showAdminActions[postId] = false;
        },
        error: (err) => console.error("Failed to send warning notification:", err)
      });
    }
  }

  /**
   * פעולה חדשה: מחיקת פוסט + שליחת התראת מחיקה למשתמש
   */
  onDeletePostWithNotification(postId: number, ownerId: number): void {
    if (!this.isAdmin) return;

    if (confirm(`Are you sure you want to DELETE Post ID: ${postId} and notify its owner (ID: ${ownerId})?`)) {
      this._adminService.deletePostWithNotification(postId).subscribe({ // <--- קריאה ל-AdminService
        next: () => {
          // מחיקה מקומית של הפוסט
          this.displayedPosts = this.displayedPosts.filter(p => p.id !== postId);
          alert(`Post ID: ${postId} deleted and owner notified.`);
          this.showAdminActions[postId] = false;
          this.cdr.detectChanges();
        },
        error: (err) => console.error("Failed to delete post with notification:", err)
      });
    }
  }
  // ניתן להסיר את onDeletePost הקודמת או להשאיר אותה אם יש שימוש נוסף
  // נשאיר אותה למקרה הצורך (למרות שה-HTML עודכן להפעיל את החדשה)
  onDeletePost(postId: number): void {
    console.warn("Using old onDeletePost - should use onDeletePostWithNotification instead.");
    if (!this.isAdmin) return;

    if (confirm(`האם למחוק את הפוסט ${postId}?`)) {
      this.displayedPosts = this.displayedPosts.filter(p => p.id !== postId);
    }
  }

  onReportPost(postId: number): void {
    alert("דיווח נשלח על פוסט " + postId);
  }

  // ----------------------------------------------------------------
  // 1️⃣ טעינת משתמש שמחובר
  // ----------------------------------------------------------------
  loadCurrentUserRoles(): void {
    const user = this.userState.getCurrentUserValue();

    if (!user || !Array.isArray(user.roles)) {
      this.currentUserRoles = [];
      this.isAdmin = false;
      return;
    }

    this.currentUserRoles = user.roles;

    this.isAdmin =
      user.roles.includes(ERole.ROLE_ADMIN) ||
      user.roles.includes(ERole.ROLE_SUPER_ADMIN);
  }

  getStarArray(rating: number | undefined): string[] {
    const MAX_STARS = 5;
    // אם הדירוג הוא undefined או null, נשתמש ב-0
    const effectiveRating = rating ?? 0;
    const stars: string[] = [];

    for (let i = 1; i <= MAX_STARS; i++) {

      // 1. כוכב מלא
      if (i <= effectiveRating) {
        stars.push('star');

        // 2. חצי כוכב: אם הדירוג גדול מהכוכב הקודם (i-1)
      } else if (effectiveRating > (i - 1)) {
        stars.push('star_half');

        // 3. כוכב ריק
      } else {
        stars.push('star_border');
      }
    }

    return stars;
  }




  // ----------------------------------------------------------------
  // 4️⃣ הצגת מדיה
  // ----------------------------------------------------------------
  getSafeMediaUrl(path: string): SafeResourceUrl {
    const url = `http://localhost:8080/api/post/${path}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }




}
