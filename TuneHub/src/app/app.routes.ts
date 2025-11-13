import { Routes } from '@angular/router';

// Users
import { LoginWindowComponent } from './Components/Users/login-window/login-window.component';
import { MusiciansComponent } from './Components/Users/musicians/musicians.component';
import { UserProfileComponent } from './Components/Users/user-profile/user-profile.component';

// Shared
import { HomePageComponent } from './Components/Shared/home-page/home-page.component';
import { SidebarComponent } from './Components/Shared/sidebar/sidebar.component';

// Post
import { PostComponent } from './Components/Post/post/post.component';
import { PostsComponent } from './Components/Post/posts/posts.component';

// Teacher
import { TeacherListComponent } from './Components/Teachers/teacher-list/teacher-list.component';

// Sheet Music
import { SheetsMusicComponent } from './Components/SheetMusic/sheets-music/sheets-music.component';
import { ChallengeCardComponent } from './Components/Community/challenge-card/challenge-card.component';
import { CommunityGroupsComponent } from './Components/Community/community-groups/community-groups.component';
import { ChatMeesageComponent } from './Components/Chat/chat-meesage/chat-meesage.component';
import { SheetMusicComponent } from './Components/SheetMusic/sheet-music/sheet-music.component';



export const routes: Routes = [

  { path: '', redirectTo: '/home-page', pathMatch: 'full' },

  // Post
  { path: 'post/:id', component: PostComponent },
  { path: 'posts', component: PostsComponent },
  { path: 'post', component: PostComponent },

  // Users
  { path: 'login-window', component: LoginWindowComponent },
  { path: 'musicians', component: MusiciansComponent },
  { path: 'user-profile/:id', component: UserProfileComponent },

  // Shared
  { path: 'sidebar', component: SidebarComponent },
  { path: 'home-page', component: HomePageComponent },

  // Sheet Music
  { path: 'sheets-music', component: SheetsMusicComponent },
  { path: 'sheet-music/:id', component: SheetMusicComponent },

  { path: 'teacher-list', component: TeacherListComponent },
  { path: 'challenge-card', component: ChallengeCardComponent },
  { path: 'community-group', component: CommunityGroupsComponent },
  { path: 'chat-meesage', component: ChatMeesageComponent },

  // Wildcard
  { path: '**', component: HomePageComponent }
];
