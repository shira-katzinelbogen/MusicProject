import { Component, HostListener, Input } from '@angular/core';
import { CommentService } from '../Services/comment.service';
import { log } from 'console';
@Component({
  selector: 'app-comment',
  imports: [],
  standalone: true, 
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
  console.log('Post ID:', this.postId);

  }

  ngOnChanges(): void {
  if (this.postId) {
    this.loadComments();
  }
}

 loadComments(): void {
   if (this.loading) return;  // אל תבדוק totalPages עדיין
  this.loading = true;


  this.commentService.getCommentsPaged(this.postId, this.page, this.size)
    .subscribe({
      next: response => {
      console.log('API Response:', response);  // ← בדיקה כאן

        // הוספה למעלה כדי שהחדשות ביותר יהיו ראשונות
        this.comments = [...response.comments, ...this.comments];
                console.log(this.comments);
                      console.log('API Response:', response);  // ← בדיקה כאן


        this.totalPages = response.totalPages;
        this.page++;
        this.loading = false;
      },
      //error: () => this.loading = false
          error: err => console.error('API Error:', err)

    });
}


  //לטעינה בגלילה למטה
   @HostListener("window:scroll", [])
  onScroll(): void {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100) {
      this.loadComments();
    }
  }
}
