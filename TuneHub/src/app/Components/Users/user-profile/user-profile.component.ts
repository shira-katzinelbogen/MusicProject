import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Users, { Profile } from '../../../Models/Users';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { UsersService } from '../../../Services/users.service';
import { FileUtilsService } from '../../../Services/fileutils.service';
import Post from '../../../Models/Post';
import SheetMusic from '../../../Models/SheetMusic';
import { PostService } from '../../../Services/post.service';
import { SheetMusicService } from '../../../Services/sheetmusic.service';
import { UserStateService } from '../../../Services/user-state.service';

// // ממשק לדוגמה לנתוני הפרופיל 
// interface Profile {
//   id: number;
//   name: string;
//   handle: string;
//   city: string;
//   country: string;
//   website?: string;
//   coverImagePath: string ;
//   imageProfilePath: string;
//   // ... נתונים נוספים
// }

@Component({
  selector: 'app-user-profile',
  imports: [
    CommonModule,  // <- חייב להיות כאן בשביל *ngIf ו-*ngFor
    MatIconModule, // אם את משתמשת ב-mat-icon
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent {



  activeTab: string = 'posts';

  profileId: number | null = null;
  profileData: Users | null = null;
  isCurrentUserProfile: boolean = false; // שולט בהצגת כפתור Edit
  isFollowing: boolean = false; // שולט בטקסט של כפתור Follow
  posts: Post[] | undefined;
  sheets: SheetMusic[] | undefined;
  currentUserId: number | null = null;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _usersService: UsersService,
    private _postService: PostService,
      private _sheetMusicService: SheetMusicService,
    public fileUtilsService: FileUtilsService,
    private userStateService: UserStateService 
  ) { }

  ngOnInit(): void {
  const currentUser = this.userStateService.getCurrentUserValue();
  this.currentUserId = currentUser?.id || Number(localStorage.getItem('userId')) || null;

    this.route.paramMap.subscribe(params => {
      this.profileId = Number(params.get('id'));
      if (this.profileId) {
        this.loadProfileData(this.profileId);
      }
    });
  }

  loadProfileData(id: number): void {
    this._usersService.getUserById(id).subscribe({
      next: (data) => {
        this.profileData = data;
        this.isCurrentUserProfile = (id === Number(localStorage.getItem('userId')));
      },
      error: (err) => {
        console.error('Error loading profile:', err);
      }
    });
  }

  loadPosts(userId: number): void {
    this._postService.getPostsByUserId(userId).subscribe({
      next: (res) => {
        this.posts = res;
      },
      error: (err) => {
        console.error('Error loading profile:', err);
      }
    });
  }


  loadSheets(userId: number): void {
    this._sheetMusicService.getSheetMusicsByUserId(userId).subscribe({
      next: (res) => {
        this.sheets  = res;
      },
      error: (err) => {
        console.error('Error loading profile:', err);
      }
    });
  }
  
  // פונקציות פעולה
  goBack(): void {
    this.router.navigate(['/musician-finder']);
  }


  sendMessage(): void {
    console.log(`Sending message to ${this.profileData?.name}`);
    // לוגיקה לשליחת הודעה
  }

  // פותח חלון עריכת פרופיל
openEditProfileModal(): void {
  // כאן תוכלי לקרוא ל־SignUp modal שלך עם prefill של הנתונים
  this.showEditProfileModal = true;
}

// משתנים לחלונית
showEditProfileModal: boolean = false;

// פונקציה ל־Sign Out (שנמצא אצלך כבר ב־ProfileMiniAvatarComponent)
handleSignOut(): void {
  // אם את משתמשת ב־UserService/UsersService
  this._usersService.signOut().subscribe({
    next: () => {
      localStorage.removeItem('userId'); // נקה את ה־localStorage
      this.router.navigate(['/home']);
    },
    error: () => {
      localStorage.removeItem('userId');
      this.router.navigate(['/home']);
    }
  });
}



  signOut(): void {
//     // נניח ש-usersService.signOut הוא ה-LoginService.signOut ששלחת
     this._usersService.signOut().subscribe({
      next: () => {
//         this.userStateService.clearUser(); // ניקוי המשתמש מהסטייט
//         this.router.navigate(['/home']); // ניווט לדף הבית
      },
      error: (err) => {
       console.error('Sign out error:', err);
//         // בדרך כלל מנקים בכל מקרה
       this.userStateService.clearUser(); 
       this.router.navigate(['/home']); 
       }
   });
  }

 editProfile(): void {
    if (this.isCurrentUserProfile) {
      console.log('Opening profile edit modal...');
      
//       // אם קיים שירות מודל: this.modalService.openEditProfileModal(this.profileData);
//       
//       // ⚠️ ניתוב זמני: מנווט לעמוד עריכה עם מזהה הפרופיל
//       this.router.navigate(['/edit-profile', this.profileId]); 
   }
  }

followUser(): void {
    if (this.isCurrentUserProfile || !this.currentUserId) return;
    this.isFollowing = !this.isFollowing;
    console.log(`Follow status changed to: ${this.isFollowing}`);
    // לוגיקה לשליחת בקשת Follow לשרת
  }



}
