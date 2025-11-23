import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { SheetMusicService } from '../../../Services/sheetmusic.service';
import SheetMusic, { DifficultyLevel, Scale } from '../../../Models/SheetMusic'; // שינוי: ייבאנו גם את ה-Enums
import { FileUtilsService } from '../../../Services/fileutils.service';
import { Router } from '@angular/router';
import { NavigationService } from '../../../Services/navigation.service';
import { MatIconModule } from '@angular/material/icon';
import { UploadSheetMusicService } from '../../../Services/uploadsheetmusic.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { UploadSheetMusicComponent } from "../upload-sheet-music/upload-sheet-music.component";
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-sheets-music',
  standalone: true,
  imports: [MatIconModule, UploadSheetMusicComponent,FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush, // ⬅️ הוסף את זה
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

  // רשימות אפשרויות הסינון (כמחרוזות)
  instruments: string[] = [];
  scales: string[] = [];
  levels: string[] = [];

  showFilters: boolean = false;

@Input() sheets!: SheetMusic[]; // <--- זה הוסר או הפך למיותר
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
        if (this.sheets && this.sheets.length > 0) {
            // 1. אם רשימה סופקה (מהאב):
            this.originalSheetMusicList = this.sheets;
            this.sheetMusicList = [...this.sheets]; 
            
            // ✅ תיקון: מזמנים את הפונקציה ומעבירים לה את רשימת המקור
            this.extractFilterOptions(this.originalSheetMusicList); 
            
            this.applyFilters(); // יישום פילטרים ראשוניים
        } else {
            // 2. אם לא סופקה רשימה:
            this.loadSheetMusic();
            // הערה: applyFilters() ו-extractFilterOptions() יופעלו 
            // בתוך פונקציית loadSheetMusic לאחר קבלת הנתונים.
        }
    }

  loadSheetMusic(): void {
        this._sheetMusicService.getAllSheetMusics().subscribe({
            next: (data) => {
                this.originalSheetMusicList = data;
                this.sheetMusicList = data; 

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
    this.levels = ['All', ...Array.from(levelSet).filter(l => l).sort()]; 
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


  

  getImageCoverPath(sheet: SheetMusic) {
    if(sheet.imageCoverName != null){
      return this.fileUtilsService.getImageUrl(sheet.imageCoverName)
    }
    
      return 'assets/images/sheets_music.webp'
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
}