

import { Component, Input, OnInit, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatIconModule } from "@angular/material/icon";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PostService } from '../../../Services/post.service';
import Post from '../../../Models/Post';
import { FileUtilsService } from '../../../Services/fileutils.service';
import { UserStateService } from '../../../Services/user-state.service';
import { InteractionService } from '../../../Services/interaction.service';
import { AdminService } from '../../../Services/admin.service';
import { ERole } from '../../../Models/Users';
import { PostCardComponent } from "../post-card/post-card.component";
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [RouterModule, MatIconModule, CommonModule, FormsModule, PostCardComponent],
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit, OnChanges {
  @Input() postsFromProfile: Post[] = [];
  @Input() showOnlyMedia: 'audio' | 'video' | 'all' = 'all';
  @Input() isProfileView: boolean = false;

  displayedPosts: Post[] = [];
  originalPosts: Post[] = [];
  showComments: { [key: number]: boolean } = {};
  hasMorePosts = false;
  selectedTimeRange: 'All' | 'Today' | 'Week' | 'Month' = 'All';
  searchText = '';
  private searchSubject = new Subject<string>();

  currentUserRoles: string[] = [];
  isAdmin = false;
  showAdminActions: { [key: number]: boolean } = {};
  
  constructor(
    private router: Router,
    private postService: PostService,
    private sanitizer: DomSanitizer,
    public fileUtils: FileUtilsService,
    private userState: UserStateService,
    private interactionService: InteractionService,
    private adminService: AdminService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['postsFromProfile'] && this.postsFromProfile) {
      this.originalPosts = this.postsFromProfile;
      this.displayedPosts = [...this.postsFromProfile];
      this.selectedTimeRange = 'All';
      this.applyAllFilters();
    }
  }

  ngOnInit(): void {
    this.loadCurrentUserRoles();

    if (!this.isProfileView && this.postsFromProfile.length === 0) {
      this.loadPostsFromService();
    }

    this.searchSubject.pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => this.applyAllFilters());
  }

  loadCurrentUserRoles(): void {
    const user = this.userState.getCurrentUserValue();
    if (!user || !Array.isArray(user.roles)) {
      this.currentUserRoles = [];
      this.isAdmin = false;
      return;
    }
    this.currentUserRoles = user.roles;
    this.isAdmin = user.roles.includes(ERole.ROLE_ADMIN) || user.roles.includes(ERole.ROLE_SUPER_ADMIN);
  }

  loadPostsFromService(): void {
    this.postService.getPosts().subscribe({
      next: (posts) => {
        this.originalPosts = posts ?? [];
        this.displayedPosts = posts ?? [];
        this.applyAllFilters();
      },
      error: (err) => console.error("Error loading posts:", err)
    });
  }

  loadMore(): void {
    if (this.hasMorePosts) {
      this.loadPostsFromService();
    }
  }

  onSearchChange(text: string): void {
    this.searchText = text.trim();
    this.searchSubject.next(this.searchText);
  }

  applyAllFilters(): void {
    let filtered = [...this.originalPosts];

    // Filter by time
    const today = new Date();
    let filterDate: Date | null = null;
    switch (this.selectedTimeRange) {
      case 'Today': filterDate = new Date(today.getFullYear(), today.getMonth(), today.getDate()); break;
      case 'Week': filterDate = new Date(today); filterDate.setDate(today.getDate() - 7); break;
      case 'Month': filterDate = new Date(today); filterDate.setMonth(today.getMonth() - 1); break;
      case 'All': filterDate = null; break;
    }
    if (filterDate) {
      filtered = filtered.filter(post => post.dateUploaded && new Date(post.dateUploaded).getTime() >= filterDate.getTime());
    }

    // Filter by search
    if (this.searchText.trim()) {
      const term = this.searchText.toLowerCase();
      filtered = filtered.filter(post =>
        post.title?.toLowerCase().includes(term) ||
        post.content?.toLowerCase().includes(term) ||
        post.user?.name?.toLowerCase().includes(term)
      );
    }

    this.displayedPosts = filtered;
  }

  toggleComments(postId: number) {
    this.showComments[postId] = !this.showComments[postId];
  }

  navigateToAddComment(postId: number): void {
    this.router.navigate(['/add-comment', postId]);
  }

  navigateToUpload() {
    this.router.navigate(['/upload-post']);
  }

  getSafeMediaUrl(path: string): SafeResourceUrl {
    const url = `http://localhost:8080/api/post/${path}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  toggleLike(post: Post): void {
    if (!post.isLiked) {
      this.interactionService.addLike('POST', post.id!).subscribe({
        next: (res) => { post.likes = res.count; post.isLiked = true; this.cdr.detectChanges(); },
        error: (err) => console.error('Failed to add like', err)
      });
    } else {
      this.interactionService.removeLike('POST', post.id!).subscribe({
        next: (res) => { post.likes = res.count; post.isLiked = false; this.cdr.detectChanges(); },
        error: (err) => console.error('Failed to remove like', err)
      });
    }
  }

  toggleFavorite(post: Post): void {
    if (!post.isFavorite) {
      this.interactionService.addFavorite('POST', post.id!).subscribe({
        next: (res) => { post.hearts = res.count; post.isFavorite = true; this.cdr.detectChanges(); }
      });
    } else {
      this.interactionService.removeFavorite('POST', post.id!).subscribe({
        next: (res) => { post.hearts = res.count; post.isFavorite = false; this.cdr.detectChanges(); }
      });
    }
  }

  toggleAdminActions(postId: number) {
    Object.keys(this.showAdminActions).forEach(key => {
      const id = Number(key);
      if (id !== postId) this.showAdminActions[id] = false;
    });
    this.showAdminActions[postId] = !this.showAdminActions[postId];
  }

  onSendWarningNotification(postId: number, ownerId: number): void {
    if (!this.isAdmin) return;
    if (confirm(`Send a content warning notification to the post owner (ID: ${ownerId})?`)) {
      this.adminService.sendWarningNotification(postId).subscribe({
        next: () => { alert(`Warning sent for Post ID: ${postId}`); this.showAdminActions[postId] = false; },
        error: (err) => console.error("Failed to send warning notification:", err)
      });
    }
  }

  onDeletePostWithNotification(postId: number, ownerId: number): void {
    if (!this.isAdmin) return;
    if (confirm(`Are you sure you want to DELETE Post ID: ${postId} and notify its owner (ID: ${ownerId})?`)) {
      this.adminService.deletePostWithNotification(postId).subscribe({
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
    if (confirm(`dalete post? ${postId}?`)) {
      this.displayedPosts = this.displayedPosts.filter(p => p.id !== postId);
    }
  }

  onReportPost(postId: number): void {
    alert("Report a post " + postId);
  }
}
