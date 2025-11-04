import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { PostService } from '../../../Services/post.service';
import Post from '../../../Models/Post';
import Users from '../../../Models/Users';

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


  constructor(private router: Router, private _postService: PostService) { }

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



}
