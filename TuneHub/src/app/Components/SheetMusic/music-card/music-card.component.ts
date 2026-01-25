import { ChangeDetectorRef, Component, Input } from '@angular/core';
import SheetMusic from '../../../Models/SheetMusic';
import { Router } from '@angular/router';
import { HighlightPipe } from '../../../Pipes/highlight.pipe';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { FileUtilsService } from '../../../Services/fileutils.service';
import { NavigationService } from '../../../Services/navigation.service';
import { UploadSheetMusicService } from '../../../Services/uploadsheetmusic.service';
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

  constructor(
    private router: Router,
    public fileUtilsService: FileUtilsService,
    public navigationService: NavigationService,
    public uploadSheetMusicService: UploadSheetMusicService,
    private cdr: ChangeDetectorRef,
    private _interactionService: InteractionService
  ) { }


  goToSheetMusic(s: SheetMusic) {
    this.router.navigate(['/sheet-music', s.id]);
  }

  getImageCoverPath(sheet: SheetMusic) {
      return this.fileUtilsService.getImageUrl(sheet.imageCoverName)
  }

  toggleLike(sheet: SheetMusic): void {
    if (!sheet.liked) {
      this._interactionService.addLike('SHEET_MUSIC', sheet.id!).subscribe({
        next: (res) => {
         sheet.likes = (sheet.likes ?? 0) + 1;
          sheet.liked = true;
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Failed to add like', err)
      });
    } else {
      this._interactionService.removeLike('SHEET_MUSIC', sheet.id!).subscribe({
        next: (res) => {
        sheet.likes = (sheet.likes ?? 1) - 1;
          sheet.liked = false;
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Failed to remove like', err)
      });
    } console.log('like clicked!', sheet);
  }

 
  toggleFavorite(sheet: SheetMusic): void {
    if (!sheet.favorite) {
      this._interactionService.addFavorite('SHEET_MUSIC', sheet.id!).subscribe({
        next: (res) => {
          sheet.hearts = res.count;
          sheet.favorite = true;
          this.cdr.detectChanges();
        }
      });
    } else {
      this._interactionService.removeFavorite('SHEET_MUSIC', sheet.id!).subscribe({
        next: (res) => {
          sheet.hearts = res.count;
          sheet.favorite = false;
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
