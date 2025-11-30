import { Component, Input, SimpleChanges } from '@angular/core';
import { GlobalSearchResponseDTO } from '../../../Models/globalSearch';
import { GlobalSearchService } from '../../../Services/globalsearch.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FileUtilsService } from '../../../Services/fileutils.service';
import { NavigationService } from '../../../Services/navigation.service';
import { TimeAgoPipe } from '../time-ago-pipe/time-ago-pipe.component';
import { HighlightPipe } from '../highlight/highlight.component';



@Component({
  selector: 'app-global-search',
  standalone: true,
  imports: [CommonModule, FormsModule,TimeAgoPipe,HighlightPipe ],
  templateUrl: './global-search.component.html',
  styleUrls: ['./global-search.component.css']
})
export class GlobalSearchComponent {


  @Input() query: string = '';
  loading = false;
  resLength = 0;
  results: GlobalSearchResponseDTO | null = null;



  constructor(private searchService: GlobalSearchService, public fileUtilsService: FileUtilsService,public navigationService:NavigationService) { }

  ngOnChanges(changes: SimpleChanges) {
    if ('query' in changes) {
      const q = this.query.trim();
      if (q.length === 0) {
        this.results = null;
        return;
      }

      this.loading = true;

      this.searchService.search(q).subscribe({
        next: (res) => {
          this.results = res;
          this.resLength = this.results.posts.length + this.results.sheetMusic.length + this.results.musicians.length + this.results.teachers.length;
          this.loading = false;
        },
        error: (e) => {
          this.loading = false;
          this.results = null;
          console.log(e)
        }
      });
    }
  }
}
