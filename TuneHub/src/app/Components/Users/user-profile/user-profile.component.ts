import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { UsersService } from '../../../Services/users.service';
import { UserStateService } from '../../../Services/user-state.service';
import { InteractionService } from '../../../Services/interaction.service';
import { FileUtilsService } from '../../../Services/fileutils.service';
import Post from '../../../Models/Post';
import SheetMusic from '../../../Models/SheetMusic';
import { EFollowStatus } from '../../../Models/Follow';
import {  UsersProfileCompleteDTO } from '../../../Models/Users';
import { PostCardComponent } from '../../Post/post-card/post-card.component';
import { MusicCardComponent } from '../../SheetMusic/music-card/music-card.component';
import { NoResultsComponent } from '../../Shared/no-results/no-results.component';
import { NavigationService } from '../../../Services/navigation.service';
import { TimeAgoPipe } from '../../../Pipes/time-ago.pipe';
import { StatsCounterComponent } from "../../Shared/stats-counter/stats-counter.component";
import { ERole } from '../../../Models/Role';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatMenuModule,
    PostCardComponent, MusicCardComponent, NoResultsComponent, TimeAgoPipe, StatsCounterComponent],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})

export class UserProfileComponent implements OnInit {

  profileId: number | null = null;
  profileData!: UsersProfileCompleteDTO;

  public createdAtDate: Date | null = null;
  public editedInDate: Date | null = null;

  activeTab: string = 'posts';

  posts: Post[] = [];
  tracks: Post[] = [];
  videos: Post[] = [];
  sheets: SheetMusic[] = [];

  userRating: number = 0;

  currentUserId: number | null = null;
  isOwnProfile: boolean = false;
  isStudentOfThisTeacher: boolean = false;
  canBeStudent: boolean = false;
  isTeacher: boolean = false;
  showAdminActions: boolean = false;

  followStatus: EFollowStatus = EFollowStatus.NONE;
  followButtonDisabled: boolean = false;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private usersService: UsersService,
    private userStateService: UserStateService,
    private interactionService: InteractionService,
    public navigationService: NavigationService,
    public fileUtilsService: FileUtilsService
  ) { }


  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id) {
        this.profileId = id;
        this.loadProfile(id);
      }
    });
  }


  loadProfile(id: number): void {
    this.usersService.getProfileComplete(id).subscribe({
      next: (profile: UsersProfileCompleteDTO) => {
        this.profileData = profile;

        if (this.profileData.createdAt) {
          this.createdAtDate = profile.createdAt ? new Date(profile.createdAt) : null;

        }
        if (this.profileData.editedIn) {
          this.editedInDate = profile.editedIn ? new Date(profile.editedIn) : null;
        }

        const currentUser = this.userStateService.getCurrentUserValue();
        this.currentUserId = currentUser?.id ?? null;

        this.isOwnProfile = profile.ownProfile;
        this.canBeStudent = profile.canBeMyStudent;
        this.isStudentOfThisTeacher = profile.myStudent;
        this.isTeacher = !!profile.teacherDetails;
        if (profile.teacherDetails) {
          this.activeTab = 'teacher';
        }
        this.showAdminActions = profile.canEditRoles || profile.canDelete;

        this.userRating = profile.rating ?? 0;

        this.loadPosts();
        this.loadSheets();
      },
      error: (err) => console.error('Error loading profile:', err)
    });
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  loadPosts(): void {
    this.posts = this.profileData.posts || [];
    this.tracks = this.posts.filter(p => !!p.audioPath);
    this.videos = this.posts.filter(p => !!p.videoPath);
  }

  loadSheets(): void {
    this.sheets = this.profileData.sheetsMusic || [];
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  getStarArray(): string[] {
    const rating = this.userRating;
    const stars: string[] = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) stars.push('star');
      else if (i - rating < 1 && rating % 1 >= 0.25) stars.push('star_half');
      else stars.push('star_border');
    }
    return stars.slice(0, 5);
  }

  openEditProfileModal(): void {
    if (this.profileId && this.isOwnProfile) {
      this.router.navigate(['/edit-profil-modal', this.profileId]);
    }
  }


  joinAsStudent(): void {
    if (!this.profileId) return;
    this.usersService.joinTeacher(this.profileId).subscribe({
      next: () => {
        alert(`You have successfully added ${this.profileData.name} as your student.`);
        this.isStudentOfThisTeacher = true;
      },
      error: (err) => {
        console.error(err);
        alert('Add student error!');
      }
    });
  }

  assignAdminRole(): void {
    if (!this.profileId) return;
    if (confirm(`האם אתה בטוח שברצונך להפוך את ${this.profileData.name} למנהל (ADMIN)?`)) {
      this.usersService.updateUserRole(this.profileId, ERole.ROLE_ADMIN).subscribe({
        next: () => {
          alert(`${this.profileData.name} הוא כעת מנהל (ADMIN)!`);
          this.loadProfile(this.profileId!);
        },
        error: (err) => console.error(err)
      });
    }
  }

  assignSuperAdminRole(): void {
    if (!this.profileId) return;
    if (confirm(`האם אתה בטוח שברצונך להפוך את ${this.profileData.name} למנהל ראשי (SUPER ADMIN)?`)) {
      this.usersService.updateUserRole(this.profileId, ERole.ROLE_SUPER_ADMIN).subscribe({
        next: () => {
          alert(`${this.profileData.name} הוא כעת מנהל ראשי (SUPER ADMIN)!`);
          this.loadProfile(this.profileId!);
        },
        error: (err) => console.error(err)
      });
    }
  }


  deleteUser(): void {
    if (!this.profileId) return;
    if (confirm(`Are you sure you want to delete ${this.profileData.name}?`)) {
      this.usersService.deleteUser(this.profileId).subscribe({
        next: () => {
          alert(`User ${this.profileData.name} deleted.`);
          this.router.navigate(['/home']);
        },
        error: (err) => console.error(err)
      });
    }
  }


  followUser(): void {
    if (!this.profileId || this.isOwnProfile || this.followButtonDisabled) return;
    this.interactionService.toggleFollow(this.profileId).subscribe({
      next: (status: EFollowStatus) => {
        this.followStatus = status;
        this.isStudentOfThisTeacher = status === EFollowStatus.APPROVED;
        this.followButtonDisabled = status === EFollowStatus.PENDING;
      },
      error: (err) => console.error(err)
    });
  }

  handleSignOut(): void {
    this.userStateService.logout();
  }

  getTagClass(type: string): string {
    return type;
  }

  getGmailLink(): string {
    const currentUser = this.userStateService.getCurrentUserValue();
    const senderName = currentUser?.name || 'A TuneHub User';
    const subject = `Hi, I saw your profile on TuneHub`;
    const body = `Hi ${this.profileData.name},%0D%0A%0D%0AI came across your profile on TuneHub and was impressed with your talent! I would love to connect with you and learn more about your musical journey.%0D%0A%0D%0AHope to hear from you soon!%0D%0A%0D%0ABest regards%0D%0A${senderName}`;
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${this.profileData.email}&subject=${subject}&body=${body}`;
  }
}


