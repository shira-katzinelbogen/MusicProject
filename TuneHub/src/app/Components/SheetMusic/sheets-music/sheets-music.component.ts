import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { SheetMusicService } from '../../../Services/sheetmusic.service';
import SheetMusic, { DifficultyLevel, Scale } from '../../../Models/SheetMusic'; // שינוי: ייבאנו גם את ה-Enums
import { FileUtilsService } from '../../../Services/fileutils.service';
import { Router } from '@angular/router';
import { NavigationService } from '../../../Services/navigation.service';
import { MatIconModule } from '@angular/material/icon';
import { UploadSheetMusicService } from '../../../Services/uploadsheetmusic.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sheets-music',
  standalone: true,
  imports: [MatIconModule, FormsModule,CommonModule], 
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sheets-music.component.html',
  styleUrl: './sheets-music.component.css'
})

export class SheetsMusicComponent implements OnInit {

  // משתנים לטיפול בסינון
  originalSheetMusicList: SheetMusic[] = []; 
  sheetMusicList: SheetMusic[] = []; 

  // משתנים לשמירת בחירת הסינון הנוכחית. נשמרים כ-string כפי שמגיע מה-HTML
  selectedInstrument: string = 'All';
  selectedScale: string = 'All';
  selectedLevel: string = 'All';
  selectedCategory: string = 'All';

  // רשימות אפשרויות הסינון (כמחרוזות)
  instruments: string[] = [];
  scales: string[] = [];
  levels: string[] = [];
  categories: string[] = [];
    userRating: number = 0;
  showFilters: boolean = false;

@Input() sheets!: SheetMusic[]; // <--- זה הוסר או הפך למיותר
@Input() isProfileView: boolean = false;
  
  constructor(
    private _sheetMusicService: SheetMusicService,
    public fileUtilsService: FileUtilsService,
    private router: Router,
    public navigationService: NavigationService,
    public uploadSheetMusicService: UploadSheetMusicService,
    private cdr: ChangeDetectorRef,
    private domSanitizer: DomSanitizer
  ) { }

ngOnInit(): void {
        // *** הלוגיקה המתוקנת ***
        
        // אם יש נתונים שהועברו כ-Input, השתמש בהם בלבד ואל תטען את הכל.
        if (this.sheets && this.sheets.length > 0) {
            
            this.originalSheetMusicList = this.sheets;
            this.sheetMusicList = [...this.sheets]; 
            
            // 1. חלץ אפשרויות סינון רק מהתווים של המשתמש הזה
            this.extractFilterOptions(this.originalSheetMusicList); 
            
            this.applyFilters(); // יישום פילטרים ראשוניים
            
        } else if (!this.isProfileView) { 
            // 2. אם לא סופקה רשימה וזה לא תצוגת פרופיל (כלומר, זה דף התווים הכללי): טען את הכל.
            this.loadSheetMusic();
        } 
        // אם זה תצוגת פרופיל והרשימה ריקה (this.sheets.length===0), אנחנו פשוט נשארים עם רשימה ריקה.
    }

  loadSheetMusic(): void {
        this._sheetMusicService.getAllSheetMusics().subscribe({
            next: (data) => {
                this.originalSheetMusicList = data;
                this.sheetMusicList = data; 
                console.log('Sheet Music Loaded:', data[0].name, 'Rating:', data[0].rating);
                // ✅ תיקון: מזמנים את הפונקציה ומעבירים לה את הנתונים מהשרת
                this.extractFilterOptions(data); 

                this.applyFilters(); // יישום פילטרים ראשוניים
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Failed to load sheet music:', err);
            }
        });
    }
  
  /**
   * חילוץ אפשרויות הסינון הייחודיות.
   * הערכים יחולצו כ-string כפי שהם מופיעים בנתוני ה-sheet music.
   */
  extractFilterOptions(sheets: SheetMusic[]): void {
    // 1. חילוץ כלי נגינה ייחודיים (שדה 'name' בתוך מערך Instruments)
    const instrumentSet = new Set<string>();
    sheets.forEach(sheet => {
        sheet.instruments?.forEach(inst => instrumentSet.add(inst.name!)); // שימוש ב-! אחרי name
    });
    this.instruments = ['All', ...Array.from(instrumentSet).sort()];

    // 2. חילוץ סולמות ייחודיים (ערכי ה-Scale המוחזרים כמחרוזות)
    const scaleSet = new Set<string>();
    sheets.forEach(sheet => {
        // המרת ערכי ה-Enum למחרוזות, אם הטיפוס ב-TS עדיין מוגדר כ-Enum
        // אם השרת מחזיר מחרוזת, פשוט נשתמש ב-sheet.scale!
        if (typeof sheet.scale === 'string') {
            scaleSet.add(sheet.scale);
        } else if (sheet.scale !== undefined && sheet.scale !== null) {
            // אם ה-TS מתעקש שזה Enum, נשתמש ב-enum Map כדי לקבל את המחרוזת
             scaleSet.add(Scale[sheet.scale]); 
        }
    });
    this.scales = ['All', ...Array.from(scaleSet).filter(s => s).sort()]; 

    // 3. חילוץ רמות ייחודיות (ערכי ה-DifficultyLevel המוחזרים כמחרוזות)
    const levelSet = new Set<string>();
    sheets.forEach(sheet => {
        // המרת ערכי ה-Enum למחרוזות
        if (typeof sheet.level === 'string') {
            levelSet.add(sheet.level);
        } else if (sheet.level !== undefined && sheet.level !== null) {
            // אם ה-TS מתעקש שזה Enum
            levelSet.add(DifficultyLevel[sheet.level]); 
        }
    });
    this.levels = ['All', ...Array.from(levelSet).filter(s => s).sort()]; // <--- זה חסר!
    const categorySet = new Set<string>();
sheets.forEach(sheet => {
        // בודק אם קיים מערך קטגוריות
        sheet.category?.forEach(category => {
            if (typeof category.name === 'string') {
                categorySet.add(category.name);
            }
        });
    });
    
    this.categories = ['All', ...Array.from(categorySet).filter(c => c).sort()];
    this.cdr.detectChanges();
  }
  
  /**
   * ביצוע הסינון בפועל על הרשימה המקורית.
   */
applyFilters(): void {
    let filteredList = this.originalSheetMusicList;

    // 1. סינון לפי כלי נגינה
    if (this.selectedInstrument !== 'All') {
      filteredList = filteredList.filter(sheet => 
        sheet.instruments?.some(inst => inst.name === this.selectedInstrument) ?? false
      );
    }


   if (this.selectedCategory !== 'All') {
        filteredList = filteredList.filter(sheet => 
            // בודק אם לפחות קטגוריה אחת בגיליון תואמת את הבחירה
            sheet.category?.some(cat => cat.name === this.selectedCategory) ?? false
        );
    }
    
    // 2. סינון לפי סולם
    if (this.selectedScale !== 'All') {
      filteredList = filteredList.filter(sheet => {
        // תיקון: מוודאים ש-sheet.scale קיים, וממירים אותו במפורש ל-string (או נותנים לו גישה בטוחה)
        // שגיאה: sheet.scale === this.selectedScale 
        // תיקון:
        return sheet.scale?.toString() === this.selectedScale;
      });
    }

    // 3. סינון לפי רמה (Level)
    if (this.selectedLevel !== 'All') {
      filteredList = filteredList.filter(sheet => {
        // תיקון: מוודאים ש-sheet.level קיים, וממירים אותו במפורש ל-string (או נותנים לו גישה בטוחה)
        // שגיאה: sheet.level === this.selectedLevel
        // תיקון:
        return sheet.level?.toString() === this.selectedLevel;
      });
    }

    this.sheetMusicList = filteredList;
    this.cdr.detectChanges(); 
  }


  openUploadModal(): void {
    this.uploadSheetMusicService.open();
    this.cdr.detectChanges();
  }
  
  toggleLike(sheet: SheetMusic): void {
    sheet.likes = (sheet.likes ?? 0) + (sheet.isLiked ? -1 : 1);
    sheet.isLiked = !sheet.isLiked;
    console.log(`Toggled Like for sheet ID ${sheet.id}. New status: ${sheet.isLiked}`);
  }

  toggleFavorite(sheet: SheetMusic): void {
    sheet.hearts = (sheet.hearts ?? 0) + (sheet.isFavorite ? -1 : 1);
    sheet.isFavorite = !sheet.isFavorite;
    console.log(`Toggled Favorite for sheet ID ${sheet.id}. New status: ${sheet.isFavorite}`);
  }

  goToSheetMusic(s: SheetMusic) {
    this.router.navigate(['/sheet-music', s.id]);
  }
  
  getSafeMediaUrl(path: string): SafeResourceUrl {
    const url = `http://localhost:8080/api/sheetMusic/documents/${path}`;
    return this.domSanitizer.bypassSecurityTrustResourceUrl(url);
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

// ... (המשך המחלקה SheetsMusicComponent) ...

  // פונקציה חדשה לטיפול בלחיצה על כרטיס הקטגוריה
  selectCategory(category: string): void {
    if (this.selectedCategory === category) {
      // אם לוחצים שוב על הנבחר, לבטל את הסינון (לחזור ל-'All')
      this.selectedCategory = 'All';
    } else {
      this.selectedCategory = category;
    }
    this.applyFilters(); // הפעלת הסינון
  }

  // פונקציות עזר להצגת פרטים ב-HTML החדש
  getCategoryIcon(categoryName: string): string {
    // מפה את שמות הקטגוריות לאייקוני Mat-Icon רלוונטיים
    switch (categoryName) {
      case 'Classical': return 'piano';
      case 'Jazz': return 'music_note';
      case 'Pop': return 'mic';
      case 'Rock': return 'guitar_electric';
      case 'Blues': return 'queue_music';
      case 'Folk': return 'menu_book';
      case 'Original Compositions': return 'star';
      default: return 'album';
    }
  }

  getCategoryColor(categoryName: string): string {
    // מפה את שמות הקטגוריות לצבעי רקע כפי שנראים בתמונה
    switch (categoryName) {
      case 'Classical': return '#007bff'; // כחול בהיר
      case 'Jazz': return '#ffa500';      // כתום
      case 'Pop': return '#ff69b4';        // ורוד
      case 'Rock': return '#ff4500';       // אדום-כתום
      case 'Blues': return '#6a5acd';      // סגול כחלחל
      case 'Folk': return '#3cb371';       // ירוק בינוני
      case 'Original Compositions': return '#9370db'; // סגול לילך
      default: return '#555';
    }
  }

  getCategoryDescription(categoryName: string): string {
    // ספק תיאור קצר לכרטיס
    switch (categoryName) {
      case 'Classical': return 'Classical compositions';
      case 'Jazz': return 'Jazz standards & more';
      case 'Pop': return 'Popular music hits';
      case 'Rock': return 'Rock & alternative';
      case 'Blues': return 'Blues & soul';
      case 'Folk': return 'Folk & traditional';
      case 'Original Compositions': return 'User compositions';
      default: return '';
    }
  }
  
  // פונקציה לחישוב מספר הדפים בקטגוריה ספציפית
  countSheetsByCategory(categoryName: string): number {
    return this.originalSheetMusicList.filter(sheet => {
       
        if (categoryName === 'All') {
            return true; 
        }
        return sheet.category?.some(cat => cat.name === categoryName) ?? false;
        
    }).length;
}


getStarArray(rating: number | undefined): string[] {
    const MAX_STARS = 5;
    const effectiveRating = rating ?? 0;
    const stars: string[] = [];

    for (let i = 1; i <= MAX_STARS; i++) {
        
        if (i <= effectiveRating) {
            stars.push('star');
            
                } else if (effectiveRating > (i - 1)) {
            stars.push('star_half');
            
        } else {
            stars.push('star_border');
        }
    }
    
    return stars;
}
}


