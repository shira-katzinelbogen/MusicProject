import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import Users, { UserType } from '../../../Models/Users';
import { UsersService } from '../../../Services/users.service'; 
import { UserStateService } from '../../../Services/user-state.service';
import { FileUtilsService } from '../../../Services/fileutils.service';
import { SafeUrl } from '@angular/platform-browser';
import { NavigationService } from '../../../Services/navigation.service';
import { MatIcon } from "@angular/material/icon";
import { FormsModule } from '@angular/forms';
import { HighlightPipe } from "../../Shared/highlight/highlight.component";

@Component({
  selector: 'app-musicians',
  standalone: true,
  imports: [RouterModule, MatIcon, FormsModule, HighlightPipe],
  templateUrl: './musicians.component.html',
  styleUrl: './musicians.component.css'
})
export class MusiciansComponent implements OnInit {

  public users: Users[] = [];
  public isShowDetails: boolean = false;
  public selectedUser!: Users;
  showFilters: boolean = false;
  public user!: Users; // המשתמש הנוכחי (זה שמחובר)
  public isMusician: boolean = false; // האם המשתמש הוא כבר MUSIC_LOVER
  public needsProfileUpdate: boolean = false; // האם חסרים פרטי עיר/תיאור
private currentUserId: number | null = null;
public searchText:string = '';
  // --- 1. רשימות נתונים ---
    // הרשימה המקורית המלאה של המוזיקאים (לאחר הטעינה הראשונית). 
    // נשארת מלאה כדי לאפס את הסינון.
    originalMusicianList: Users[] = [];
    
    // הרשימה המוצגת בפועל על המסך (הרשימה המסוננת).
    musicianList: Users[] = [];
    
    // הזרקת ChangeDetectorRef (נדרש לפונקציה applyMusicianFilters)
    // אם לא הזרקת עדיין:
    // constructor(private cdr: ChangeDetectorRef, ...) { }

    // --- 2. אפשרויות ל-Dropdowns/רשימות הסינון (נתונים גולמיים) ---
    // אפשרויות העיר לסינון
    cities: string[] = ['All'];
    // אפשרויות המדינה לסינון
    countries: string[] = ['All'];
    // אפשרויות השנה לסינו
    createdYears: string[] = ['All'];

    // --- 3. משתני הבחירה הנוכחית (ערכי ה-Filter שנבחרו על ידי המשתמש) ---
    selectedCity: string = 'All';
    selectedCountry: string = 'All';
    selectedCreatedYear: string = 'All';
  constructor(
    private router: Router,
    private _usersService: UsersService,
    private _userStateService: UserStateService,
    public fileUtilsService: FileUtilsService,
    public navigationService: NavigationService,
    private route: ActivatedRoute // *** הזרקת ActivatedRoute ***
  
  ) { }
ngOnInit(): void {
  // 1. קבלת המשתמש הנוכחי מהשירות (UserStateService)
  const currentUser = this._userStateService.getCurrentUserValue();

    if (!currentUser) {
      console.error("אין משתמש מחובר");
      return;
    }

    // 1. שמור את ה-ID הסינכרוני
    this.currentUserId = currentUser.id; 
    console.log("User ID:", this.currentUserId);

    // 2. טעינת רשימת המוזיקאים
    this.loadMusicians();

  // 3. טעינת המשתמש המלא
  this._usersService.getUserById(this.currentUserId).subscribe({
    next: (fullUser) => {
      this.user = fullUser;

      // שמירה על הלוגיקה הקיימת
      const userTypes: UserType[] = this.user.userTypes || [];
      this.isMusician = userTypes.includes(UserType.MUSICIAN);
        this.needsProfileUpdate = !this.user.city || !this.user.description;
    },
    error: (err) => console.error('שגיאה בטעינת המשתמש הנוכחי:', err)
  });
}


loadCurrentUser(userId: number): void {
  this._usersService.getUserById(userId).subscribe({
    next: (currentUser: Users) => {
      this.user = currentUser;

      // התאמה מלאה ללוגיקה המקורית שלך
const userTypes: UserType[] = this.user.userTypes || [];
      this.isMusician = userTypes.includes(UserType.MUSICIAN);
      this.needsProfileUpdate =
        !this.user.city ||
        !this.user.description;

      console.log("משתמש נטען:", this.user);
    },
    error: (err) => {
      console.error("שגיאה בטעינת המשתמש הנוכחי:", err);
    }
  });
}



// src/app/musicians/musicians.component.ts

// src/app/musicians/musicians.component.ts

loadMusicians(): void {
    this._usersService.getMusicians().subscribe({
      next: (res) => {
        // ⭐️ התיקון: סינון קשיח ב-Frontend לפי סוג המשתמש הנכון (UserType.MUSICIANS)
        // השתמש ב-userType כפי שהצגת בפלט הקונסול.
       const onlyMusicians = res.filter(user => (user.userTypes || []).includes(UserType.MUSICIAN));
        this.users = onlyMusicians;
        this.originalMusicianList = onlyMusicians;
        
        // אם יש בעיה ב-userType, נסה את EUserType (אם זה השם המדויק)
        // const onlyMusicians = res.filter(user => user.EUserType === UserType.MUSICIANS); 

        this.extractMusicianFilterOptions(onlyMusicians);
        this.applyMusicianFilters();

        console.log('מספר מוזיקאים מוצגים לאחר סינון Frontend:', onlyMusicians.length);
      },
      error: (err) => {
        console.error('שגיאה בהבאת נתוני מוזיקאים:', err);
      }
    });
  }
joinMusicianNetwork(): void {
  if (this.isMusician) {
    console.log('המשתמש כבר מוגדר כמוזיקאי.');
    return;
  }

  if (this.needsProfileUpdate) {
    this.router.navigate(['/edit-profil-modal', this.currentUserId]);
  } else {
    // השתמש ב-currentUserId אם this.user לא מוגדר או אין לו id
    const idToUse = this.user?.id ?? this.currentUserId;

    if (!idToUse) {
      console.error('לא ניתן למצוא את ה-ID של המשתמש.');
      return;
    }

    // אם this.user לא קיים, צור אובייקט מינימלי עם ה-id
    if (!this.user) {
      this.user = { id: idToUse } as Users;
    }

    this.updateUserTypeToMusician(idToUse);
  }
}

updateUserTypeToMusician(userId: number): void {
  if (!userId) {
    console.error("למשתמש אין ID!");
    return;
  }

  if (this.isMusician) {
    console.log('המשתמש כבר מוגדר כמוזיקאי.');
    return;
  }

  if (!this._userStateService.hasRole('ROLE_USER')) {
    console.error('למשתמש אין הרשאות מתאימות לעדכון סוג משתמש.');
    return;
  }

  this._usersService.updateUserType(userId, UserType.MUSICIAN).subscribe({
    next: () => {
      this.isMusician = true;
      alert('ברוך הבא לרשת המוזיקאים!');

      // עדכן את this.user.userType רק אם this.user קיים
      if (this.user) {
                    const userTypes = this.user.userTypes || [];
                    if (!userTypes.includes(UserType.MUSICIAN)) {
                        userTypes.push(UserType.MUSICIAN);
                    }
                    this.user.userTypes = [...userTypes]; // עדכון המערך (אם משתמשים ב-OnPush)
     }

      this.loadMusicians();
    },
    error: (err) => {
      console.error('שגיאה בעדכון סוג המשתמש:', err);
      alert('שגיאה בעדכון הפרופיל. נסה שוב מאוחר יותר.');
    }
  });
}



  // פונקציה להחלפת המצב (toggle) בלחיצה על כפתור הפילטרים
  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  /**
     * מחלץ את האפשרויות הייחודיות של עיר, מדינה ושנת כניסה מתוך רשימת המוזיקאים.
     * יש לקרוא לפונקציה זו פעם אחת, לאחר טעינת originalMusicianList מהשרת.
     */
    extractMusicianFilterOptions(musicians: Users[]): void {
        // 1. חילוץ ערים ייחודיות
        
        const citySet = new Set<string>();
        musicians.forEach(musician => {
            if (musician.city && musician.city.trim() !== '') {
                citySet.add(musician.city.trim());
            }
        });
        this.cities = ['All', ...Array.from(citySet).sort()];
          console.log("musicians:", this.musicianList);

        // 2. חילוץ מדינות ייחודיות
        const countrySet = new Set<string>();
        musicians.forEach(musician => {
            if (musician.country && musician.country.trim() !== '') {
                countrySet.add(musician.country.trim());
            }
        });
        this.countries = ['All', ...Array.from(countrySet).sort()];

        // 3. חילוץ שנות כניסה ייחודיות (CreatedAt)
        const yearSet = new Set<number>();
        musicians.forEach(musician => {
            if (musician.createdAt) {
                try {
                    // חילוץ השנה מהמחרוזת (ISO Date)
                    const year = new Date(musician.createdAt).getFullYear();
                    if (!isNaN(year)) {
                        yearSet.add(year);
                    }
                } catch (e) {
                    console.error("Failed to parse createdAt date:", musician.createdAt);
                }
            }
        });
        
        // המרת הקבוצה למערך, מיון והוספת 'All'
        this.createdYears = ['All', ...Array.from(yearSet).sort((a, b) => b - a).map(String)];
    }


    /**
     * מיישם את הסינונים שנבחרו על ידי המשתמש על רשימת המוזיקאים המקורית.
     * יש לקרוא לפונקציה זו בכל פעם שאחד משתני ה-selected משתנה (באמצעות (change) או ngModelChange ב-HTML).
     */
    applyMusicianFilters(): void {
        let filteredList = this.originalMusicianList;

        // 1. סינון לפי עיר
        if (this.selectedCity !== 'All' && this.selectedCity) {
            filteredList = filteredList.filter(musician => 
                musician.city?.trim() === this.selectedCity
            );
        }

        // 2. סינון לפי מדינה
        if (this.selectedCountry !== 'All' && this.selectedCountry) {
            filteredList = filteredList.filter(musician => 
                musician.country?.trim() === this.selectedCountry
            );
        }

        // 3. סינון לפי שנת כניסה (Created Year)
        if (this.selectedCreatedYear !== 'All' && this.selectedCreatedYear) {
            const targetYear = parseInt(this.selectedCreatedYear, 10);
            
            filteredList = filteredList.filter(musician => {
                if (!musician.createdAt) return false;
                
                try {
                    const musicianYear = new Date(musician.createdAt).getFullYear();
                    return musicianYear === targetYear;
                } catch (e) {
                    return false;
                }
            });
        }

         if (this.searchText.trim() !== '') {
    const text = this.searchText.toLowerCase().trim();

    filteredList = filteredList.filter(m => {
      return (
        (m.profile?.name?.toLowerCase().includes(text))
      );
    });
  }

  this.musicianList = filteredList;
        this.musicianList = filteredList;
        // ⭐ חשוב: אם את משתמשת ב-ChangeDetectionStrategy.OnPush, ודאי שהזרקת ChangeDetectorRef
        // וקראת ל-this.cdr.detectChanges();
        // אם לא, ניתן להשאיר את הפונקציה ללא השורה הזו.
        // this.cdr.detectChanges();
    }
}
