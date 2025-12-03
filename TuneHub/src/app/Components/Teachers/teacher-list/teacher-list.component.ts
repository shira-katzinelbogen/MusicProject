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
import Instrument from '../../../Models/Instrument';
import { HighlightPipe } from "../../Shared/highlight/highlight.component";


@Component({
  selector: 'app-teacher-list',
  standalone: true,
  imports: [RouterModule, FormsModule, HighlightPipe],
  templateUrl: './teacher-list.component.html',
  styleUrl: './teacher-list.component.css'
})
export class TeacherListComponent implements OnInit {

  public users: Users[] = [];
  public isShowDetails: boolean = false;
  public selectedUser!: Users;
  showFilters: boolean = false;
  public user!: Users; // המשתמש הנוכחי (זה שמחובר)
  public isTeacher: boolean = false; // האם המשתמש הוא כבר MUSIC_LOVER
  public needsProfileUpdate: boolean = false; // האם חסרים פרטי עיר/תיאור
private currentUserId: number | null = null;

    originalTeacherList: Users[] = [];

 searchText: string = '';
// --- 4. משתני סינון חדשים ---
selectedLessonDuration: number | 'All' = 'All';
selectedExperience: number | 'All' = 'All';
selectedInstrumentId: number | 'All' = 'All';
selectedPrice: number | 'All' = 'All';

// --- מערכים להצגת אפשרויות בפילטרים ---
lessonDurations: Array<number | 'All'> = ['All'];
experiences: Array<number | 'All'> = ['All'];
instruments: Array<{id: number | 'All', name: string}> = [];
prices: Array<number | 'All'> = ['All'];

  // --- 1. רשימות נתונים ---
    // הרשימה המקורית המלאה של המוזיקאים (לאחר הטעינה הראשונית). 
    // נשארת מלאה כדי לאפס את הסינון.
    
    // הרשימה המוצגת בפועל על המסך (הרשימה המסוננת).
     TeacherList: Users[] = [];
    
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
    this.loadTeachers();

  // 3. טעינת המשתמש המלא
  this._usersService.getUserById(this.currentUserId).subscribe({
    next: (fullUser) => {
      this.user = fullUser;

      const userTypes: UserType[] = this.user.userTypes || [];
      this.isTeacher = userTypes.includes(UserType.TEACHER); // בדיקה האם המערך מכיל את הטיפוס
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
      this.isTeacher = userTypes.includes(UserType.TEACHER);
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



loadTeachers(): void {
    this._usersService.getUsersByUserType(UserType.TEACHER).subscribe({
      next: (res) => {
        // 1. רשימה כללית (לא ממש בשימוש ב-HTML שלך, אבל לשם שלמות)
console.log(' from server:', res);
    console.log('Raw response:', res);
    res.forEach(u => console.log('Teacher for user', u.id, ':', u.teacher));


        this.users = res;
        
        // 2. הרשימה המקורית לסינון - **זה חיוני!**
        this.originalTeacherList = res; 

        // 3. חילוץ אפשרויות סינון (אם מישהו חדש מגיע מעיר/מדינה חדשה)
        this.extractTeachersFilterOptions(res);
        
        // 4. יישום הסינון (זה מעדכן את this.musicianList שמופיעה ב-HTML)
        this.applyTeacherFilters();

        console.log('נתוני מוזיקאים נטענו ועודכנו. מספר מוזיקאים:', this.users.length);
        console.log("musicians:", this.users);

console.log("CreatedAt values:", res.map(u => u.createdAt));
console.log("CreatedAt values:");


      },
      error: (err) => {
        console.error('שגיאה בהבאת נתוני מוזיקאים:', err);
      }
    });
  }
joinTeacherNetwork(): void {
  if (this.isTeacher) {
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

    this.updateUserTypeToTeacher(idToUse);
  }
}

updateUserTypeToTeacher(userId: number): void {
  if (!userId) {
    console.error("למשתמש אין ID!");
    return;
  }

  if (this.isTeacher) {
    console.log('המשתמש כבר מוגדר fnurv.');
    return;
  }

  if (!this._userStateService.hasRole('ROLE_USER')) {
    console.error('למשתמש אין הרשאות מתאימות לעדכון סוג משתמש.');
    return;
  }

  this._usersService.updateUserType(userId, UserType.TEACHER).subscribe({
    next: () => {
      this.isTeacher = true;
       alert('ברוך הבא לרשת המורים!');
      // עדכן את this.user.userType רק אם this.user קיים
      if (this.user) {
          const userTypes: UserType[] = this.user.userTypes || [];
                    
                    // ודא שהטיפוס TEACHER נוסף לרשימה אם אינו קיים
            if (!userTypes.includes(UserType.TEACHER)) {
                 userTypes.push(UserType.TEACHER);
            }
                    // נדרש ליצור מערך חדש אם משתמשים ב-OnPush
            this.user.userTypes = [...userTypes]; 
      }

      this.loadTeachers();
    },
    error: (err) => {
      console.error('שגיאה בעדכון סוג המשתמש:', err);
      alert('שגיאה בעדכון הפרופיל. נסה שוב מאוחר יותר.');
    }
  });
}

// searchSheetMusic(): void {
//   if (!this.searchText) {
//     this.originalTeacherList = [...this.TeacherList];
//     this.applyFilters();
//     return;
//   }

//   // סינון מקומי בלבד
//   this.originalTeacherList = this.TeacherList.filter(teacher =>
//     teacher.name!.toLowerCase().includes(this.searchText.toLowerCase())
//   );

//   this.applyFilters();
//   this.cdr.markForCheck();
// }


  // פונקציה להחלפת המצב (toggle) בלחיצה על כפתור הפילטרים
  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  /**
     * מחלץ את האפשרויות הייחודיות של עיר, מדינה ושנת כניסה מתוך רשימת המוזיקאים.
     * יש לקרוא לפונקציה זו פעם אחת, לאחר טעינת originalMusicianList מהשרת.
     */
    extractTeachersFilterOptions(teachers: Users[]): void {
        // 1. חילוץ ערים ייחודיות
        
        const citySet = new Set<string>();
        teachers.forEach(teachers => {
            if (teachers.city && teachers.city.trim() !== '') {
                citySet.add(teachers.city.trim());
            }
        });
        this.cities = ['All', ...Array.from(citySet).sort()];
          console.log("musicians:", this.TeacherList);

        // 2. חילוץ מדינות ייחודיות
        const countrySet = new Set<string>();
        teachers.forEach(teachers => {
            if (teachers.country && teachers.country.trim() !== '') {
                countrySet.add(teachers.country.trim());
            }
        });
        this.countries = ['All', ...Array.from(countrySet).sort()];

                            // 4. משך שיעור ייחודי
        const durationSet = new Set<number>();
        teachers.forEach(u => {
            if (u.teacher?.lessonDuration) durationSet.add(u.teacher.lessonDuration);
        });
        this.lessonDurations = ['All', ...Array.from(durationSet).sort((a,b)=>a-b)];

// 5. ניסיון ייחודי
        const experienceSet = new Set<number>();
        teachers.forEach(u => {
            if (u.teacher?.experience) experienceSet.add(u.teacher.experience);
        });
        this.experiences = ['All', ...Array.from(experienceSet).sort((a,b)=>b-a)];

// 6. מחיר לשיעור ייחודי
        const priceSet = new Set<number>();
        teachers.forEach(u => {
            if (u.teacher?.pricePerLesson) priceSet.add(u.teacher.pricePerLesson);
        });
        this.prices = ['All', ...Array.from(priceSet).sort((a,b)=>a-b)];

// 7. כלי נגינה ייחודיים
        const instrumentMap = new Map<number, string>();
        teachers.forEach(u => {
            if (u.teacher?.instrumentsIds) {
                u.teacher.instrumentsIds.forEach(id => {
                    if (!instrumentMap.has(id)) {
                        instrumentMap.set(id, `Instrument ${id}`);
                    }
                });
           }
        });
        this.instruments = Array.from(instrumentMap.entries()).map(([id, name]) => ({id, name}));

        // 3. חילוץ שנות כניסה ייחודיות (CreatedAt)
        const yearSet = new Set<number>();
        teachers.forEach(teachers => {
            if (teachers.createdAt) {
                try {
                    // חילוץ השנה מהמחרוזת (ISO Date)
                    const year = new Date(teachers.createdAt).getFullYear();
                    if (!isNaN(year)) {
                        yearSet.add(year);
                    }
                } catch (e) {
                    console.error("Failed to parse createdAt date:", teachers.createdAt);
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
    applyTeacherFilters(): void {
        let filteredList = this.originalTeacherList;

        // 1. סינון לפי עיר
        if (this.selectedCity !== 'All' && this.selectedCity) {
            filteredList = filteredList.filter(teacher => 
                teacher.city?.trim() === this.selectedCity
            );
        }

        // 2. סינון לפי מדינה
        if (this.selectedCountry !== 'All' && this.selectedCountry) {
            filteredList = filteredList.filter(teacher => 
                teacher.country?.trim() === this.selectedCountry
            );
        }

        // סינון לפי משך שיעור
        if (this.selectedLessonDuration !== 'All') {
        // המרה למספר: אם זה מחרוזת, הופך למספר. אם זה מספר, נשאר מספר.
        const targetDuration = Number(this.selectedLessonDuration); 
        
        filteredList = filteredList.filter(u => u.teacher?.lessonDuration === targetDuration);
    }
if (this.selectedExperience !== 'All') {
        const targetExperience = Number(this.selectedExperience);
        filteredList = filteredList.filter(u => u.teacher?.experience === targetExperience);
    }

// סינון לפי מחיר לשיעור
        if (this.selectedPrice !== 'All') {
        const targetPrice = Number(this.selectedPrice);
        filteredList = filteredList.filter(u => u.teacher?.pricePerLesson === targetPrice);
    }

// סינון לפי כלי נגינה
       if (this.selectedInstrumentId !== 'All') {
        const targetId = Number(this.selectedInstrumentId); 
        
        // הלוגיקה פה נראית תקינה - בדיקה אם רשימת ה-IDs של המורה כוללת את ה-ID שנבחר
        filteredList = filteredList.filter(u => u.teacher?.instrumentsIds?.includes(targetId));
    }

        // 3. סינון לפי שנת כניסה (Created Year)
        if (this.selectedCreatedYear !== 'All' && this.selectedCreatedYear) {
            const targetYear = parseInt(this.selectedCreatedYear, 10);
            
            filteredList = filteredList.filter(teacher => {
                if (!teacher.createdAt) return false;
                
                try {
                    const musicianYear = new Date(teacher.createdAt).getFullYear();
                    return musicianYear === targetYear;
                } catch (e) {
                    return false;
                }
            });
        }

        this.TeacherList = filteredList;
        // ⭐ חשוב: אם את משתמשת ב-ChangeDetectionStrategy.OnPush, ודאי שהזרקת ChangeDetectorRef
        // וקראת ל-this.cdr.detectChanges();
        // אם לא, ניתן להשאיר את הפונקציה ללא השורה הזו.
        // this.cdr.detectChanges();
    }



updateTeacherList(): void {
  let filtered = [...this.originalTeacherList];

  // --- סינון עיר ---
  if (this.selectedCity && this.selectedCity !== 'All') {
    filtered = filtered.filter(t => t.city === this.selectedCity);
  }

  // --- סינון מדינה ---
  if (this.selectedCountry && this.selectedCountry !== 'All') {
    filtered = filtered.filter(t => t.country === this.selectedCountry);
  }

  // --- סינון משך שיעור ---
  if (this.selectedLessonDuration !== 'All') {
    filtered = filtered.filter(t => t.teacher?.lessonDuration === Number(this.selectedLessonDuration));
  }

  // --- סינון ניסיון ---
  if (this.selectedExperience !== 'All') {
    filtered = filtered.filter(t => t.teacher?.experience === Number(this.selectedExperience));
  }

  // --- סינון מחיר שיעור ---
  if (this.selectedPrice !== 'All') {
    filtered = filtered.filter(t => t.teacher?.pricePerLesson === Number(this.selectedPrice));
  }

  // --- סינון כלי נגינה ---
  if (this.selectedInstrumentId !== 'All') {
    const instrumentId = Number(this.selectedInstrumentId);
    filtered = filtered.filter(t => t.teacher?.instrumentsIds?.includes(instrumentId));
  }

  // --- סינון לפי שנת יצירה ---
  if (this.selectedCreatedYear !== 'All') {
    const year = Number(this.selectedCreatedYear);
    filtered = filtered.filter(t => new Date(t.createdAt!).getFullYear() === year);
  }

  // --- חיפוש רק לפי name (אחרי כל המסננים!) ---
  if (this.searchText && this.searchText.trim() !== '') {
    const txt = this.searchText.toLowerCase();
    filtered = filtered.filter(t =>
      t.profile!.name!.toLowerCase().includes(txt)   //  👈 רק טקסט בשם!
    );
  }

  this.TeacherList = filtered;
}
}