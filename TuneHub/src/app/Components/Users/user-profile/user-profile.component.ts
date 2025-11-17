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
  sheets: SheetMusic | undefined;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _usersService: UsersService,
    private _postService: PostService,
      private _sheetMusicService: SheetMusicService,
    public fileUtilsService: FileUtilsService
  ) { }

  ngOnInit(): void {
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
        this.posts = res;
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

  editProfile(): void {
    console.log('Editing profile...');
    // לוגיקה לעריכת פרופיל
  }

  sendMessage(): void {
    console.log(`Sending message to ${this.profileData?.name}`);
    // לוגיקה לשליחת הודעה
  }

  followUser(): void {
    this.isFollowing = !this.isFollowing;
    console.log(`Follow status changed to: ${this.isFollowing}`);
    // לוגיקה לשליחת בקשת Follow לשרת
  }


}
