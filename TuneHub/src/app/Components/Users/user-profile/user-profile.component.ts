import { Component, Input, OnInit, input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PostsComponent } from '../../Post/posts/posts.component';
import Users, { ERole, UserType } from '../../../Models/Users';
import { SheetsMusicComponent } from '../../SheetMusic/sheets-music/sheets-music.component';
import { UsersService } from '../../../Services/users.service';
import { FileUtilsService } from '../../../Services/fileutils.service';
import { PostService } from '../../../Services/post.service';
import { SheetMusicService } from '../../../Services/sheetmusic.service';
import { MatMenuModule } from '@angular/material/menu';  
import { UserStateService, UserProfile } from '../../../Services/user-state.service';
import Post from '../../../Models/Post';
import { EFollowStatus } from '../../../Models/Follow'; // ייבוא ה־enum
import { InteractionService } from '../../../Services/interaction.service';

import SheetMusic from '../../../Models/SheetMusic';
// אין צורך ב-log מ-console בתוך הקוד, הוסר הייבוא המיותר

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, PostsComponent, SheetsMusicComponent, MatMenuModule],
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
    const newProfileId = Number(params.get('id')); // קבל את ה-ID החדש
    
    // 💡 1. בדוק אם ה-ID השתנה כדי למנוע ריצה מיותרת באתחול הדף
    if (this.profileId === newProfileId && this.profileData) {
        return; 
    }

    // 2. 🗑️ איפוס נתונים ישנים: זה החלק הכי חשוב!
    this.profileId = newProfileId; 
    this.posts = undefined; // מאפס את המשתנה כדי לאלץ טעינה מחדש!
    this.sheets = undefined; 
    this.profileData = null; // איפוס גם את נתוני הפרופיל

    // 3. 🚀 טען נתונים חדשים
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
        
        // 🟢 תיקון 1: אתחול currentUserId מהמשתמש המחובר
        this.currentUserId = currentUser ? Number(currentUser.id) : null; 

        this.isCurrentUserProfile = this.currentUserId ? id === this.currentUserId : false;
        
        const userRoles: ERole[] | undefined = currentUser?.roles as ERole[] | undefined;        
        
if (this.profileData.id=== this.profileId) { // 💡 אם למשתמש יש teacherId
    this.isStudentOfThisTeacher = true;
} else {
    this.isStudentOfThisTeacher = false;
}
        // בדיקה האם המשתמש המחובר מחזיק ברול ADMIN או SUPER_ADMIN
        this.isElevatedAdmin = !!userRoles && (
          userRoles.includes(ERole.ROLE_SUPER_ADMIN)
        );

        if (this.profileData.instrumentsUsers && this.profileData.instrumentsUsers.length > 0) {
            this.instrumentsString = this.profileData.instrumentsUsers.map(i => i.name).join(', ');
        } else {
            this.instrumentsString = ''; // איפוס
        }
      this.userRating = data.rating || 0; // ⬅️ טעינת הדירוג מהשרת
        // קביעת האם להציג את כפתור הניהול
        this.showAdminActions = !!currentUser && this.isElevatedAdmin && !this.isCurrentUserProfile;
        
        // קביעת האם הפרופיל הוא של מורה
const profileUserTypes: UserType[] = this.profileData.userTypes || [];
      this.isTeacher = profileUserTypes.includes(UserType.TEACHER);    
    // (אופציונלי אך מומלץ) השווה ל-uppercase:
    console.log('האם הפרופיל הוא מורה (isTeacher):', this.isTeacher);
    console.log('נתוני הפרופיל שהתקבלו:', data);
console.log('userTypes של הפרופיל:', this.profileData.userTypes); // ✅ שינוי לשם המערך userTypes
// ✅ הדפס את אובייקט המורה כדי לוודא שהוא מכיל נתונים:
if (this.isTeacher) {
    console.log('פרטי המורה (profileData.teacher):', data.teacher);
    // אתה אמור לראות כאן את experience, pricePerLesson וכו'
}
    //const teacherDetailsExists = !!data.teacher;  
        this.canBeStudent = (!!currentUser && !this.isCurrentUserProfile && this.isTeacher);
        
        // 🟢 תיקון 2: בדיקת סטטוס תלמיד בצורה נכונה
        if (this.canBeStudent && this.currentUserId !== null) {
            this._usersService.getUserById(this.currentUserId).subscribe({
                next: (currentUserData) => {
                    // הנתון הרלוונטי הוא teacherId של המשתמש המחובר
                  const isStudent: boolean = currentUserData.userTypes?.includes(UserType.STUDENT) || false;                    // בדיקה: האם ה-teacherId של המשתמש המחובר שווה ל-ID של הפרופיל הנוכחי?
        ////////////////////////////////////////////
        // const isStudent: boolean = currentUserData.userTypes?.includes(UserType.STUDENT) || false;
// this.isStudentOfThisTeacher = isStudent;
////////////////////////////////////////////
                                      console.log('האם אני כבר תלמיד של המורה הזה? (isStudentOfThisTeacher):', this.isStudentOfThisTeacher);
                },
                error: (err) => {
                    console.error('שגיאה בטעינת המשתמש המחובר לבדיקת מורה:', err);
                    this.isStudentOfThisTeacher = false;
                }
            });
        } else {
            this.isStudentOfThisTeacher = false; // איפוס סטטוס אם לא רלוונטי
        }
        
        // 🟢 תיקון 3: טען פוסטים ותווים כאן פעם אחת בלבד
        if (!this.posts) {
            this.loadPosts(id);
        }
        if (!this.sheets) {
            this.loadSheets(id);
        }
      },
      error: (err) => console.error('שגיאה בטעינת הפרופיל:', err)
    });
  }

  assignAdminRole(): void {
    if (!this.profileId || !this.profileData) {
      console.error('אין ID של משתמש יעד לעדכון רול.');
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
            console.error('שגיאה בעדכון הרול:', err);
            alert('שגיאה בעדכון הרול. נסה שוב מאוחר יותר.');
          }
        });
    }
  }

  assignSuperAdminRole(): void {
    if (!this.profileId || !this.profileData) {
      console.error('אין ID של משתמש יעד לעדכון רול.');
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
          console.error('שגיאה בעדכון הרול:', err);
          alert('שגיאה בעדכון הרול. נסה שוב מאוחר יותר.');
        }
      });
    }
  }

  joinAsStudent(): void {
      if (!this.currentUserId || !this.profileId || !this.isTeacher) {
          console.error('חסרים נתונים נחוצים להצטרפות כתלמיד.');
          return;
      }
      
      this._usersService.joinTeacher(this.currentUserId, this.profileId).subscribe({
          next: () => {
              alert(`הצטרפת בהצלחה כסטודנט של ${this.profileData?.name}!`);
              this.isStudentOfThisTeacher = true;
          },
          error: (err) => {
              console.error('שגיאה בהצטרפות למורה:', err);
              alert('שגיאה בהצטרפות למורה. נסה שוב מאוחר יותר.');
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
        alert('עליך למלא את שדות העיר, המדינה והתיאור לפני שתוכל להצטרף כמורה.');
        
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
        console.log('Posts loaded (Count):', this.posts.length); 
        console.log('Tracks loaded (Count):', this.tracks.length);
        console.log('Videos loaded (Count):', this.videos.length);
      console.log('Attempting to load posts for UserId:', userId);
      },
      error: (err) => {
        console.error('Error loading posts:', err);
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
      error: (err) => console.error('Error loading sheets:', err)
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

  // 🟢 תיקון 4: הסרת איפוס הנתונים כדי למנוע טעינה מחדש מיותרת
  setActiveTab(tabName: string): void {
    this.activeTab = tabName;
    // אין צורך לאפס את this.posts ו-this.sheets כאן
    
    // אם הלוגיקה ב-loadProfileData עובדת נכון, אין צורך בבדיקה זו כאן
    // אבל ניתן להשאיר אותה כבדיקת בטיחות (Guard)
    if (this.profileId && tabName !== 'overview') {
        if (!this.posts) {
          this.loadPosts(this.profileId);
        }
        if (!this.sheets) {
          this.loadSheets(this.profileId);
        }
    }
  }

 


deleteUser(): void {
    // 1. בדיקת בטיחות: ודא שיש ID ונתוני פרופיל
    if (!this.profileId || !this.profileData) {
        console.error('חסרים נתונים נחוצים למחיקה (profileId או profileData).');
        return;
    }
    
    // 2. קונפירמציה מהמשתמש
    if (!confirm(`האם אתה בטוח שברצונך למחוק לצמיתות את המשתמש ${this.profileData.name} (ID: ${this.profileId})? פעולה זו היא בלתי הפיכה!`)
    ) {
        return;
    }

    // 3. קריאה לשירות למחיקה
    this._usersService.deleteUser(this.profileId).subscribe({
        next: () => {
            alert(`המשתמש ${this.profileData!.name} נמחק בהצלחה!`);
            // 4. ניווט: הפניית המשתמש לרשימת המשתמשים או לדף הבית לאחר המחיקה.
            this.router.navigate(['/home-page']); // או כל נתיב רלוונטי אחר
        },
        error: (err) => {
            console.error('שגיאת מחיקה מהשרת:', err);
            // הצגת הודעת שגיאה מפורטת יותר
            const errorMessage = err.status === 403 
                ? 'שגיאה: אין לך הרשאה למחוק משתמשים (נדרש SUPER_ADMIN).'
                : `שגיאה במהלך המחיקה. קוד: ${err.status}`;
            alert(errorMessage);
        }
    });
}
  // ---------------------------
  // ניווט לקומפוננטת עריכה
  // ---------------------------
  // ניווט לקומפוננטת עריכה
  openEditProfileModal(): void {
    console.log('Button clicked!');
    console.log('profileData:', this.profileData); // הלוג הזה חשוב

    const currentUser = this.userStateService.getCurrentUserValue();

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