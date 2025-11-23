import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatIconModule } from "@angular/material/icon";
import { CommonModule } from '@angular/common';
import { CommentComponent } from '../../Comments/comment/comment.component'

import { PostService } from '../../../Services/post.service';
import Post, { PostResponseDTO } from '../../../Models/Post';
import { FileUtilsService } from '../../../Services/fileutils.service';
import { UserStateService } from '../../../Services/user-state.service';
import { CommentService } from '../../../Services/comment.service';
import { ERole } from '../../../Models/Users';
import { FormsModule } from '@angular/forms';
import { AddCommentComponent } from '../../Comments/add-comment/add-comment.component';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [RouterModule, MatIconModule, CommonModule,CommentComponent,FormsModule,AddCommentComponent],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.css'
})
// 💡 חובה ליישם OnChanges כדי לקלוט נתונים חדשים מהאב
export class PostsComponent implements OnInit, OnChanges { 
  showComments: { [key: number]: boolean } = {};
  
  // 1. המשתנה היחיד לרינדור ב-HTML - מאותחל כריק.
  displayedPosts: Post[] = []; 

  // 2. הקלט (Input) שמגיע רק מפרופיל המשתמש. מאותחל כריק.
  @Input() postsFromProfile: Post[] = []; 
  
    showFilters: boolean = false; // אפשר להתחיל עם false אם רוצים שיהיה מקופל בהתחלה

  
  newCommentTexts: { [key: number]: string } = {}; 
  currentUserRoles: string[] = [];
  isAdmin = false;

  showAdminActions: { [key: number]: boolean } = {};


  constructor(
    private router: Router,
    private _postService: PostService,
    private sanitizer: DomSanitizer,
    public fileUtils: FileUtilsService,
    private userState: UserStateService,
    private commentService: CommentService    
  ) { }

  // ----------------------------------------------------------------
  // Lifecycle Hook: מטפל בשינויים של Input (כשלחצת על לשונית הפוסטים)
  // ----------------------------------------------------------------
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['postsFromProfile']) {
      // אם הועבר Input חדש (גם אם הוא מערך ריק), נשתמש בו לרינדור.
      // זה מכסה את מצב פרופיל המשתמש.
      this.displayedPosts = this.postsFromProfile ?? []; 
    }
  }
  
  // ----------------------------------------------------------------
  // Lifecycle Hook: טעינה ראשונית של הקומפוננטה
  // ----------------------------------------------------------------
  ngOnInit(): void {
    this.loadCurrentUserRoles();
    
    // בדיקה: נטען את כל הפוסטים רק אם ה-Input ריק (מצב דף כללי).
    // שימו לב: אנחנו משתמשים ב-length כי postsFromProfile מאותחל כ-[]
    if (this.postsFromProfile.length === 0) {
        this.loadPostsFromService(); 
    }
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


  // ----------------------------------------------------------------
  // 2️⃣ טוען פוסטים מהשרת (משמש רק לדף הכללי)
  // ----------------------------------------------------------------
  loadPostsFromService(): void {
    this._postService.getPosts().subscribe({
      next: (posts) => {
        this.displayedPosts = posts; // 💡 מאכלס את המשתנה שמציג ב-HTML
      },
      error: (err) => console.error("שגיאה בטעינת פוסטים:", err)
    });
  }

  // ----------------------------------------------------------------
  // 3️⃣ פעולות אדמין
  // ----------------------------------------------------------------

  toggleAdminActions(postId: number) {
    Object.keys(this.showAdminActions).forEach(key => {
      const id = Number(key);
      if (id !== postId) this.showAdminActions[id] = false;
    });

    this.showAdminActions[postId] = !this.showAdminActions[postId];
  }

  onDeletePost(postId: number): void {
    if (!this.isAdmin) return;

    // 💡 שינוי: למחוק מ-displayedPosts
    if (confirm(`האם למחוק את הפוסט ${postId}?`)) {
      this.displayedPosts = this.displayedPosts.filter(p => p.id !== postId);
    }

  }

  onReportPost(postId: number): void {
    alert("דיווח נשלח על פוסט " + postId);
  }

  // ----------------------------------------------------------------
  // 4️⃣ הצגת מדיה
  // ----------------------------------------------------------------
  getSafeMediaUrl(path: string): SafeResourceUrl {
    const url = `http://localhost:8080/api/post/${path}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
  
  navigateToUpload() {
    this.router.navigate(['/upload-post']);
  }

  toggleComments(postId: number) {
    this.showComments[postId] = !this.showComments[postId];
  }

  navigateToAddComment(postId: number): void {
    this.router.navigate(['/add-comment', postId]);
  }

  // ... (אין צורך בפונקציות התגובה המוערות) ...

toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }
}
