import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PostsComponent } from '../../Post/posts/posts.component';
import { SheetsMusicComponent } from '../../SheetMusic/sheets-music/sheets-music.component';
import { UsersService } from '../../../Services/users.service';
import { FileUtilsService } from '../../../Services/fileutils.service';
import { PostService } from '../../../Services/post.service';
import { SheetMusicService } from '../../../Services/sheetmusic.service';
import { UserStateService, UserProfile } from '../../../Services/user-state.service';
import Users from '../../../Models/Users';
import Post from '../../../Models/Post';
import { EFollowStatus } from '../../../Models/Follow'; // ייבוא ה־enum

import SheetMusic from '../../../Models/SheetMusic';
import { log } from 'console';
import { switchMap } from 'rxjs/operators';
import { InteractionService } from '../../../Services/interaction.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule,
     PostsComponent,
      SheetsMusicComponent],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  activeTab: string = 'posts';
  profileId: number | null = null;
  profileData: Users | null = null;
  isCurrentUserProfile: boolean = false;
  isFollowing: boolean = false;
  posts: Post[] | undefined;
  sheets: SheetMusic[] | undefined;
  followStatus!: EFollowStatus;
  public EFollowStatus = EFollowStatus; 

  followButtonDisabled!: boolean;


  isTeacher: boolean = false; // ✅ משתנה חדש לבדיקת סטטוס מורה
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _usersService: UsersService,
    private _postService: PostService,
    private _sheetMusicService: SheetMusicService,
    public fileUtilsService: FileUtilsService,
    private _userStateService: UserStateService,
    private _interactionService: InteractionService
  ) { }


  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        this.profileId = Number(params.get('id'));
        if (!this.profileId) throw new Error('Profile ID not found');
        return this._usersService.getUserById(this.profileId);
      })
    ).subscribe({
      next: (data) => {
        this.profileData = data;

        const currentUser = this._userStateService.getCurrentUserValue();
        this.isCurrentUserProfile = currentUser ? this.profileId === Number(currentUser.id) : false;

        // אם זה לא פרופיל הנוכחי, טען את סטטוס המעקב
        if (!this.isCurrentUserProfile && this.profileId) {
          this._interactionService.getFollowStatus(this.profileId).subscribe({
            next: (status: EFollowStatus) => {
              this.followStatus = status; // עכשיו זה enum, לא string
              this.isFollowing = status === EFollowStatus.APPROVED;
              this.followButtonDisabled = status === EFollowStatus.PENDING;
            },
            error: (err) => console.error('Error getting follow status:', err)
          });

        }

        // טען את הלשונית הפעילה (posts כברירת מחדל)
        this.setActiveTab(this.activeTab);
      },
      error: (err) => console.error('Error loading profile:', err)
    });
  }


  loadPosts(userId: number): void {
    this._postService.getPostsByUserId(userId).subscribe({
      next: (res: Post[]) => {
        this.posts = res;
        console.log('Posts loaded (Count):', this.posts.length); // 💡 ודא שהלוג הזה מציג 1

        // (הקאונטר מתעדכן אוטומטית כי this.posts השתנה)
      },
      error: (err) => {
        console.error('Error loading posts:', err);
        this.posts = []; // אפס אם יש שגיאה כדי שהקאונטר יציג 0
      }
    });
  }

  loadSheets(userId: number): void {
    this._sheetMusicService.getSheetMusicsByUserId(userId).subscribe({
      next: (res) => this.sheets = res,
      error: (err) => console.error('Error loading sheets:', err)
    });
  }

  goBack(): void {
    this.router.navigate(['/musicians']);
  }

  sendMessage(): void {
    console.log(`Sending message to ${this.profileData?.name}`);
  }

  // ---------------------------
  // התנתקות אמיתית
  // ---------------------------
 handleSignOut(): void {
  this._userStateService.logout();
}


  /**
 * קובע את הלשונית הפעילה וטוען את הנתונים המתאימים.
 * @param tabName שם הלשונית ('posts', 'sheets', וכו').
 */
  setActiveTab(tabName: string): void {
    this.activeTab = tabName;
    this.posts = undefined; // איפוס הקאונטר של הפוסטים ב-HTML
    this.sheets = undefined; // איפוס הקאונטר של התווים
    // אם יש ProfileId, טען את הנתונים הרלוונטיים
    if (this.profileId) {
      switch (tabName) {
        case 'posts':
          // טוען פוסטים רק אם הלשונית היא 'posts'
          this.loadPosts(this.profileId);
          break;
        case 'sheets':
          // טוען תווים רק אם הלשונית היא 'sheets'
          this.loadSheets(this.profileId);
          break;
        // ניתן להוסיף כאן לוגיקה לטעינת movies, tracks וכו'
      }
    }
  }


  // ---------------------------
  // ניווט לקומפוננטת עריכה
  // ---------------------------
  // ניווט לקומפוננטת עריכה
  openEditProfileModal(): void {
    console.log('Button clicked!');
    console.log('profileData:', this.profileData); // הלוג הזה חשוב

    const currentUser = this._userStateService.getCurrentUserValue();

    // 🎯 התיקון: השתמש ב-ID של הקומפוננטה (שנלקח מה-URL)
    const profileId = this.profileId;

    if (currentUser && profileId != null) {
      // המשתמש הנוכחי יכול להיות מחרוזת, לכן משווים בצורה בטוחה
      const isCurrentUser = profileId === Number(currentUser.id);

      console.log('isCurrentUser:', isCurrentUser);
      console.log('profileId (from URL):', profileId);
      console.log('currentUser.id:', currentUser.id);

      if (isCurrentUser) {
        console.log('Navigating to edit profile with ID:', profileId);
        this.router.navigate(['/edit-profil-modal', profileId]);
      } else {
        console.warn('Cannot navigate: not current user profile.');
      }
    } else {
      console.warn('Cannot navigate: missing profile ID or current user.');
    }
  }
followUser(): void {
  if (!this.profileId || this.isCurrentUserProfile || this.followButtonDisabled) return;

  this._interactionService.toggleFollow(this.profileId).subscribe({
    next: (status: EFollowStatus) => {
      this.followStatus = status; // עכשיו זה enum
      this.isFollowing = status === EFollowStatus.APPROVED;
      this.followButtonDisabled = status === EFollowStatus.PENDING;
    },
    error: (err) => console.error(err)
  });
}

}