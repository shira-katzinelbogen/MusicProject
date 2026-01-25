import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SheetMusicService } from '../../../Services/sheetmusic.service';
import { SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import SheetMusic from '../../../Models/SheetMusic';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { FileUtilsService } from '../../../Services/fileutils.service';

@Component({
  selector: 'app-sheet-music',
  templateUrl: './sheet-music.component.html',
  standalone: true,
  imports: [
    MatIconModule,
    CommonModule,
    FormsModule
  ],
  styleUrl: './sheet-music.component.css'
})

export class SheetMusicComponent implements OnInit {
  sheet!: SheetMusic;
  pdfUrl!: SafeResourceUrl;

  constructor(
    private route: ActivatedRoute,
    private sheetService: SheetMusicService,
    private fileUtilsService: FileUtilsService,
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const sheetIdString = params.get('id');

      if (sheetIdString) {

        const sheetIdNumber = Number(sheetIdString);

        this.sheetService.getSheetMusicById(sheetIdNumber).subscribe({
          next: (data: SheetMusic) => {
            this.loadPDF(data);
          },
          error: (err) => {
            console.error('Error loading sheet music details', err);
          }
        });
      }
    });
  }


  loadPDF(sheetData: SheetMusic): void {
    this.sheet = sheetData;
    if (this.sheet.filePath) {
      this.pdfUrl = this.fileUtilsService.getPDFUrl(this.sheet.filePath);
    }
  }

}