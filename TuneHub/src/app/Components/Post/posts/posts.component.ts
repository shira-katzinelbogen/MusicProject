import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatIconModule } from "@angular/material/icon";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { PostService } from '../../../Services/post.service';
import Post from '../../../Models/Post';
import { FileUtilsService } from '../../../Services/fileutils.service';
import { UserStateService } from '../../../Services/user-state.service';
import { InteractionService } from '../../../Services/interaction.service';
import { AdminService } from '../../../Services/admin.service';
import { PostCardComponent } from "../post-card/post-card.component";
import { NoResultsComponent } from "../../Shared/no-results/no-results.component";
import { StatsCounterComponent } from "../../Shared/stats-counter/stats-counter.component";
import Role, { ERole } from '../../../Models/Role';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [
    RouterModule, MatIconModule, CommonModule, FormsModule, PostCardComponent, NoResultsComponent, StatsCounterComponent
  ],
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit, OnChanges {

  @Input() postsFromProfile: Post[] = [];
  @Input() showOnlyMedia: 'audio' | 'video' | 'all' = 'all';
  @Input() isProfileView = false;

  displayedPosts: Post[] = [];
  originalPosts: Post[] = [];

  hasMorePosts = false;
  selectedTimeRange: 'All' | 'Today' | 'Week' | 'Month' = 'All';
  searchText = '';

  private searchSubject = new Subject<string>();
  private showOnlyNavigationItems = false;
  private navigationItemId: number | null = null;

  currentUserRoles: Role[] = [];

  isAdmin = false;

  showAdminActions: { [key: number]: boolean } = {};
  showComments: Record<number, boolean> = {};

  constructor(
    private router: Router,
    private postService: PostService,
    private sanitizer: DomSanitizer,
    public fileUtils: FileUtilsService,
    private userState: UserStateService,
    private interactionService: InteractionService,
    private adminService: AdminService
  ) { }

  /* ---------------- lifecycle ---------------- */

  ngOnInit(): void {
    this.loadCurrentUserRoles();

    if (!this.isProfileView) {
      this.loadPostsFromService();
    }

    const navState = history.state;
    if (navState?.items?.length) {
      this.navigationItemId = navState.items[0].id;
      this.showOnlyNavigationItems = true;
    }

    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => this.applyAllFilters());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['postsFromProfile'] && this.isProfileView) {
      this.originalPosts = this.postsFromProfile ?? [];
      this.displayedPosts = [...this.originalPosts];
      this.applyAllFilters();
    }
  }

  /* ---------------- roles ---------------- */

  loadCurrentUserRoles(): void {
    const user = this.userState.getCurrentUserValue();
    if (!user || !Array.isArray(user.roles)) {
      this.currentUserRoles = [];
      this.isAdmin = false;
      return;
    }

    this.currentUserRoles = user.roles;

    this.isAdmin = this.currentUserRoles.some(r =>
      r.name === ERole.ROLE_ADMIN || r.name === ERole.ROLE_SUPER_ADMIN
    );
  }

  /* ---------------- data ---------------- */

  loadPostsFromService(): void {
    this.postService.getPosts().subscribe({
      next: posts => {
        this.originalPosts = posts ?? [];

        if (this.showOnlyNavigationItems && this.navigationItemId) {
          const matched = this.originalPosts.find(p => p.id === this.navigationItemId);
          this.displayedPosts = matched ? [matched] : [];
        } else {
          this.displayedPosts = [...this.originalPosts];
        }

        this.applyAllFilters();
      },
      error: err => console.error('Error loading posts:', err)
    });
  }

  loadMore(): void {
    if (this.hasMorePosts) {
      this.loadPostsFromService();
    }
  }

  /* ---------------- filters ---------------- */

  onSearchChange(text: string): void {
    this.searchText = text.trim();
    this.searchSubject.next(this.searchText);
  }

  applyAllFilters(): void {
    let filtered = [...this.originalPosts];

    const today = new Date();
    let filterDate: Date | null = null;

    switch (this.selectedTimeRange) {
      case 'Today':
        filterDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        break;
      case 'Week':
        filterDate = new Date(today);
        filterDate.setDate(today.getDate() - 7);
        break;
      case 'Month':
        filterDate = new Date(today);
        filterDate.setMonth(today.getMonth() - 1);
        break;
    }

    if (filterDate) {
      filtered = filtered.filter(p =>
        p.dateUploaded && new Date(p.dateUploaded).getTime() >= filterDate!.getTime()
      );
    }

    if (this.searchText) {
      const term = this.searchText.toLowerCase();
      filtered = filtered.filter(p =>
        p.title?.toLowerCase().includes(term) ||
        p.content?.toLowerCase().includes(term) ||
        p.user?.name?.toLowerCase().includes(term)
      );
    }

    this.displayedPosts = filtered;
  }

  /* ---------------- UI actions ---------------- */

  toggleComments(postId: number): void {
    this.showComments[postId] = !this.showComments[postId];
  }

  navigateToAddComment(postId: number): void {
    this.router.navigate(['/add-comment', postId]);
  }

  navigateToUpload(): void {
    this.router.navigate(['/upload-post']);
  }

  /* ---------------- media ---------------- */

  getSafeMediaUrl(path: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `http://localhost:8080/api/post/${path}`
    );
  }

  /* ---------------- interactions ---------------- */

  toggleLike(post: Post): void {
    if (!post.liked) {
      this.interactionService.addLike('POST', post.id!).subscribe(res => {
        post.likes = res.count;
        post.liked = true;
      });
    } else {
      this.interactionService.removeLike('POST', post.id!).subscribe(res => {
        post.likes = res.count;
        post.liked = false;
      });
    }
  }

  toggleFavorite(post: Post): void {
    if (!post.favorite) {
      this.interactionService.addFavorite('POST', post.id!).subscribe(res => {
        post.hearts = res.count;
        post.favorite = true;
      });
    } else {
      this.interactionService.removeFavorite('POST', post.id!).subscribe(res => {
        post.hearts = res.count;
        post.favorite = false;
      });
    }
  }

  /* ---------------- admin ---------------- */

  toggleAdminActions(postId: number): void {
    Object.keys(this.showAdminActions).forEach(key => {
      if (+key !== postId) this.showAdminActions[+key] = false;
    });
    this.showAdminActions[postId] = !this.showAdminActions[postId];
  }

  onSendWarningNotification(postId: number, ownerId: number): void {
    if (!this.isAdmin) return;

    if (confirm(`Send a content warning notification to the post owner (ID: ${ownerId})?`)) {
      this.adminService.sendWarningNotification(postId).subscribe(() => {
        alert(`Warning sent for Post ID: ${postId}`);
        this.showAdminActions[postId] = false;
      });
    }
  }

  onDeletePostWithNotification(postId: number, ownerId: number): void {
    if (!this.isAdmin) return;

    if (confirm(`Are you sure you want to DELETE Post ID: ${postId}?`)) {
      this.adminService.deletePostWithNotification(postId).subscribe(() => {
        this.displayedPosts = this.displayedPosts.filter(p => p.id !== postId);
        this.showAdminActions[postId] = false;
        alert(`Post deleted and owner notified.`);
      });
    }
  }

  onDeletePost(postId: number): void {
    if (!this.isAdmin) return;

    if (confirm(`delete post? ${postId}?`)) {
      this.displayedPosts = this.displayedPosts.filter(p => p.id !== postId);
    }
  }

  onReportPost(postId: number): void {
    alert('Report a post ' + postId);
  }

  /* ---------------- stats ---------------- */

  getTodaysPostsCount(): number {
    const startOfToday = new Date().setHours(0, 0, 0, 0);

    return this.originalPosts.filter(p =>
      p.dateUploaded && new Date(p.dateUploaded).getTime() >= startOfToday
    ).length;
  }
}
