import { Component, HostListener, Input } from '@angular/core';
import { CommentService } from '../Services/comment.service';

@Component({
  selector: 'app-comment',
  imports: [],
  standalone: true, // <-- ודא שזה קיים ונכון!
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css'
})
export class CommentComponent {
  @Input() postId!: number;  // <-- נקבל את ה-ID מהקומפוננטה של הפוסט

   comments: any[] = [];
  page: number = 0;
  size: number = 10;
  totalPages: number = 0;
  loading: boolean = false;

  constructor(private commentService: CommentService) { }

  ngOnInit(): void {
    this.loadComments();
  }

  loadComments(): void {
    if (this.loading || this.page >= this.totalPages) return;
    this.loading = true;

    this.commentService.getCommentsPaged(this.postId, this.page, this.size)
      .subscribe(response => {
        // הוספה למעלה כדי שהחדשות ביותר יהיו ראשונות
        this.comments = [...response.comments, ...this.comments];
        this.totalPages = response.totalPages;
        this.page++;
        this.loading = false;
      }, () => this.loading = false);
  }

  //לטעינה בגלילה למטה
   @HostListener("window:scroll", [])
  onScroll(): void {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100) {
      this.loadComments();
    }
  }
}
