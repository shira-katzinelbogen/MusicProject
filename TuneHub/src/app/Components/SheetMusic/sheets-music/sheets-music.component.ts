import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { SheetMusicService } from '../../../Services/sheetmusic.service';
import SheetMusic, { DifficultyLevel, Scale } from '../../../Models/SheetMusic';
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

@Component({
  selector: 'app-sheets-music',
  standalone: true,
  imports: [MatIconModule, FormsModule, CommonModule, HighlightPipe, UploadSheetMusicComponent], 
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sheets-music.component.html',
  styleUrl: './sheets-music.component.css'
})
export class SheetsMusicComponent implements OnInit {
  private searchSubject = new Subject<string>();
  originalSheetMusicList: SheetMusic[] = [];
  sheetMusicList: SheetMusic[] = [];
  selectedSheet: SheetMusic | null = null;
  pdfUrl!: SafeResourceUrl;
  imageCoverUrl: string = 'assets/images/sheets_music.webp';
  isPdfVisible: boolean = false;  // נשאר, אבל יופעל רק על card ספציפי

  // 🚨 חידוש: משתנה למעקב אחר ה-card הפעיל (לא מודל)
  selectedSheetId: number | null = null;  // ID של ה-sheet שמציג PDF

  selectedInstrument: string = 'All';
  selectedScale: string = 'All';
  selectedLevel: string = 'All';
  showFilters: boolean = false;
  selectedCategory: string = 'All';
  searchText: string = '';

  instruments: string[] = [];
  scales: string[] = [];
  levels: string[] = [];
  categories: string[] = [];
  userRating: number = 0;

  @Input() sheets!: SheetMusic[];
  @Input() isProfileView: boolean = false;

  constructor(
    private _sheetMusicService: SheetMusicService,
    public fileUtilsService: FileUtilsService,
    private router: Router,
    public navigationService: NavigationService,
    public uploadSheetMusicService: UploadSheetMusicService,
    private cdr: ChangeDetectorRef,
    private domSanitizer: DomSanitizer,
    private _interactionService: InteractionService
  ) { }

  ngOnInit(): void {
    if (this.sheets && this.sheets.length > 0) {
      this.originalSheetMusicList = this.sheets;
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
  }

  loadSheetMusic(): void {
    this._sheetMusicService.getAllSheetMusics().subscribe({
      next: (data) => {
        this.originalSheetMusicList = data;
        this.sheetMusicList = data; 
        console.log('Sheet Music Loaded:', data[0].name, 'Rating:', data[0].rating);
        this.extractFilterOptions(data); 
        this.applyFilters(this.originalSheetMusicList); 
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load sheet music:', err);
      }
    });
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
      sheet.category?.forEach(category => {
        if (typeof category.name === 'string') {
          categorySet.add(category.name);
        }
      });
    });
    this.categories = ['All', ...Array.from(categorySet).filter(c => c).sort()];
    this.cdr.detectChanges();
  }

  applyFilters(baseList: SheetMusic[] = this.originalSheetMusicList): void {
    let filteredList = [...baseList]; 

    if (this.selectedInstrument !== 'All') {
      filteredList = filteredList.filter(sheet =>
        sheet.instruments?.some(inst => inst.name === this.selectedInstrument) ?? false
      );
    }

    if (this.selectedScale !== 'All') {
      filteredList = filteredList.filter(sheet => {
        return sheet.scale?.toString() === this.selectedScale;
      });
    }
    if (this.selectedCategory !== 'All') {
      filteredList = filteredList.filter(sheet => 
        sheet.category?.some(cat => cat.name === this.selectedCategory) ?? false
      );
    }

    if (this.selectedLevel !== 'All') {
      filteredList = filteredList.filter(sheet => {
        return sheet.level?.toString() === this.selectedLevel;
      });
    }

    this.sheetMusicList = filteredList; 
    this.cdr.detectChanges(); 
  }

  getImageCoverPath(sheet: SheetMusic) {
    if (sheet.imageCoverName != null) {
      return this.fileUtilsService.getImageUrl(sheet.imageCoverName)
    }
    return 'assets/images/sheets_music.webp'
  }

 openSheet(sheet: SheetMusic) {
  if (sheet.id !== undefined) {  // 🚨 type guard: בדוק אם id קיים
    this.selectedSheetId = sheet.id;  // עכשיו זה number
  } else {
    console.warn('Sheet without ID:', sheet);  // דיבאג אם אין ID
    return;  // אל תפתח אם אין ID
  }
  
  this.isPdfVisible = true;  // הצג PDF
  this.cdr.detectChanges();  // עדכן view
}
  // 🚨 חדש: סגור PDF ב-card
  closePdf(sheetId: number) {
    this.selectedSheetId = null;
    this.isPdfVisible = false;
    this.cdr.detectChanges();
  }

  openUploadModal(): void {
    this.uploadSheetMusicService.open();
    this.cdr.detectChanges();
  }

  toggleLike(sheet: SheetMusic): void {
    if (!sheet.isLiked) {
      this._interactionService.addLike('SHEET_MUSIC', sheet.id!).subscribe({
        next: (res) => {
          sheet.likes = res.count;
          sheet.isLiked = true;
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Failed to add like', err)
      });
    } else {
      this._interactionService.removeLike('SHEET_MUSIC', sheet.id!).subscribe({
        next: (res) => {
          sheet.likes = res.count;
          sheet.isLiked = false;
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Failed to remove like', err)
      });
    }
    console.log('like clicked!', sheet);
  }

  toggleFavorite(sheet: SheetMusic): void {
    if (!sheet.isFavorite) {
      this._interactionService.addFavorite('SHEET_MUSIC', sheet.id!).subscribe({
        next: (res) => {
          sheet.hearts = res.count;
          sheet.isFavorite = true;
          this.cdr.detectChanges();
        }
      });
    } else {
      this._interactionService.removeFavorite('SHEET_MUSIC', sheet.id!).subscribe({
        next: (res) => {
          sheet.hearts = res.count;
          sheet.isFavorite = false;
          this.cdr.detectChanges();
        }
      });
    }
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
      default: return 'album';
    }
  }

  getCategoryColor(categoryName: string): string {
    switch (categoryName) {
      case 'Classical': return '#007bff';
      case 'Jazz': return '#ffa500';
      case 'Pop': return '#ff69b4';
      case 'Rock': return '#ff4500';
      case 'Blues': return '#6a5acd';
      case 'Folk': return '#3cb371';
      case 'Original Compositions': return '#9370db';
      default: return '#555';
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

  onSearchChange(searchText: string): void {
    this.searchText = searchText;
    if (this.searchText.length === 0) {
      console.log('Search text empty. Applying full filters.');
      this.applyFilters(this.originalSheetMusicList); 
      this.cdr.markForCheck(); 
      this.searchSubject.next(''); 
      return;
    }
    this.searchSubject.next(searchText);
  }

  searchSheetMusic(): void {
    if (this.searchText.length === 0) {
      return;
    }
    this._sheetMusicService.getSheetsMusicByTitle(this.searchText).subscribe({
      next: (data) => {
        this.applyFilters(data); 
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('Search failed:', err);
        this.sheetMusicList = [];
        this.cdr.detectChanges();
      }
    });
  }
  downloadPdf(sheet: SheetMusic) {
    if (sheet.filePath) {
      const url = `http://localhost:8080/api/sheetMusic/documents/${sheet.filePath}?download=true`;
      window.open(url, '_blank');  // הורדה בחלון חדש
    }
  }

  // 🚨 חדש: הוסף ל-playlist (כמו בתמונה)
  addToPlaylist(sheet: SheetMusic) {
    console.log('Added to playlist:', sheet.name);  // התאם ל-API שלך
    // קריאה ל-service להוספה
  }
  shareSheet(sheet: SheetMusic) {
    if (navigator.share) {
      navigator.share({
        title: sheet.name,
        text: 'Check out this sheet music!',
        url: window.location.href
      });
    } else {
      // fallback: העתק URL
      navigator.clipboard.writeText(window.location.href);
      alert('URL copied to clipboard!');
    }
  }
}