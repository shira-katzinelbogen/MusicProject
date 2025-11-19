import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatIconModule } from "@angular/material/icon";
import { CommonModule } from '@angular/common';
import { CommentComponent } from '../../../comment/comment.component';

import { PostService } from '../../../Services/post.service';
import Post from '../../../Models/Post';
import { FileUtilsService } from '../../../Services/fileutils.service';
import { UserStateService } from '../../../Services/user-state.service';
import { CommentService } from '../../../Services/comment.service';
import { ERole } from '../../../Models/Users';
import { FormsModule } from '@angular/forms';
import { AddCommentComponent } from '../../../add-comment/add-comment.component';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [RouterModule, MatIconModule, CommonModule,CommentComponent,FormsModule],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.css'
})
export class PostsComponent implements OnInit {
  showComments: { [key: number]: boolean } = {};
  posts: Post[] = [];

  // רולים של המשתמש שמחובר
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

  ngOnInit(): void {
    this.loadCurrentUserRoles();
    this.loadPostsFromService();

  }

  // ----------------------------------------------------------------
  // 1️⃣ טעינת משתמש שמחובר
  // ----------------------------------------------------------------
  loadCurrentUserRoles(): void {
    const user = this.userState.getCurrentUserValue();

    // אם אין משתמש או אין רולים – נעצור
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
  // 2️⃣ טוען פוסטים מהשרת
  // ----------------------------------------------------------------
  loadPostsFromService(): void {
    this._postService.getPosts().subscribe({
      next: (posts) => {
        this.posts = posts;

        
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

    if (confirm(`האם למחוק את הפוסט ${postId}?`)) {
      this.posts = this.posts.filter(p => p.id !== postId);
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

// ----------------------------------------------------------------
  navigateToAddComment(postId: number): void {
    // ננווט לעמוד /add-comment/ID_פוסט
    this.router.navigate(['/add-comment', postId]);
  }



  
// uploadComment(postId: number): void {
//   const content = this.newCommentTexts[postId]?.trim();
//   if (!content) return;

//   const currentUser = this.userState.getCurrentUserValue();
//   if (!currentUser?.id) return;

//   const dto = { content, postId };

//   this.commentService.uploadComment(dto, currentUser.id)
//     .subscribe({
//       next: () => {
//         this.newCommentTexts[postId] = '';
//       },
//       error: (err) => console.error('שגיאה בהוספת תגובה:', err)
//     });
// }


}
