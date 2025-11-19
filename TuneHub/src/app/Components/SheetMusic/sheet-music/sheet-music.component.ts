// sheet-music.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SheetMusicService } from '../../../Services/sheetmusic.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common'; // ⭐️ ודא שזה מיובא
import SheetMusic from '../../../Models/SheetMusic';

@Component({
  selector: 'app-sheet-music',
  templateUrl: './sheet-music.component.html',
  imports: [
        
        CommonModule // ⬅️ חובה לכלול CommonModule כדי להשתמש ב-*ngIf ו-*ngFor
    ],
  styleUrls: ['./sheet-music.component.css']
})
export class SheetMusicComponent implements OnInit {
  sheet!: SheetMusic;
  pdfUrl!: SafeResourceUrl;

  constructor(
    private route: ActivatedRoute,
    private sheetService: SheetMusicService,
    private sanitizer: DomSanitizer
    
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.sheetService.getSheetMusicById(+id).subscribe({
        next: (data) => {
          this.sheet = data;
          if (this.sheet.filePath) {
            this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
              `http://localhost:8080/api/sheetMusic/documents/${this.sheet.filePath}`
            );
          }
        },
        error: (err) => console.error(err)
      });
    }
  }
}
