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
import { SheetMusicComponent } from './sheet-music/sheet-music.component';
import { TeacherListComponent } from './Components/Teachers/teacher-list/teacher-list.component';
import { ChallengeCardComponent } from './Components/Community/challenge-card/challenge-card.component';
import { CommunityGroupsComponent } from './Components/Community/community-groups/community-groups.component';
import { ChatMeesageComponent } from './Components/Chat/chat-meesage/chat-meesage.component';

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

  
  { path: 'sheet-music', component: SheetMusicComponent },
  { path: 'teacher-list', component: TeacherListComponent },
  { path: 'challenge-card', component: ChallengeCardComponent },
  { path: 'community-group', component: CommunityGroupsComponent },
  { path: 'chat-meesage', component: ChatMeesageComponent },
  // Wildcard
  { path: '**', component: HomePageComponent }
];
