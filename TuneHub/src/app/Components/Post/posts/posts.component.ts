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

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [RouterModule, MatIconModule, CommonModule,CommentComponent,FormsModule],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.css'
})
// 💡 חובה ליישם OnChanges כדי לקלוט נתונים חדשים מהאב
export class PostsComponent implements OnInit, OnChanges { 
  showComments: { [key: number]: boolean } = {};
  
  // 1. המשתנה היחיד לרינדור ב-HTML - מאותחל כריק.
  displayedPosts: Post[] = []; 

  
  // ✅ 2. רשימה המכילה את כל הפוסטים שנטענו (המקור לסינון)
  originalPosts: Post[] = []; 

  // ✅ 3. המשתנה שיחזיק את הבחירה מה-dropdown (ערך ברירת מחדל: 'All')
  selectedTimeRange: 'All' | 'Today' | 'Week' | 'Month' = 'All';
  // 2. הקלט (Input) שמגיע רק מפרופיל המשתמש. מאותחל כריק.
  @Input() postsFromProfile: Post[] = []; 
@Input() showOnlyMedia: 'audio' | 'video' | 'all' = 'all';
  @Input() isProfileView: boolean = false; // ✅ המשתנה החדש והחיוני לתיקון
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
    if (changes['postsFromProfile'] && this.postsFromProfile) {
      // 1. עדכן את רשימת המקור (originalPosts) שתשקף את הנתונים מהאב
      this.originalPosts = this.postsFromProfile; 

      // 2. ודא שרשימת התצוגה מתחילה בנתונים החדשים
      this.displayedPosts = [...this.postsFromProfile]; 
      
      // 3. ✅ החזר את הסינון לברירת המחדל שלו אם הוא לא 'All'
      // זה חשוב כדי שהסינון לא יישאר על 'Today' מרכיב אחר
      this.selectedTimeRange = 'All'; 

      // 4. הפעל את הסינון (שכעת יחזיר את כל ה-originalPosts כיוון שהטווח הוא 'All')
      this.applyTimeFilter(); 
    }
  }
  
  // ----------------------------------------------------------------
  // Lifecycle Hook: טעינה ראשונית של הקומפוננטה
  // ----------------------------------------------------------------
  ngOnInit(): void {
    this.loadCurrentUserRoles();
    
    // בדיקה: נטען את כל הפוסטים רק אם ה-Input ריק (מצב דף כללי).
    // שימו לב: אנחנו משתמשים ב-length כי postsFromProfile מאותחל כ-[]
 if (!this.isProfileView && this.postsFromProfile.length === 0) {
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
        this.originalPosts = posts; // ✅ קבע את המקור
        this.displayedPosts = posts; // ואתחֵל את המוצג
        
        // ✅ הפעל סינון מידי אם יש בחירת זמן
        this.applyTimeFilter(); 
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




// ----------------------------------------------------------------
// 5️⃣ פונקציית סינון לפי טווח זמן
// ----------------------------------------------------------------
applyTimeFilter(): void {
    const today = new Date();
    let filterDate: Date;
    
    // אם נבחרה אפשרות "All", מציגים את כל רשימת המקור
    if (this.selectedTimeRange === 'All') {
        this.displayedPosts = this.originalPosts;
        return;
    }

    // 1. קביעת תאריך הגבול התחתון (לפניו הפוסטים יסוננו החוצה)
    if (this.selectedTimeRange === 'Today') {
        // מגדיר את תאריך הגבול לתחילת היום הנוכחי (00:00:00)
        filterDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    } else if (this.selectedTimeRange === 'Week') {
        // מחזיר את היום שבוע אחורה
        filterDate = new Date(today);
        filterDate.setDate(today.getDate() - 7);
    } else if (this.selectedTimeRange === 'Month') {
        // מחזיר את היום חודש אחורה
        filterDate = new Date(today);
        filterDate.setMonth(today.getMonth() - 1);
    } else {
        // אם משהו השתבש, מציג את כל הפוסטים
        this.displayedPosts = this.originalPosts;
        return; 
    }

    // 2. ביצוע הסינון בפועל
    this.displayedPosts = this.originalPosts.filter(post => {
        // א. ודא שתאריך העלאה קיים.
        if (!post.dateUploaded) return false;

        // ב. המר את תאריך הפוסט לאובייקט Date.
        // מכיוון שהמודל מגדיר אותו כ-Date, הוא אמור להיות Date אם ה-HttpClient פרסס אותו.
        // אם הוא מחרוזת (כפי שצוין ב-DTO), ה-new Date יעבוד.
        const postDate = new Date(post.dateUploaded); 

        // ג. ההשוואה: האם תאריך הפוסט מאוחר או שווה לתאריך הגבול?
        // (כלומר, האם הפוסט הועלה בטווח הזמן שנבחר)
        return postDate.getTime() >= filterDate.getTime();
    });
}
toggleFilters(): void {
    this.showFilters = !this.showFilters;
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
}
