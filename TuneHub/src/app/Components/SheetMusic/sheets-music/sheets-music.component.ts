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
import { InteractionService } from '../../../Services/interaction.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HighlightPipe } from '../../Shared/highlight/highlight.component';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { MusicCardComponent } from "../music-card/music-card.component";


@Component({
  selector: 'app-sheets-music',
  standalone: true,
  imports: [MatIconModule, FormsModule, CommonModule, UploadSheetMusicComponent, MusicCardComponent, HighlightPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sheets-music.component.html',
  styleUrl: './sheets-music.component.css'

})

export class SheetsMusicComponent implements OnInit {
  private searchSubject = new Subject<string>();
  originalSheetMusicList: SheetMusic[] = [];
  sheetMusicList: SheetMusic[] = [];
  selectedInstrument: string = 'All';
  selectedScale: string = 'All';
  selectedLevel: string = 'All';
  showFilters: boolean = false;
  selectedCategory: string = 'All';
  instruments: string[] = [];
  scales: string[] = [];
  levels: string[] = [];
  searchText: string = '';
  categories: string[] = [];
  userRating: number = 0;

  categorySearchText: string = '';
filteredCategories: string[] = [];


  @Input() sheets!: SheetMusic[];
  @Input() isProfileView: boolean = false;
document: any;

  constructor(
    private _sheetMusicService: SheetMusicService,
    public fileUtilsService: FileUtilsService,
    public navigationService: NavigationService,
    public uploadSheetMusicService: UploadSheetMusicService,
    private cdr: ChangeDetectorRef,
    private domSanitizer: DomSanitizer,
  ) { }


  allSheetMusicList: SheetMusic[] = []; 

  ngOnInit(): void {
    if (this.sheets && this.sheets.length > 0) {
      this.allSheetMusicList = this.sheets;
      this.originalSheetMusicList = [...this.sheets];
      this.sheetMusicList = [...this.sheets];
      this.extractFilterOptions(this.originalSheetMusicList);
      this.applyFilters();
    } else if (!this.isProfileView) {
      this.loadSheetMusic();
    }

    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.searchSheetMusic();
    });

    this.filteredCategories = [...this.categories];

  }

  loadSheetMusic(): void {
    this._sheetMusicService.getAllSheetMusics().subscribe({
      next: (data) => {
        this.allSheetMusicList = data;
        this.originalSheetMusicList = [...data];
        this.sheetMusicList = [...data];
        this.extractFilterOptions(data);
        this.applyFilters();
        this.cdr.detectChanges();
      }
    });
  }


  searchSheetMusic(): void {
    if (!this.searchText) {
      this.originalSheetMusicList = [...this.allSheetMusicList];
      this.applyFilters();
      return;
    }

    this.originalSheetMusicList = this.allSheetMusicList.filter(sheet =>
      sheet.title!.toLowerCase().includes(this.searchText.toLowerCase())
    );

    this.applyFilters();
    this.cdr.markForCheck();
  }

  extractFilterOptions(sheets: SheetMusic[]): void {
    const instrumentSet = new Set<string>();
    sheets.forEach(sheet => {
      sheet.instruments?.forEach(inst => instrumentSet.add(inst.name!)); 
    });
    this.instruments = ['All', ...Array.from(instrumentSet).sort()];

    const scaleSet = new Set<string>();
    sheets.forEach(sheet => {
      if (typeof sheet.scale === 'string') {
        scaleSet.add(sheet.scale);
      } else if (sheet.scale !== undefined && sheet.scale !== null) {
        scaleSet.add(Scale[sheet.scale]);
      }
    });
    this.scales = ['All', ...Array.from(scaleSet).filter(s => s).sort()];

    const levelSet = new Set<string>();
    sheets.forEach(sheet => {
      if (typeof sheet.level === 'string') {
        levelSet.add(sheet.level);
      } else if (sheet.level !== undefined && sheet.level !== null) {
        levelSet.add(DifficultyLevel[sheet.level]);
      }
    });
    this.levels = ['All', ...Array.from(levelSet).filter(l => l).sort()];

    const categorySet = new Set<string>();
    sheets.forEach(sheet => {
      sheet.categories?.forEach(category => {
        if (typeof category.name === 'string') {
          categorySet.add(category.name);
        }
      });
    });
    this.categories = ['All', ...Array.from(categorySet).filter(c => c).sort()];

    this.selectedCategory = 'All';
      this.filteredCategories = [...this.categories];

    this.cdr.detectChanges();
  }


  applyFilters(baseList: SheetMusic[] = this.originalSheetMusicList): void {
    let filteredList = [...baseList];

    if (this.selectedInstrument !== 'All') {
      filteredList = filteredList.filter(sheet =>
        sheet.instruments?.some(inst => inst.name === this.selectedInstrument)
      );
    }

    if (this.selectedScale !== 'All') {
      filteredList = filteredList.filter(sheet =>
        sheet.scale?.toString() === this.selectedScale
      );
    }

    if (this.selectedLevel !== 'All') {
      filteredList = filteredList.filter(sheet =>
        sheet.level?.toString() === this.selectedLevel
      );
    }

    if (this.selectedCategory !== 'All') {
      filteredList = filteredList.filter(sheet =>
        sheet.categories?.some(cat => cat.name === this.selectedCategory)
      );
    }

    this.sheetMusicList = [...filteredList];
    this.cdr.markForCheck();
  }


  openUploadModal(): void {
    this.uploadSheetMusicService.open();
    this.cdr.detectChanges();
  }


  getSafeMediaUrl(path: string): SafeResourceUrl {
    const url = `http://localhost:8080/api/sheetMusic/documents/${path}`;
    return this.domSanitizer.bypassSecurityTrustResourceUrl(url);
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  selectCategory(category: string): void {
    if (this.selectedCategory === category) {
      this.selectedCategory = 'All';
    } else {
      this.selectedCategory = category;
    }
    this.applyFilters(); 
  }

  getCategoryIcon(categoryName: string): string {
    switch (categoryName) {
      case 'Classical': return 'piano';
      case 'Jazz': return 'music_note';
      case 'Pop': return 'mic';
      case 'Rock': return 'guitar_electric';
      case 'Blues': return 'queue_music';
      case 'Folk': return 'menu_book';
      case 'Original Compositions': return 'star';
      default: return 'folder';
    }
  }

  getCategoryColor(categoryName: string): string {
    switch (categoryName) {
      case 'Classical': return '#007bff'; 
      case 'Pop': return '#ff69b4';  
         case 'Jazz': return '#007065ff';      
      case 'Rock': return '#ff4500';       
      case 'Blues': return '#6a5acd';      
      case 'Folk': return '#3cb371';       
      case 'Original Compositions': return '#9370db'; 
      default: return '#B8860B';
    }
  }

  getCategoryDescription(categoryName: string): string {
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

  countSheetsByCategory(categoryName: string): number {
    return this.originalSheetMusicList.filter(sheet => {

      if (categoryName === 'All') {
        return true;
      }
      return sheet.categories?.some(cat => cat.name === categoryName) ?? false;

    }).length;

  }


  onSearchChange(searchText: string): void {
    this.searchText = searchText.trim();

    if (!this.searchText) {
      this.originalSheetMusicList = [...this.allSheetMusicList];
      this.applyFilters();  
      return;
    }

    this.searchSubject.next(this.searchText);
  }
















filterCategories(): void {
  if (!this.categorySearchText.trim()) {
    this.filteredCategories = [...this.categories];
    return;
  }

  const search = this.categorySearchText.toLowerCase();

  this.filteredCategories = this.categories.filter(cat =>
    cat.toLowerCase().includes(search)
  );
}



}





















// import {
//   ChangeDetectionStrategy,
//   ChangeDetectorRef,
//   Component,
//   Input,
//   OnInit
// } from '@angular/core';

// import { SheetMusicService } from '../../../Services/sheetmusic.service';
// import SheetMusic, { DifficultyLevel, Scale } from '../../../Models/SheetMusic';
// import { FileUtilsService } from '../../../Services/fileutils.service';
// import { NavigationService } from '../../../Services/navigation.service';
// import { UploadSheetMusicService } from '../../../Services/uploadsheetmusic.service';
// import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
// import { InteractionService } from '../../../Services/interaction.service';

// import { MatIconModule } from '@angular/material/icon';
// import { FormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { UploadSheetMusicComponent } from "../upload-sheet-music/upload-sheet-music.component";
// import { MusicCardComponent } from "../music-card/music-card.component";

// import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

// @Component({
//   selector: 'app-sheets-music',
//   standalone: true,
//   imports: [
//     MatIconModule,
//     FormsModule,
//     CommonModule,
//     UploadSheetMusicComponent,
//     MusicCardComponent
//   ],
//   changeDetection: ChangeDetectionStrategy.OnPush,
//   templateUrl: './sheets-music.component.html',
//   styleUrl: './sheets-music.component.css'
// })
// export class SheetsMusicComponent implements OnInit {

//   /** ---------------------------------------------------------
//    *  רשימות עבודה
//    *  allSheetMusicList  – הכל מהשרת
//    *  originalSheetMusicList – אחרי "חיפוש בלבד"
//    *  sheetMusicList – אחרי חיפוש + פילטרים
//    * ---------------------------------------------------------- */


//   originalSheetMusicList: SheetMusic[] = [];


//   allSheetMusicList: SheetMusic[] = [];      // כל הנתונים מהשרת
// searchResultList: SheetMusic[] = [];       // תוצאות חיפוש בלבד
// sheetMusicList: SheetMusic[] = [];         // אחרי חיפוש + פילטרים


//   /** ערכי סינון */
//   selectedInstrument: string = 'All';
//   selectedScale: string = 'All';
//   selectedLevel: string = 'All';
//   selectedCategory: string = 'All';
//   searchText: string = '';
//   showFilters: boolean = false;

//   /** אפשרויות */
//   instruments: string[] = [];
//   scales: string[] = [];
//   levels: string[] = [];
//   categories: string[] = [];

//   /** חיפוש עם דיבאונס */
//   private searchSubject = new Subject<string>();

//   @Input() sheets!: SheetMusic[];
//   @Input() isProfileView: boolean = false;

//   constructor(
//     private _sheetMusicService: SheetMusicService,
//     public fileUtilsService: FileUtilsService,
//     public navigationService: NavigationService,
//     public uploadSheetMusicService: UploadSheetMusicService,
//     private cdr: ChangeDetectorRef,
//     private domSanitizer: DomSanitizer,
//     private _interactionService: InteractionService
//   ) {}

//   /** ----------------------------------------------------------
//    *  INIT
//    * ---------------------------------------------------------- */
//   ngOnInit(): void {

//     // אם הקומפוננטה משמשת כ־@Input (למשל בפרופיל)
//     if (this.sheets?.length > 0) {
//       this.allSheetMusicList = [...this.sheets];
//       this.originalSheetMusicList = [...this.sheets];
//       this.sheetMusicList = [...this.sheets];
//       this.extractFilterOptions(this.originalSheetMusicList);
//       this.applyFilters();
//     }

//     // טעינה רגילה מהשרת
//     else if (!this.isProfileView) {
//       this.loadSheetMusic();
//     }

//     // דיבאונס לחיפוש
//     this.searchSubject
//       .pipe(debounceTime(300), distinctUntilChanged())
//       .subscribe(() => this.searchSheetMusic());
//   }

//   /** ----------------------------------------------------------
//    *  טעינת כל הנתונים מהשרת
//    * ---------------------------------------------------------- */
// loadSheetMusic(): void {
//   this._sheetMusicService.getAllSheetMusics().subscribe({
//     next: (data) => {
//       this.allSheetMusicList = [...data];
//       this.searchResultList = [...data];   // חשוב!
//       this.extractFilterOptions(data);
//       this.applyFilters();
//       this.cdr.markForCheck();
//     }
//   });
// }


//   /** ----------------------------------------------------------
//    *  שינוי טקסט החיפוש (OnInput)
//    * ---------------------------------------------------------- */
// onSearchChange(text: string): void {
//   this.searchText = text.trim();

//   if (!this.searchText) {
//     this.searchResultList = [...this.allSheetMusicList];
//     this.applyFilters();
//     return;
//   }

//   this.searchSubject.next(this.searchText);
// }

//   /** ----------------------------------------------------------
//    *  קריאת שרת לפי טקסט חיפוש בלבד
//    * ---------------------------------------------------------- */
//   searchSheetMusic(): void {
//   this._sheetMusicService.getSheetsMusicByTitle(this.searchText).subscribe({
//     next: (data) => {
//       this.searchResultList = [...data];
//       this.applyFilters();
//       this.cdr.markForCheck();
//     },
//     error: () => {
//       this.searchResultList = [];
//       this.sheetMusicList = [];
//       this.cdr.markForCheck();
//     }
//   });
// }


//   /** ----------------------------------------------------------
//    *  סינון משולב (עובד על הרשימה המגיע מחיפוש בלבד)
//    * ---------------------------------------------------------- */
//   applyFilters(): void {
//   let list = [...this.searchResultList]; // 👈 תמיד מסננים רק אחרי החיפוש!

//   if (this.selectedInstrument !== 'All') {
//     list = list.filter(s =>
//       s.instruments?.some(i => i.name === this.selectedInstrument)
//     );
//   }

//   if (this.selectedScale !== 'All') {
//     list = list.filter(s => s.scale?.toString() === this.selectedScale);
//   }

//   if (this.selectedLevel !== 'All') {
//     list = list.filter(s => s.level?.toString() === this.selectedLevel);
//   }

//   if (this.selectedCategory !== 'All') {
//     list = list.filter(s =>
//       s.categories?.some(c => c.name === this.selectedCategory)
//     );
//   }

//   this.sheetMusicList = [...list];
//   this.cdr.markForCheck();
// }

//   /** ----------------------------------------------------------
//    *  חילוץ אפשרויות (כלים, סולם, רמה, קטגוריות)
//    * ---------------------------------------------------------- */
//   extractFilterOptions(sheets: SheetMusic[]): void {

//     const instrumentSet = new Set<string>();
//     const scaleSet = new Set<string>();
//     const levelSet = new Set<string>();
//     const categorySet = new Set<string>();

//     sheets.forEach(sheet => {

//       sheet.instruments?.forEach(i => instrumentSet.add(i.name!));

//       if (sheet.scale) scaleSet.add(sheet.scale.toString());
//       if (sheet.level) levelSet.add(sheet.level.toString());

//       sheet.categories?.forEach(c => categorySet.add(c.name));
//     });

//     this.instruments = ['All', ...Array.from(instrumentSet)];
//     this.scales = ['All', ...Array.from(scaleSet)];
//     this.levels = ['All', ...Array.from(levelSet)];
//     this.categories = ['All', ...Array.from(categorySet)];

//     this.cdr.markForCheck();
//   }

//   /** ----------------------------------------------------------
//    *  קטגוריות
//    * ---------------------------------------------------------- */
//   selectCategory(category: string): void {
//     this.selectedCategory = category === this.selectedCategory ? 'All' : category;
//     this.applyFilters();
//   }

//   countSheetsByCategory(name: string): number {
//     if (name === 'All') return this.originalSheetMusicList.length;
//     return this.originalSheetMusicList.filter(s =>
//       s.categories?.some(c => c.name === name)
//     ).length;
//   }

//   /** ----------------------------------------------------------
//    *  UI
//    * ---------------------------------------------------------- */
//   toggleFilters(): void {
//     this.showFilters = !this.showFilters;
//   }

//   openUploadModal(): void {
//     this.uploadSheetMusicService.open();
//     this.cdr.markForCheck();
//   }

//   getSafeMediaUrl(path: string): SafeResourceUrl {
//     return this.domSanitizer.bypassSecurityTrustResourceUrl(
//       `http://localhost:8080/api/sheetMusic/documents/${path}`
//     );
//   }

//   /** ----------------------------------------------------------
//    *  עזר ל־HTML (אייקונים / צבעים)
//    * ---------------------------------------------------------- */

//   getCategoryIcon(cat: string): string {
//     switch (cat) {
//       case 'Classical': return 'piano';
//       case 'Jazz': return 'music_note';
//       case 'Pop': return 'mic';
//       case 'Rock': return 'guitar_electric';
//       case 'Blues': return 'queue_music';
//       default: return 'album';
//     }
//   }

//   getCategoryColor(cat: string): string {
//     switch (cat) {
//       case 'Classical': return '#007bff';
//       case 'Jazz': return '#ffa500';
//       case 'Pop': return '#ff69b4';
//       case 'Rock': return '#ff4500';
//       case 'Blues': return '#6a5acd';
//       default: return '#555';
//     }
//   }

//   getCategoryDescription(cat: string): string {
//     switch (cat) {
//       case 'Classical': return 'Classical compositions';
//       case 'Jazz': return 'Jazz music';
//       case 'Pop': return 'Popular songs';
//       case 'Rock': return 'Rock and alternative';
//       case 'Blues': return 'Blues & soul';
//       default: return '';
//     }
//   }
// }
