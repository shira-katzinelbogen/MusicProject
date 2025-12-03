import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import Users, { ERole, UserType } from '../../../Models/Users';
import Post from '../../../Models/Post';
import SheetMusic from '../../../Models/SheetMusic';
import { UsersService } from '../../../Services/users.service';
import { PostService } from '../../../Services/post.service';
import { SheetMusicService } from '../../../Services/sheetmusic.service';
import { FileUtilsService } from '../../../Services/fileutils.service';
import { UserStateService, UserProfile } from '../../../Services/user-state.service';
import { InteractionService } from '../../../Services/interaction.service';
import { EFollowStatus } from '../../../Models/Follow';
import { PostCardComponent } from '../../Post/post-card/post-card.component';
import { MusicCardComponent } from '../../SheetMusic/music-card/music-card.component';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatMenuModule, PostCardComponent, MusicCardComponent],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  activeTab: string = 'overview';
  profileId: number | null = null;
  profileData: Users | null = null;
  isCurrentUserProfile: boolean = false;
  userRating: number = 0;
  isFollowing: boolean = false;
  posts: Post[] = [];
  sheets: SheetMusic[] = [];
  tracks: Post[] = [];
  videos: Post[] = [];
  isStudentOfThisTeacher: boolean = false;
  canBeStudent: boolean = false;
  currentUserId: number | null = null;
  isTeacher: boolean = false;
  isElevatedAdmin: boolean = false;
  showAdminActions: boolean = false;
  instrumentsString: string = '';
  followStatus: EFollowStatus = EFollowStatus.NONE;
  followButtonDisabled: boolean = false;

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
      if (this.profileId === newProfileId && this.profileData) return;

      this.profileId = newProfileId;
      this.posts = [];
      this.sheets = [];
      this.tracks = [];
      this.videos = [];
      this.profileData = null;

      if (this.profileId) {
        this.loadProfileData(this.profileId);
      }
    });
  }

  loadProfileData(id: number): void {
    this._usersService.getUserById(id).subscribe({
      next: (data) => {
        this.profileData = data;

        const currentUser: UserProfile | null = this.userStateService.getCurrentUserValue();
        this.currentUserId = currentUser ? Number(currentUser.id) : null;
        this.isCurrentUserProfile = this.currentUserId ? id === this.currentUserId : false;

        const userRoles: ERole[] | undefined = currentUser?.roles as ERole[] | undefined;
        this.isElevatedAdmin = !!userRoles && userRoles.includes(ERole.ROLE_SUPER_ADMIN);

        this.instrumentsString = this.profileData.instrumentsUsers?.map(i => i.name).join(', ') || '';
        this.userRating = data.rating || 0;

        this.showAdminActions = !!currentUser && this.isElevatedAdmin && !this.isCurrentUserProfile;
        this.isTeacher = this.profileData.userTypes?.includes(UserType.TEACHER) || false;
        this.canBeStudent = !!currentUser && !this.isCurrentUserProfile && this.isTeacher;

        if (this.canBeStudent && this.currentUserId) {
          this._usersService.getUserById(this.currentUserId).subscribe({
            next: (currentUserData) => {
              this.isStudentOfThisTeacher = currentUserData.userTypes?.includes(UserType.STUDENT) || false;
            },
            error: () => this.isStudentOfThisTeacher = false
          });
        }

        this.loadPosts(id);
        this.loadSheets(id);
      },
      error: (err) => console.error('Error loading profile:', err)
    });
  }

  loadPosts(userId: number): void {
    this._postService.getPostsByUserId(userId).subscribe({
      next: (res: Post[]) => {
        this.posts = res;
        this.tracks = res.filter(p => !!p.audioPath);
        this.videos = res.filter(p => !!p.videoPath);
      },
      error: () => {
        this.posts = [];
        this.tracks = [];
        this.videos = [];
      }
    });
  }

  loadSheets(userId: number): void {
    this._sheetMusicService.getSheetMusicsByUserId(userId).subscribe({
      next: (res) => this.sheets = res,
      error: () => this.sheets = []
    });
  }

  getStarArray(): string[] {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= this.userRating) stars.push('star');
      else if (i - this.userRating < 1 && i - this.userRating > 0) stars.push(this.userRating % 1 >= 0.25 ? 'star_half' : 'star_border');
      else stars.push('star_border');
    }
    return stars.slice(0, 5);
  }

  setActiveTab(tabName: string): void {
    this.activeTab = tabName;
    if (this.profileId && (tabName !== 'overview')) {
      if (!this.posts.length) this.loadPosts(this.profileId);
      if (!this.sheets.length) this.loadSheets(this.profileId);
    }
  }

  openEditProfileModal(): void {
    if (!this.profileId) return;
    this.router.navigate(['/edit-profil-modal', this.profileId]);
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

  joinAsStudent(): void {
    if (!this.currentUserId || !this.profileId || !this.isTeacher) return;

    this._usersService.joinTeacher(this.currentUserId, this.profileId).subscribe({
      next: () => this.isStudentOfThisTeacher = true,
      error: (err) => console.error(err)
    });
  }

  assignAdminRole(): void {
    if (!this.profileId) return;
    this._usersService.updateUserRole(this.profileId, ERole.ROLE_ADMIN).subscribe();
  }

  assignSuperAdminRole(): void {
    if (!this.profileId) return;
    this._usersService.updateUserRole(this.profileId, ERole.ROLE_SUPER_ADMIN).subscribe();
  }

  handleSignOut(): void {
    this._usersService.signOut().subscribe({
      next: () => {
        this.userStateService.clearUser();
        this.router.navigate(['/home']);
      }
    });
  }



    // פונקציה לדוגמה
  checkTeacherEligibility() {
    // כאן הקוד שבודק אם המשתמש יכול להפוך למורה
  }

  deleteUser() {
    // כאן הקוד שמוחק משתמש (admin action)
  }
}
