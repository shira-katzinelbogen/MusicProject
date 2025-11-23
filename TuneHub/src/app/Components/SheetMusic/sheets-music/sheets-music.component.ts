


import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SheetMusicService } from '../../../Services/sheetmusic.service';
import SheetMusic from '../../../Models/SheetMusic';
import { FileUtilsService } from '../../../Services/fileutils.service';
import { Router } from '@angular/router';
import { NavigationService } from '../../../Services/navigation.service';
import { MatIconModule } from '@angular/material/icon';
import { UploadSheetMusicService } from '../../../Services/uploadsheetmusic.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { UploadSheetMusicComponent } from "../upload-sheet-music/upload-sheet-music.component";


@Component({
  selector: 'app-sheets-music',
  standalone: true,
  imports: [MatIconModule, UploadSheetMusicComponent],
  changeDetection: ChangeDetectionStrategy.OnPush, // ⬅️ הוסף את זה
  templateUrl: './sheets-music.component.html',
  styleUrl: './sheets-music.component.css'
})

export class SheetsMusicComponent implements OnInit {

  sheetMusicList: SheetMusic[] = [];

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
    this.loadSheetMusic();
  }

  loadSheetMusic(): void {
    this._sheetMusicService.getAllSheetMusics().subscribe({
      next: (data) => {
        console.log('SHEET DATA RECEIVED → ', data);
        this.sheetMusicList = data;
      },

      error: (err) => {
        console.error('Failed to load sheet music:', err);
      }
    });
  }

  openUploadModal(): void {
    this.uploadSheetMusicService.open();

    // כפה על אנגולר לבדוק שינויים לאחר שינוי המשתנה
    this.cdr.detectChanges(); // ⬅️ זה אמור לפתור את הבעיה
  }
  /**
   * מטפל בלחיצה על אייקון הלב (Like).
   * משנה את הסטטוס ומעדכן את המונה ב-UI.
   */
  toggleLike(sheet: SheetMusic): void {
    // עדכון המונה באופן מיידי ב-UI
    sheet.likes! += sheet.isLiked ? -1 : 1;
    sheet.isLiked = !sheet.isLiked;

    // TODO: שלח קריאת API ל-SheetMusicService כדי לעדכן את ה-Like ב-DB
    console.log(`Toggled Like for sheet ID ${sheet.id}. New status: ${sheet.isLiked}`);
  }

  /**
   * מטפל בלחיצה על אייקון הכוכב (Favorite).
   * משנה את הסטטוס ומעדכן את המונה ב-UI.
   */
  toggleFavorite(sheet: SheetMusic): void {
    // עדכון המונה באופן מיידי ב-UI
    sheet.hearts! += sheet.isFavorite ? -1 : 1;
    sheet.isFavorite = !sheet.isFavorite;

    // TODO: שלח קריאת API ל-SheetMusicService כדי לעדכן את ה-Favorite ב-DB
    console.log(`Toggled Favorite for sheet ID ${sheet.id}. New status: ${sheet.isFavorite}`);
  }

  goToSheetMusic(s: SheetMusic) {

    this.router.navigate(['/sheet-music', s.id]);

  }
  getSafeMediaUrl(path: string): SafeResourceUrl {
    const url = `http://localhost:8080/api/sheetMusic/documents/${path}`;
    return this.domSanitizer.bypassSecurityTrustResourceUrl(url);


  }

  getImageCoverPath(sheet: SheetMusic) {
    if(sheet.imageCoverName != null){
      return this.fileUtilsService.getImageUrl(sheet.imageCoverName)
    }
    
      return 'assets/images/sheets_music.webp'
  }

}