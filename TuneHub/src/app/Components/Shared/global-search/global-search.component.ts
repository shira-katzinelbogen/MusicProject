import { Component, ElementRef, EventEmitter, HostListener, Input, Output, SimpleChanges } from '@angular/core';
import { GlobalSearchService } from '../../../Services/globalsearch.service';
import { SearchStateService } from '../../../Services/search-state.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FileUtilsService } from '../../../Services/fileutils.service';
import { NavigationService } from '../../../Services/navigation.service';
import { HighlightPipe } from '../../../Pipes/highlight.pipe';
import { TimeAgoPipe } from '../../../Pipes/time-ago.pipe';
import { NoResultsComponent } from "../no-results/no-results.component";
import { MatIconModule } from "@angular/material/icon";
import SheetMusic from '../../../Models/SheetMusic';
import { Router } from '@angular/router';
import { GlobalSearchResponseDTO, SearchPage } from '../../../Models/GlobalSearch';


@Component({
  selector: 'app-global-search',
  standalone: true,
  imports: [CommonModule, FormsModule, TimeAgoPipe, HighlightPipe, NoResultsComponent, MatIconModule],
  templateUrl: './global-search.component.html',
  styleUrls: ['./global-search.component.css']
})



export class GlobalSearchComponent {
  @Input() query: string = '';
  loading = false;
  resLength = 0;
  results: GlobalSearchResponseDTO | null = null;

  pages: SearchPage[] = [
    {
      title: 'Home',
      route: '/home-page',
      keywords: ['home', 'main', 'dashboard']
    },
    {
      title: 'Posts & Vibes',
      route: '/posts',
      keywords: ['posts', 'vibes', 'feed']
    },
    {
      title: 'Sheets Music',
      route: '/sheets-music',
      keywords: ['sheet', 'music', 'notes']
    },
    {
      title: 'Teachers',
      route: '/teacher-list',
      keywords: ['teachers', 'lessons', 'learn']
    },
    {
      title: 'Find Musicians',
      route: '/musicians',
      keywords: ['musicians', 'artists', 'players']
    }
  ];

  filteredPages: SearchPage[] = [];

  constructor(
    private elRef: ElementRef,
    private searchService: GlobalSearchService,
    public fileUtilsService: FileUtilsService,
    private navigationService: NavigationService,
    private router: Router,
    private searchStateService: SearchStateService
  ) { }

  @Output() clearQuery = new EventEmitter<void>();

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const clickedInside = this.elRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.clearQuery.emit();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('query' in changes) {
      const q = this.query.trim();
      if (q.length === 0) {
        this.results = null;
        this.searchStateService.setSearchOpen(false);
        return;
      }

      this.loading = true;
      this.searchStateService.setSearchOpen(true);

      this.searchService.search(q).subscribe({
        next: (res) => {
          this.results = res;
          if (this.results) {
            const qLower = q.toLowerCase();

            this.filteredPages = this.pages.filter(p =>
              p.title.toLowerCase().includes(qLower) ||
              p.keywords.some(k => k.includes(qLower))
            );

            this.results.posts.forEach(p => p.dateUploaded = new Date(p.dateUploaded));
            this.results.sheetMusic.forEach(s => s.dateUploaded = new Date(s.dateUploaded));

            this.resLength =
              this.results.posts.length +
              this.results.sheetMusic.length +
              this.results.musicians.length +
              this.results.teachers.length +
              this.filteredPages.length;

            this.loading = false;
          }
        },

        error: (e) => {
          this.loading = false;
          this.results = null;
          this.clearQuery.emit();
          console.log(e)
        }
      });
    }
  }

  goToSheetMusic(s: SheetMusic): void {
    this.clearQuery.emit();
    this.router.navigate(['/sheet-music', s.id]);
  }

  goToProfile(id: number): void {
    this.clearQuery.emit();
    this.navigationService.goToProfile(id);
  }

  goToPage(page: SearchPage): void {
    this.clearQuery.emit();
    this.router.navigate([page.route]);
  }
}