import { ChangeDetectorRef, Component, Input } from '@angular/core';
import SheetMusic from '../../../Models/SheetMusic';
import { Router, RouterLink } from '@angular/router';
import { HighlightPipe } from '../../Shared/highlight/highlight.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { SheetMusicService } from '../../../Services/sheetmusic.service';
import { FileUtilsService } from '../../../Services/fileutils.service';
import { NavigationService } from '../../../Services/navigation.service';
import { UploadSheetMusicService } from '../../../Services/uploadsheetmusic.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { InteractionService } from '../../../Services/interaction.service';

@Component({
  selector: 'app-music-card',
  standalone: true,
  imports: [MatIconModule, FormsModule, CommonModule, HighlightPipe],
  templateUrl: './music-card.component.html',
  styleUrl: './music-card.component.css'
})
export class MusicCardComponent {
  @Input() sheet!: SheetMusic;
  @Input() searchText: string | undefined;

  // תקבל את הנתונים של השיט

  constructor(
    private router: Router,
    private _sheetMusicService: SheetMusicService,
    public fileUtilsService: FileUtilsService,
    //     private router: Router,
    public navigationService: NavigationService,
    public uploadSheetMusicService: UploadSheetMusicService,
    private cdr: ChangeDetectorRef,
    private domSanitizer: DomSanitizer,
    private _interactionService: InteractionService
  ) { }

  getSafeMediaUrl(path: string): SafeResourceUrl {
    const url = `http://localhost:8080/api/sheetMusic/documents/${path}`;
    return this.domSanitizer.bypassSecurityTrustResourceUrl(url);
  }

  goToSheetMusic(s: SheetMusic) {
    this.router.navigate(['/sheet-music', s.id]);
  }

  getImageCoverPath(sheet: SheetMusic) {
    if (sheet.imageCoverName != null) {
      return this.fileUtilsService.getImageUrl(sheet.imageCoverName)
    }

    return 'assets/images/sheets_music.webp'
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
    } console.log('like clicked!', sheet);
  }

  toggleFavorite(sheet: SheetMusic): void {
    if (!sheet.isFavorite) {
      this._interactionService.addFavorite('SHEET_MUSIC', sheet.id!).subscribe({
        next: (res) => {
          sheet.hearts = res.count; // עכשיו res.count מגיע מהשרת
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