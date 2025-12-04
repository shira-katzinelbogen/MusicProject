import { Component, Input, OnInit, input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import Users, { ERole, UserType } from '../../../Models/Users';
import Post from '../../../Models/Post';
import { UsersService } from '../../../Services/users.service';
import { PostService } from '../../../Services/post.service';
import { SheetMusicService } from '../../../Services/sheetmusic.service';
import { UserStateService, UserProfile } from '../../../Services/user-state.service';
import { EFollowStatus } from '../../../Models/Follow'; // ייבוא ה־enum
import { InteractionService } from '../../../Services/interaction.service';

import SheetMusic from '../../../Models/SheetMusic';
import { MusicCardComponent } from '../../SheetMusic/music-card/music-card.component';
import { PostCardComponent } from '../../Post/post-card/post-card.component';
import { PostsComponent } from '../../Post/posts/posts.component';
import { SheetsMusicComponent } from '../../SheetMusic/sheets-music/sheets-music.component';
import { FileUtilsService } from '../../../Services/fileutils.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, PostsComponent, SheetsMusicComponent, MatMenuModule,MusicCardComponent,PostCardComponent],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  activeTab: string = 'posts';
  profileId: number | null = null;
  profileData: Users | null = null;
  isCurrentUserProfile: boolean = false; 
  userRating: number = 0;
  isFollowing: boolean = false; 
  posts: Post[] | undefined;
  sheets: SheetMusic[] | undefined;
  tracks: Post[] | undefined; 
  videos: Post[] | undefined;
  isStudentOfThisTeacher: boolean = false; // האם המשתמש הנוכחי הוא תלמיד של פרופיל זה?
  canBeStudent: boolean = false; // האם כפתור "הצטרף כתלמיד" צריך להיות מוצג? (אינו מורה, אינו הפרופיל שלי)
  currentUserId: number | null = null; // ID של המשתמש המחובר
  isTeacher: boolean = false; // ✅ משתנה חדש לבדיקת סטטוס מורה
  isElevatedAdmin: boolean = false; // האם המשתמש המחובר הוא ADMIN או SUPER_ADMIN
  showAdminActions: boolean = false; // האם להציג את כפתור 3 הנקודות
  public instrumentsString: string = ''; // ניתן לשנות ל-getters/setters בהמשך אם צריך
  followStatus: EFollowStatus = EFollowStatus.NONE; // סטטוס ברירת מחדל
  followButtonDisabled: boolean =false;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _usersService: UsersService,
    private _postService: PostService,
    private _sheetMusicService: SheetMusicService,
    public fileUtilsService: FileUtilsService,
    private userStateService: UserStateService,
    private _interactionService: InteractionService
  ) {}

ngOnInit(): void {
  this.route.paramMap.subscribe(params => {
    const newProfileId = Number(params.get('id')); 
    
    if (this.profileId === newProfileId && this.profileData) {
        return; 
    }

    this.profileId = newProfileId; 
    this.posts = undefined; 
    this.sheets = undefined; 
    this.profileData = null; 

    if (this.profileId) {
      this.loadProfileData(this.profileId);
    }
  });
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
 loadProfileData(id: number): void {
    this._usersService.getUserById(id).subscribe({
      next: (data) => {
        this.profileData = data;

        const currentUser: UserProfile | null = this.userStateService.getCurrentUserValue();
        this.currentUserId = currentUser ? Number(currentUser.id) : null;
        this.isCurrentUserProfile = this.currentUserId ? id === this.currentUserId : false;

        const userRoles: ERole[] | undefined = currentUser?.roles as ERole[] | undefined;
        this.isElevatedAdmin = !!userRoles && userRoles.includes(ERole.ROLE_SUPER_ADMIN);

        if (this.profileData.id === this.profileId) {
            this.isStudentOfThisTeacher = true;
        } else {
            this.isStudentOfThisTeacher = false;
        }

        this.isElevatedAdmin = !!userRoles && 
          userRoles.includes(ERole.ROLE_SUPER_ADMIN);

        if (this.profileData.instrumentsUsers && this.profileData.instrumentsUsers.length > 0) {
            this.instrumentsString = this.profileData.instrumentsUsers.map(i => i.name).join(', ');
        } else {
            this.instrumentsString = '';
        }

        this.userRating = data.rating || 0;

        this.showAdminActions = !!currentUser && this.isElevatedAdmin && !this.isCurrentUserProfile;
        this.isTeacher = this.profileData.userTypes?.includes(UserType.TEACHER) || false;
        this.canBeStudent = !!currentUser && !this.isCurrentUserProfile && this.isTeacher;

        const profileUserTypes: UserType[] = this.profileData.userTypes || [];
        this.isTeacher = profileUserTypes.includes(UserType.TEACHER);

        this.canBeStudent = (!!currentUser && !this.isCurrentUserProfile && this.isTeacher);

        if (this.canBeStudent && this.currentUserId !== null) {
            this._usersService.getUserById(this.currentUserId).subscribe({
                next: (currentUserData) => {
                    const isStudent: boolean = currentUserData.userTypes?.includes(UserType.STUDENT) || false;
                    console.log('isStudentOfThisTeacher:', this.isStudentOfThisTeacher);
                },
                error: (err) => {
                    console.error('שגיאה:', err);
                    this.isStudentOfThisTeacher = false;
                }
            });
        } else {
            this.isStudentOfThisTeacher = false;
        }

        this.loadPosts(id);
        this.loadSheets(id);
      },
      error: (err) => console.error('Error loading profile:', err)
    });
  }
assignAdminRole(): void {
  if (!this.profileId || !this.profileData) {
    console.error('אין ID יעד.');
    return;
  }

  if (confirm(`האם אתה בטוח שברצונך להפוך את ${this.profileData.name} למנהל (ADMIN)?`)) {
    this._usersService.updateUserRole(this.profileId, ERole.ROLE_ADMIN).subscribe({
      next: () => {
        this.profileData!.roles = [ERole.ROLE_ADMIN];
        alert(`${this.profileData!.name} הוא כעת מנהל (ADMIN)!`);
        this.loadProfileData(this.profileId!);
      },
      error: (err) => {
        console.error('שגיאה:', err);
        alert('שגיאה בעדכון רול.');
      }
    });
  }
}



 assignSuperAdminRole(): void {
  if (!this.profileId || !this.profileData) {
    console.error('אין ID יעד.');
    return;
  }

  if (confirm(`האם אתה בטוח שברצונך להפוך את ${this.profileData.name} למנהל ראשי (SUPER ADMIN)?`)) {
    this._usersService.updateUserRole(this.profileId, ERole.ROLE_SUPER_ADMIN).subscribe({
      next: () => {
        this.profileData!.roles = [ERole.ROLE_SUPER_ADMIN];
        alert(`${this.profileData!.name} הוא כעת מנהל ראשי (SUPER ADMIN)!`);
        this.loadProfileData(this.profileId!);
      },
      error: (err) => {
        console.error('שגיאה:', err);
        alert('שגיאה בעדכון רול.');
      }
    });
  }
}


 joinAsStudent(): void {
  if (!this.currentUserId || !this.profileId || !this.isTeacher) {
    console.error('חסרים נתונים.');
    return;
  }

  this._usersService.joinTeacher(this.currentUserId, this.profileId).subscribe({
    next: () => {
      alert(`הצטרפת בהצלחה כסטודנט של ${this.profileData?.name}!`);
      this.isStudentOfThisTeacher = true;
    },
    error: (err) => {
      console.error('שגיאה:', err);
      alert('שגיאה בהצטרפות.');
    }
  });
}

  checkTeacherEligibility(): void {
    if (!this.profileData || this.profileId === null) return;

    const isEligible = 
        !!this.profileData.city && 
        !!this.profileData.country && 
        !!this.profileData.description;

    const userIdAsNumber = Number(this.profileId);
    
    if (isEligible) {
        if (!isNaN(userIdAsNumber)) {
            this.router.navigate(['/teacher-signup', userIdAsNumber]);
        }
    } else {
        alert('עליך למלא את העיר, המדינה והתיאור.');
        
        if (this.isCurrentUserProfile && !isNaN(userIdAsNumber)) {
          this.openEditProfileModal(); 
        }
    }
  }

  loadPosts(userId: number): void {
    this._postService.getPostsByUserId(userId).subscribe({
      next: (res: Post[]) => { 
        this.posts = res;
        this.tracks = res.filter(p => p.audioPath && p.audioPath.length > 0);
        this.videos = res.filter(p => p.videoPath && p.videoPath.length > 0);

      },
      error: (err) => {
        console.error('Error:', err);
        this.posts = []; 
        this.tracks = [];
        this.videos = [];
      }
    });
  }

  getStarArray(): string[] {
    const rating = this.userRating;
    const stars = [];
    
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars.push('star'); 
        } else if (i - rating < 1 && i - rating > 0) {
            if (rating % 1 >= 0.25) { 
               stars.push('star_half'); 
            } else {
               stars.push('star_border'); 
            }
        } else {
            stars.push('star_border'); 
        }
    }
    
    return stars.slice(0, 5);
  }

  loadSheets(userId: number): void {
    this._sheetMusicService.getSheetMusicsByUserId(userId).subscribe({
      next: (res) => this.sheets = res,
      error: () => this.sheets = []
    });
  }

  goBack(): void {
    this.router.navigate(['/musicians']);
  }

  sendMessage(): void {
    console.log(`Sending message to ${this.profileData?.name}`);
  }

  handleSignOut(): void {
    this._usersService.signOut().subscribe({
      next: () => {
        this.userStateService.clearUser();
        this.router.navigate(['/home']);
      },
      error: (err) => console.error('Error signing out:', err)
    });
  }

  setActiveTab(tabName: string): void {
    this.activeTab = tabName;

    if (this.profileId && tabName !== 'overview') {
        if (!this.posts) this.loadPosts(this.profileId);
        if (!this.sheets) this.loadSheets(this.profileId);
    }
  }

  openEditProfileModal(): void {
    console.log('Button clicked!');
    console.log('profileData:', this.profileData);

    const currentUser = this.userStateService.getCurrentUserValue();
    const profileId = this.profileId;

    if (currentUser && profileId != null) {
      const isCurrentUser = profileId === Number(currentUser.id);

      if (isCurrentUser) {
        console.log(`Navigating to edit profile with ID: ${profileId}`);
        this.router.navigate(['/edit-profil-modal', profileId]);
      } else {
        console.warn('Cannot navigate: not current user.');
      }
    } else {
      console.warn('Missing data.');
    }
  }

  followUser(): void {
    if (!this.profileId || this.isCurrentUserProfile || this.followButtonDisabled) return;

    this._interactionService.toggleFollow(this.profileId).subscribe({
      next: (status: EFollowStatus) => {
        this.followStatus = status;
        this.isFollowing = status === EFollowStatus.APPROVED;
        this.followButtonDisabled = status === EFollowStatus.PENDING;
      },
      error: (err) => console.error(err)
    });
  }

  deleteUser(): void {
    if (!this.profileId || !this.profileData) {
        console.error('Missing data.');
        return;
    }

    if (!confirm(`Are you sure you want to delete the user ${this.profileData.name} (ID: ${this.profileId})?`)) {
        return;
    }

    this._usersService.deleteUser(this.profileId).subscribe({
        next: () => {
            alert(`The user ${this.profileData!.name} was successfully deleted!`);
            this.router.navigate(['/home-page']);
        },
        error: (err) => {
            console.error('Error:', err);
            const errorMessage = err.status === 403
                ? 'No permission to delete users.'
                : `Error during deletion. Code: ${err.status}`;
            alert(errorMessage);
        }
    });
  }


}
 
