// sheet-music.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SheetMusicService } from '../../../Services/sheetmusic.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common'; // ⭐️ ודא שזה מיובא
import SheetMusic from '../../../Models/SheetMusic';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { InteractionService } from '../../../Services/interaction.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-sheet-music',
  templateUrl: './sheet-music.component.html',
  standalone: true,
  imports: [
        MatIconModule,
        CommonModule,
        FormsModule
        // RouterLink
    ],
  styleUrls: ['./sheet-music.component.css']
})
export class SheetMusicComponent implements OnInit {
  sheet!: SheetMusic;
  pdfUrl!: SafeResourceUrl;
  imageCoverUrl: string = 'assets/images/sheets_music.webp';
  
  constructor(
    private route: ActivatedRoute,
    private sheetService: SheetMusicService, 
    private cdr: ChangeDetectorRef,
    private domSanitizer: DomSanitizer
  ) {}
ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
        const sheetIdString = params.get('id'); 
        
        if (sheetIdString) {
            
            const sheetIdNumber = Number(sheetIdString); 
            
            this.sheetService.getSheetMusicById(sheetIdNumber).subscribe({
                next: (data: SheetMusic) => {
                    this.loadSheetDetails(data); 
                    this.cdr.detectChanges(); 
                },
                error: (err) => {
                    console.error('Error loading sheet music details', err);
                }
            });
        }
    });
}

  loadSheetDetails(sheetData: SheetMusic): void {
    this.sheet = sheetData;
    // אם יש נתיב קובץ (filePath), צור את ה-URL הבטוח
    if (this.sheet.filePath) {
      this.pdfUrl = this.getSafePdfUrl(this.sheet.filePath);
    }
    // אם יש תמונת קאבר, עדכן אותה
    if (this.sheet.imageCoverName) {
      // **הערה:** הנחתי שיש לך שירות FileUtilsService או פונקציה המטפלת ב-URLs של תמונות
      // אם לא, השתמש בנתיב המלא ישירות:
      // this.imageCoverUrl = `http://localhost:8080/api/files/${this.sheet.imageCoverName}`; 
    }
  }

  // הפונקציה getSafePdfUrl נשארת כפי שהיא, היא תקינה:
  getSafePdfUrl(path: string): SafeResourceUrl {
    const url = `http://localhost:8080/api/sheetMusic/documents/${path}`;
    return this.domSanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
