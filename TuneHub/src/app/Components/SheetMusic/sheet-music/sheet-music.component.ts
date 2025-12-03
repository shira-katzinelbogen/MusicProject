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
    
  }

  
     
}
