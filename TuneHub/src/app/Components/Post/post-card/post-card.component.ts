import { ChangeDetectorRef, Component, Input, OnChanges, OnInit } from '@angular/core';
import { CommentComponent } from '../../Comments/comment/comment.component';
import Post from '../../../Models/Post';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FileUtilsService } from '../../../Services/fileutils.service';
import { UserStateService } from '../../../Services/user-state.service';
import { InteractionService } from '../../../Services/interaction.service';
import { AdminService } from '../../../Services/admin.service';
import { MatIconModule } from "@angular/material/icon";
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HighlightPipe } from "../../../Pipes/highlight.pipe";
import { CommentModalService } from '../../../Services/CommentModalService';
import { TimeAgoPipe } from "../../../Pipes/time-ago.pipe";
import { NavigationService } from '../../../Services/navigation.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [RouterModule, MatIconModule, CommonModule, CommentComponent, FormsModule, HighlightPipe, TimeAgoPipe],
  templateUrl: './post-card.component.html',
  styleUrl: './post-card.component.css'
})

export class PostCardComponent implements OnChanges, OnInit {
  showComments: { [key: number]: boolean } = {};
  postIdForModal!: number;
  isAdmin$!: Observable<boolean>;

  @Input() post!: Post;
  @Input() isProfileView: boolean = false;
  @Input() showOnlyMedia: 'all' | 'audio' | 'video' = 'all';
  @Input() searchText: string = '';
  isAdmin: boolean = false;

  showAdminActions: { [postId: number]: boolean } = {};

  newCommentTexts: { [key: number]: string } = {};
  currentUserRoles: string[] = [];

  displayedPosts: Post[] = [];
  constructor(
    private router: Router,
    private sanitizer: DomSanitizer,
    public fileUtils: FileUtilsService,
    private userState: UserStateService,
    private _interactionService: InteractionService,
    private cdr: ChangeDetectorRef,
    private _adminService: AdminService,
    public commentModal: CommentModalService,
    public navigationService: NavigationService
  ) {
    this.isAdmin$ = this.userState.isAdmin$;
  }

  ngOnInit(): void {
    this.post.dateUploaded = new Date(this.post.dateUploaded!);
    this.userState.currentUser$.subscribe(user => {
      this.cdr.detectChanges();
    });

    this.isAdmin$.subscribe(admin => {
      this.isAdmin = admin;
      this.cdr.detectChanges();
    });

    if (this.post) {
      this.post.likes = this.post.likes ?? 0;
      this.post.hearts = this.post.hearts ?? 0;
    }
  }

  ngOnChanges(): void {
    if (this.post) {
      this.displayedPosts = [this.post];
      this.post.likes = this.post.likes ?? 0;
      this.post.hearts = this.post.hearts ?? 0;
    }

  }


  toggleComments(postId: number) {
    this.showComments[postId] = !this.showComments[postId];

    if (this.showComments[postId]) {
      this.postIdForModal = postId;
    }
  }


  openAddCommentWindow(postId: number) {
    this.commentModal.open(postId);
    this.postIdForModal = postId;
  }

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

    if (!post.liked) {
      this._interactionService.addLike('POST', post.id!).subscribe({
        next: (res) => {
          post.likes = (post.likes ?? 0) + 1;
          post.liked = true;
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Failed to add like', err)
      });
    } else {
      this._interactionService.removeLike('POST', post.id!).subscribe({
        next: (res) => {
          post.likes = (post.likes ?? 1) - 1;
          post.liked = false;
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Failed to remove like', err)
      });
    } console.log('like clicked!', post);
  }

  toggleFavorite(post: Post): void {
    if (!post.favorite) {
      this._interactionService.addFavorite('POST', post.id!).subscribe({
        next: (res) => {
          post.hearts = res.count;
          post.favorite = true;
          this.cdr.detectChanges();
        }
      });
    } else {
      this._interactionService.removeFavorite('POST', post.id!).subscribe({
        next: (res) => {
          post.hearts = res.count;
          post.favorite = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  toggleAdminActions(postId: number) {
    console.log('Toggle admin actions for post:', postId, 'isAdmin:', this.isAdmin);
    Object.keys(this.showAdminActions).forEach(key => {
      const id = Number(key);
      if (id !== postId) this.showAdminActions[id] = false;
    });

    this.showAdminActions[postId] = !this.showAdminActions[postId];
  }

  onSendWarningNotification(postId: number, ownerId: number): void {
    if (!this.isAdmin) return;

    if (confirm(`Send a content warning notification to the post owner (ID: ${ownerId})?`)) {
      this._adminService.sendWarningNotification(postId).subscribe({
        next: () => {
          alert(`Warning sent for Post ID: ${postId}`);
          this.showAdminActions[postId] = false;
        },
        error: (err) => console.error("Failed to send warning notification:", err)
      });
    }
  }


  onDeletePostWithNotification(postId: number, ownerId: number): void {
    if (!this.isAdmin) return;

    if (confirm(`Are you sure you want to DELETE Post ID: ${postId} and notify its owner (ID: ${ownerId})?`)) {
      this._adminService.deletePostWithNotification(postId).subscribe({
        next: () => {
          this.displayedPosts = this.displayedPosts.filter(p => p.id !== postId);
          alert(`Post ID: ${postId} deleted and owner notified.`);
          this.showAdminActions[postId] = false;
          this.cdr.detectChanges();
        },
        error: (err) => console.error("Failed to delete post with notification:", err)
      });
    }
  }

  onDeletePost(postId: number): void {
    if (!this.isAdmin) return;

    if (confirm(`Are you sure you want to delete post ${postId}?`)) {
      this._adminService.deletePostWithNotification(postId).subscribe({
        next: () => {
          this.displayedPosts = this.displayedPosts.filter(p => p.id !== postId);
          alert(`Post ID: ${postId} deleted.`);
          this.cdr.detectChanges();
          this.router.navigate(['/posts']);
        },
        error: (err) => console.error("Failed to delete post:", err)
      });
    }
  }

  onReportPost(postId: number): void {
    alert("Report sent on post " + postId);
  }


  // loadCurrentUserRoles(): void {
  //   this.isAdmin =this.userState.isAdmin();
  // }

  getStarArray(rating: number | undefined): string[] {
    const MAX_STARS = 5;
    const effectiveRating = rating ?? 0;
    const stars: string[] = [];

    for (let i = 1; i <= MAX_STARS; i++) {

      if (i <= effectiveRating) {
        stars.push('star');

      } else if (effectiveRating > (i - 1)) {
        stars.push('star_half');

      } else {
        stars.push('star_border');
      }
    }

    return stars;
  }


  getSafeMediaUrl(path: string): SafeResourceUrl {
    const url = `http://localhost:8080/api/post/${path}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }


}
