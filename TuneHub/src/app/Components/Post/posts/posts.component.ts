import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { PostService } from '../../../Services/post.service';
import Post from '../../../Models/Post';
import Users from '../../../Models/Users';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.css'
})

export class PostsComponent {
  
  public posts: Post[] = [];
  public isShowDetails: boolean = false;
  public selectedPost!: Post;

  public user!: Users;

  constructor(private router: Router, private _postService: PostService,private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this._postService.getPosts().subscribe({
      next: (res) => {
        this.posts = res;
      },
      error: (err) => {
        console.log(err);
      }
    });

  }

  showDetails(post: Post) {
    this.router.navigate(['/post', post.id])
  }

 getImageUrl(base64?: string): SafeUrl {
        if (base64 && base64.trim()) {
            const imageUrl = `data:image/jpg;base64,${base64}`;
            // 👈 שימוש ב-bypassSecurityTrustUrl כדי לסמן את ה-URL כבטוח
            return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
        }
        // הערה: נתיב לקובץ מקומי 'assets/...' לרוב אינו דורש טיהור
        return 'assets/images/2.jpg'; 
    }


}
