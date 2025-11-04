import { Routes } from '@angular/router';

//Users
import { LoginWindowComponent } from './Components/Users/login-window/login-window.component';
import { MusiciansComponent } from './Components/Users/musicians/musicians.component';

//Shared
import { HomePageComponent } from './Components/Shared/home-page/home-page.component';
import { SidebarComponent } from './Components/Shared/sidebar/sidebar.component';

//Post
import { PostComponent } from './Components/Post/post/post.component';
import { PostsComponent } from './Components/Post/posts/posts.component';

export const routes: Routes = [

  { path: '', redirectTo: '/home-page', pathMatch: 'full' },

  // Post
  { path: 'post/:id', component: PostComponent },
  { path: 'posts', component: PostsComponent },

  // Users
  { path: 'login-window', component: LoginWindowComponent },
  { path: 'musicians', component: MusiciansComponent },

  // Shared
  { path: 'sidebar', component: SidebarComponent },
  { path: 'home-page', component: HomePageComponent },

  // Wildcard
  { path: '**', component: HomePageComponent }
];
