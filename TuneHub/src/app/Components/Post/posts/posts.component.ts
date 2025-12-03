import { Component, Input, OnInit, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
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
import { InteractionService } from '../../../Services/interaction.service';
import { AdminService } from '../../../Services/admin.service';
import { PostCardComponent } from "../post-card/post-card.component";
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [RouterModule, MatIconModule, CommonModule, FormsModule, PostCardComponent],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.css'
})
// 💡 חובה ליישם OnChanges כדי לקלוט נתונים חדשים מהאב
export class PostsComponent implements OnInit, OnChanges {



  // ✅ 2. רשימה המכילה את כל הפוסטים שנטענו (המקור לסינון)
  originalPosts: Post[] = [];
 searchText: string = '';
  // ✅ 3. המשתנה שיחזיק את הבחירה מה-dropdown (ערך ברירת מחדל: 'All')
  selectedTimeRange: 'All' | 'Today' | 'Week' | 'Month' = 'All';
  // 2. הקלט (Input) שמגיע רק מפרופיל המשתמש. מאותחל כריק.
  @Input() postsFromProfile: Post[] = [];
  @Input() showOnlyMedia: 'audio' | 'video' | 'all' = 'all';
  // ✅ המשתנה החדש והחיוני לתיקון
  showFilters: boolean = false; // אפשר להתחיל עם false אם רוצים שיהיה מקופל בהתחלה
  // 1. המשתנה היחיד לרינדור ב-HTML - מאותחל כריק.
  displayedPosts: Post[] = [];

  // 2. הקלט (Input) שמגיע רק מפרופיל המשתמש. מאותחל כריק.
  //@Input() postsFromProfile: Post[] = [];

  //   showFilters: boolean = false; // אפשר להתחיל עם false אם רוצים שיהיה מקופל בהתחלה


  newCommentTexts: { [key: number]: string } = {};
  currentUserRoles: string[] = [];
  isAdmin = false;
  showAdminActions: { [key: number]: boolean } = {};
private searchSubject = new Subject<string>();


  @Input() isProfileView: boolean = false;

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
  // ----------------------------------------------------------------
  // Lifecycle Hook: מטפל בשינויים של Input (כשלחצת על לשונית הפוסטים)
  // ----------------------------------------------------------------
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['postsFromProfile'] && this.postsFromProfile) {
      // 1. עדכן את רשימת המקור (originalPosts) שתשקף את הנתונים מהאב
      this.originalPosts = this.postsFromProfile;

      // 2. ודא שרשימת התצוגה מתחילה בנתונים החדשים
      this.displayedPosts = [...this.postsFromProfile];

      // 3. ✅ החזר את הסינון לברירת המחדל שלו אם הוא לא 'All'
      // זה חשוב כדי שהסינון לא יישאר על 'Today' מרכיב אחר
      this.selectedTimeRange = 'All';

      // 4. הפעל את הסינון (שכעת יחזיר את כל ה-originalPosts כיוון שהטווח הוא 'All')
      this.applyAllFilters();
    }
  }





  // ----------------------------------------------------------------
  // Lifecycle Hook: טעינה ראשונית של הקומפוננטה
  // ----------------------------------------------------------------
 

  ngOnInit(): void {
  this.loadCurrentUserRoles();

  if (!this.isProfileView && this.postsFromProfile.length === 0) {
    this.loadPostsFromService();
  }
this.searchSubject.pipe(
  debounceTime(300),
  distinctUntilChanged()
).subscribe(() => {
  this.applyAllFilters();
});

}
 searchPosts(): void {
  if (!this.searchText) {
    this.displayedPosts = [...this.originalPosts];
    return;
  }

  const term = this.searchText.toLowerCase();

  this.displayedPosts = this.originalPosts.filter(post =>
    post.title?.toLowerCase().includes(term) ||
    post.content?.toLowerCase().includes(term) ||
    post.user!.name?.toLowerCase().includes(term)
  );
}



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

  //   ngOnChanges(changes: SimpleChanges): void {
  //     if (changes['postsFromProfile']) {
  //       // אם הועבר Input חדש (גם אם הוא מערך ריק), נשתמש בו לרינדור.
  //       // זה מכסה את מצב פרופיל המשתמש.
  //       this.displayedPosts = this.postsFromProfile ?? [];
  //     }
  //   }


  // ----------------------------------------------------------------
  // 2️⃣ טוען פוסטים מהשרת (משמש רק לדף הכללי)
  // ----------------------------------------------------------------
  loadPostsFromService(): void {
    this._postService.getPosts().subscribe({
      next: (posts) => {
        this.originalPosts = posts; // ✅ קבע את המקור
        this.displayedPosts = posts; // ואתחֵל את המוצג

        // ✅ הפעל סינון מידי אם יש בחירת זמן
        this.applyAllFilters();
      },
      error: (err) => console.error("שגיאה בטעינת פוסטים:", err)
    });
  }








  // ----------------------------------------------------------------
  // 5️⃣ פונקציית סינון לפי טווח זמן
  // ----------------------------------------------------------------


  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }


  navigateToUpload() {
    this.router.navigate(['/upload-post']);
  }

    onSearchChange(text: string): void {
  this.searchText = text.trim();
  this.searchSubject.next(this.searchText);
}


applyAllFilters(): void {
  let filtered = [...this.originalPosts];

  // ---- סינון זמן ----
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

    case 'All':
      filterDate = null;
      break;
  }

  if (filterDate) {
    filtered = filtered.filter(post => {
      if (!post.dateUploaded) return false;
      return new Date(post.dateUploaded).getTime() >= filterDate.getTime();
    });
  }

  // ---- סינון חיפוש ----
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
}
