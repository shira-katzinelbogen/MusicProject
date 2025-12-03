// import { Component, Input, OnInit, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
// import { Router, RouterModule } from '@angular/router';
// import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
// import { MatIconModule } from "@angular/material/icon";
// import { CommonModule } from '@angular/common';
// import { CommentComponent } from '../../Comments/comment/comment.component'

// import { PostService } from '../../../Services/post.service';
// import Post, { PostResponseDTO } from '../../../Models/Post';
// import { FileUtilsService } from '../../../Services/fileutils.service';
// import { UserStateService } from '../../../Services/user-state.service';
// import { CommentService } from '../../../Services/comment.service';
// import { ERole } from '../../../Models/Users';
// import { FormsModule } from '@angular/forms';
// import { AddCommentComponent } from '../../Comments/add-comment/add-comment.component';
// import { InteractionService } from '../../../Services/interaction.service';
// import { AdminService } from '../../../Services/admin.service';
// import { PostCardComponent } from "../post-card/post-card.component";
// import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

// @Component({
//   selector: 'app-posts',
//   standalone: true,
//   imports: [RouterModule, MatIconModule, CommonModule, FormsModule, PostCardComponent],
//   templateUrl: './posts.component.html',
//   styleUrl: './posts.component.css'
// })
// export class PostsComponent implements OnInit, OnChanges {
//   showComments: { [key: number]: boolean } = {};

//   originalPosts: Post[] = [];

//   selectedTimeRange: 'All' | 'Today' | 'Week' | 'Month' = 'All';
//   @Input() postsFromProfile: Post[] = [];
//   @Input() showOnlyMedia: 'audio' | 'video' | 'all' = 'all';
//   @Input() isProfileView: boolean = false;
//   showFilters: boolean = false;
//   displayedPosts: Post[] = [];
//   pageSize = 10;
//   currentPage = 0;
//   hasMorePosts = false;

//   newCommentTexts: { [key: number]: string } = {};
//   currentUserRoles: string[] = [];
//   isAdmin = false;
//   showAdminActions: { [key: number]: boolean } = {};
//   private searchSubject = new Subject<string>();

//   constructor(
//     private router: Router,
//     private _postService: PostService,
//     private sanitizer: DomSanitizer,
//     public fileUtils: FileUtilsService,
//     private userState: UserStateService,
//     private commentService: CommentService,
//     private _interactionService: InteractionService,
//     private cdr: ChangeDetectorRef,
//     private _adminService: AdminService
//   ) { }
//   // ----------------------------------------------------------------
//   // Lifecycle Hook: מטפל בשינויים של Input (כשלחצת על לשונית הפוסטים)
//   // ----------------------------------------------------------------
//   ngOnChanges(changes: SimpleChanges): void {
//     if (changes['postsFromProfile'] && this.postsFromProfile) {
//       // 1. עדכן את רשימת המקור (originalPosts) שתשקף את הנתונים מהאב
//       this.originalPosts = this.postsFromProfile;

//       // 2. ודא שרשימת התצוגה מתחילה בנתונים החדשים
//       this.displayedPosts = [...this.postsFromProfile];

//       // 3. ✅ החזר את הסינון לברירת המחדל שלו אם הוא לא 'All'
//       // זה חשוב כדי שהסינון לא יישאר על 'Today' מרכיב אחר
//       this.selectedTimeRange = 'All';

//       // 4. הפעל את הסינון (שכעת יחזיר את כל ה-originalPosts כיוון שהטווח הוא 'All')
//       this.applyAllFilters();
//     }
//   }





//   // ----------------------------------------------------------------
//   // Lifecycle Hook: טעינה ראשונית של הקומפוננטה
//   // ----------------------------------------------------------------


//   ngOnInit(): void {
//     this.loadCurrentUserRoles();

//     if (!this.isProfileView && this.postsFromProfile.length === 0) {
//       this.loadPostsFromService();
//     }
//     this.searchSubject.pipe(
//       debounceTime(300),
//       distinctUntilChanged()
//     ).subscribe(() => {
//       this.applyAllFilters();
//     });

//   }
//   searchPosts(): void {
//     if (!this.searchText) {
//       this.displayedPosts = [...this.originalPosts];
//       return;
//     }

//     const term = this.searchText.toLowerCase();

//     this.displayedPosts = this.originalPosts.filter(post =>
//       post.title?.toLowerCase().includes(term) ||
//       post.content?.toLowerCase().includes(term) ||
//       post.user!.name?.toLowerCase().includes(term)
//     );
//   }

//   ngOnChanges(changes: SimpleChanges): void {
//     if (changes['postsFromProfile'] && this.postsFromProfile) {
//       this.originalPosts = this.postsFromProfile;

//       this.hasMorePosts = false;
//       this.displayedPosts = [...this.postsFromProfile];

//       this.selectedTimeRange = 'All';

//       this.applyTimeFilter();
//     }
//   }

//   ngOnInit(): void {
//     this.loadCurrentUserRoles();

//   if (!this.isProfileView && this.postsFromProfile.length === 0) {
//       this.loadPostsFromService();
//   }
// }

//   loadCurrentUserRoles(): void {
//     const user = this.userState.getCurrentUserValue();

//     if (!user || !Array.isArray(user.roles)) {
//       this.currentUserRoles = [];
//       this.isAdmin = false;
//       return;
//     }

//     this.currentUserRoles = user.roles;

//     this.isAdmin =
//       user.roles.includes(ERole.ROLE_ADMIN) ||
//       user.roles.includes(ERole.ROLE_SUPER_ADMIN);
//   }

// loadPostsFromService(): void {

//     this._postService.getPosts().subscribe({
//         next: (res: Post[]) => {

//             this.displayedPosts = res ?? [];
//             this.originalPosts = res ?? [];

//             this.applyTimeFilter();
//             this.cdr.detectChanges();
//         },
//         error: (err) => console.error("error loading post", err)
//     });
// }

//   loadMore(): void {
//     if (this.hasMorePosts) {
//       this.loadPostsFromService();
//     }
//   }

//   loadCurrentUserRoles(): void {
//     const user = this.userState.getCurrentUserValue();

//     if (!user || !Array.isArray(user.roles)) {
//       this.currentUserRoles = [];
//       this.isAdmin = false;
//       return;
//     }

//     this.currentUserRoles = user.roles;

//     this.isAdmin =
//       user.roles.includes(ERole.ROLE_ADMIN) ||
//       user.roles.includes(ERole.ROLE_SUPER_ADMIN);
//   }

//   //   ngOnChanges(changes: SimpleChanges): void {
//   //     if (changes['postsFromProfile']) {
//   //       // אם הועבר Input חדש (גם אם הוא מערך ריק), נשתמש בו לרינדור.
//   //       // זה מכסה את מצב פרופיל המשתמש.
//   //       this.displayedPosts = this.postsFromProfile ?? [];
//   //     }
//   //   }


//   // ----------------------------------------------------------------
//   // 2️⃣ טוען פוסטים מהשרת (משמש רק לדף הכללי)
//   // ----------------------------------------------------------------
//   loadPostsFromService(): void {
//     this._postService.getPosts().subscribe({
//       next: (posts) => {
//         this.originalPosts = posts; // ✅ קבע את המקור
//         this.displayedPosts = posts; // ואתחֵל את המוצג

//         // ✅ הפעל סינון מידי אם יש בחירת זמן
//         this.applyAllFilters();
//       },
//       error: (err) => console.error("שגיאה בטעינת פוסטים:", err)
// applyTimeFilter(): void {
//     const today = new Date();
//     let filterDate: Date;

//     if (this.selectedTimeRange === 'All') {
//         this.displayedPosts = this.originalPosts;
//         return;
//     }

//     if (this.selectedTimeRange === 'Today') {
//         filterDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
//     } else if (this.selectedTimeRange === 'Week') {
//         filterDate = new Date(today);
//         filterDate.setDate(today.getDate() - 7);
//     } else if (this.selectedTimeRange === 'Month') {
//         filterDate = new Date(today);
//         filterDate.setMonth(today.getMonth() - 1);
//     } else {
//         this.displayedPosts = this.originalPosts;
//         return;
//     }

//     this.displayedPosts = this.originalPosts.filter(post => {
//         if (!post.dateUploaded) return false;

//         const postDate = new Date(post.dateUploaded);

//         return postDate.getTime() >= filterDate.getTime();
//     });
//   }








//   // ----------------------------------------------------------------
//   // 5️⃣ פונקציית סינון לפי טווח זמן
//   // ----------------------------------------------------------------


//   toggleFilters(): void {
//     this.showFilters = !this.showFilters;
//   }

//   getStarArray(rating: number | undefined): string[] {
//     const MAX_STARS = 5;
//     const effectiveRating = rating ?? 0;
//     const stars: string[] = [];

//     for (let i = 1; i <= MAX_STARS; i++) {

//       if (i <= effectiveRating) {
//         stars.push('star');

//       } else if (effectiveRating > (i - 1)) {
//         stars.push('star_half');

//       } else {
//         stars.push('star_border');
//       }
//     }

//     return stars;
//   }


//   getSafeMediaUrl(path: string): SafeResourceUrl {
//     const url = `http://localhost:8080/api/post/${path}`;
//     return this.sanitizer.bypassSecurityTrustResourceUrl(url);
//   }

//   navigateToUpload() {
//     this.router.navigate(['/upload-post']);
//   }

//   onSearchChange(text: string): void {
//     this.searchText = text.trim();
//     this.searchSubject.next(this.searchText);
//   }


//   applyAllFilters(): void {
//     let filtered = [...this.originalPosts];

//     // ---- סינון זמן ----
//     const today = new Date();
//     let filterDate: Date | null = null;

//     switch (this.selectedTimeRange) {
//       case 'Today':
//         filterDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
//         break;

//       case 'Week':
//         filterDate = new Date(today);
//         filterDate.setDate(today.getDate() - 7);
//         break;

//       case 'Month':
//         filterDate = new Date(today);
//         filterDate.setMonth(today.getMonth() - 1);
//         break;

//       case 'All':
//         filterDate = null;
//         break;
//     }

//     if (filterDate) {
//       filtered = filtered.filter(post => {
//         if (!post.dateUploaded) return false;
//         return new Date(post.dateUploaded).getTime() >= filterDate.getTime();
//       });
//     }

//     // ---- סינון חיפוש ----
//     if (this.searchText.trim()) {
//       const term = this.searchText.toLowerCase();
//       filtered = filtered.filter(post =>
//         post.title?.toLowerCase().includes(term) ||
//         post.content?.toLowerCase().includes(term) ||
//         post.user?.name?.toLowerCase().includes(term)
//       );
//     }


//     this.displayedPosts = filtered;
//   }
// }
// toggleComments(postId: number) {
//   this.showComments[postId] = !this.showComments[postId];
// }

// navigateToAddComment(postId: number): void {
//   this.router.navigate(['/add-comment', postId]);
// }

// toggleLike(post: Post): void {

//   if(!post.isLiked) {
//   this._interactionService.addLike('POST', post.id!).subscribe({
//     next: (res) => {
//       post.likes = res.count;
//       post.isLiked = true;
//       this.cdr.detectChanges();
//     },
//     error: (err) => console.error('Failed to add like', err)
//   });
// } else {
//   this._interactionService.removeLike('POST', post.id!).subscribe({
//     next: (res) => {
//       post.likes = res.count;
//       post.isLiked = false;
//       this.cdr.detectChanges();
//     },
//     error: (err) => console.error('Failed to remove like', err)
//   });
// } console.log('like clicked!', post);
//   }

// toggleFavorite(post: Post): void {
//   if(!post.isFavorite) {
//   this._interactionService.addFavorite('POST', post.id!).subscribe({
//     next: (res) => {
//       post.hearts = res.count;
//       post.isFavorite = true;
//       this.cdr.detectChanges();
//     }
//   });
// } else {
//   this._interactionService.removeFavorite('POST', post.id!).subscribe({
//     next: (res) => {
//       post.hearts = res.count;
//       post.isFavorite = false;
//       this.cdr.detectChanges();
//     }
//   });
// }
//   }

// toggleAdminActions(postId: number) {
//   Object.keys(this.showAdminActions).forEach(key => {
//     const id = Number(key);
//     if (id !== postId) this.showAdminActions[id] = false;
//   });

//   this.showAdminActions[postId] = !this.showAdminActions[postId];
// }

// onSendWarningNotification(postId: number, ownerId: number): void {
//   if(!this.isAdmin) return;

//   if(confirm(`Send a content warning notification to the post owner (ID: ${ownerId})?`)) {
//   this._adminService.sendWarningNotification(postId).subscribe({
//     next: () => {
//       alert(`Warning sent for Post ID: ${postId}`);
//       this.showAdminActions[postId] = false;
//     },
//     error: (err) => console.error("Failed to send warning notification:", err)
//   });
// }
//   }

// onDeletePostWithNotification(postId: number, ownerId: number): void {
//   if(!this.isAdmin) return;

//   if(confirm(`Are you sure you want to DELETE Post ID: ${postId} and notify its owner (ID: ${ownerId})?`)) {
//   this._adminService.deletePostWithNotification(postId).subscribe({
//     next: () => {
//       this.displayedPosts = this.displayedPosts.filter(p => p.id !== postId);
//       alert(`Post ID: ${postId} deleted and owner notified.`);
//       this.showAdminActions[postId] = false;
//       this.cdr.detectChanges();
//     },
//     error: (err) => console.error("Failed to delete post with notification:", err)
//   });
// }
//   }
// onDeletePost(postId: number): void {
//   if(!this.isAdmin) return;

//   if(confirm(`האם למחוק את הפוסט ${postId}?`)) {
//   this.displayedPosts = this.displayedPosts.filter(p => p.id !== postId);
// }
//   }

// onReportPost(postId: number): void {
//   alert("דיווח נשלח על פוסט " + postId);
//   }

// }

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
    if (confirm(`האם למחוק את הפוסט ${postId}?`)) {
      this.displayedPosts = this.displayedPosts.filter(p => p.id !== postId);
    }
  }

  onReportPost(postId: number): void {
    alert("דיווח נשלח על פוסט " + postId);
  }
}
