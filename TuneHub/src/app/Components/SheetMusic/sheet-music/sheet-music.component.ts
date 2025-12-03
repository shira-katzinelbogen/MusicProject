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
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
    
  ) {}

  ngOnInit(): void {
    // const id = this.route.snapshot.paramMap.get('id');
    // if (id) {
    //   this.sheetService.getSheetMusicById(+id).subscribe({
    //     next: (data) => {
    //       this.sheet = data;
    //       // if (this.sheet.imageCoverName) {
    //       //   // בהנחה ש-fileUtilsService נמצא בהישג יד או שמחליפים אותו בבנייה ידנית של ה-URL
    //       //   // נשתמש בנתיב הישיר בהנחה שהשרת מכיל אותו
    //       //   this.imageCoverUrl = `http://localhost:8080/api/files/image/${this.sheet.imageCoverName}`;
    //       // }
    //       // if (this.sheet.filePath) {
    //       //   this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
    //       //     `http://localhost:8080/api/sheetMusic/documents/${this.sheet.filePath}`
    //       //   );
    //       // }
    //     },
    //     error: (err) => console.error(err)
    //   });
    // }
  }

  
     
}
