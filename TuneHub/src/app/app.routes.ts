import { Routes } from '@angular/router';

// Users
import { LoginWindowComponent } from './Components/Users/login-window/login-window.component';
import { MusiciansComponent } from './Components/Users/musicians/musicians.component';
import { UserProfileComponent } from './Components/Users/user-profile/user-profile.component';
import { FavoritesComponent } from './Components/Users/favorites/favorites.component';
import { EditProfilModalComponent } from './Components/Users/edit-profil-modal/edit-profil-modal.component';

// Shared
import { HomePageComponent } from './Components/Shared/home-page/home-page.component';
import { SidebarComponent } from './Components/Shared/sidebar/sidebar.component';

// Post
import { UploadPostComponent } from './Components/Post/upload-post/upload-post.component';
import { PostsComponent } from './Components/Post/posts/posts.component';

// Teacher
// Sheet Music
import { SheetsMusicComponent } from './Components/SheetMusic/sheets-music/sheets-music.component';
import { SheetMusicComponent } from './Components/SheetMusic/sheet-music/sheet-music.component';

// Comment
import { CommentComponent } from './Components/Comments/comment/comment.component';
import { AddCommentComponent } from './Components/Comments/add-comment/add-comment.component';

// Chat Bot 
import { ChatBotComponent } from './Components/Chat/chat-bot/chat-bot.component';
import { TeacherSignupComponent } from './teacher-signup/teacher-signup.component';
import { TeacherListComponent } from './Components/Teachers/teacher-list/teacher-list.component';

// Notification
import { NotificationsComponent } from './Components/Notification/notifications/notifications.component';


// import { ChallengeCardComponent } from './Components/Community/challenge-card/challenge-card.component';
// import { CommunityGroupsComponent } from './Components/Community/community-groups/community-groups.component';
// import { ChatMeesageComponent } from './Components/Chat/chat-meesage/chat-meesage.component';

export const routes: Routes = [

  { path: '', redirectTo: '/home-page', pathMatch: 'full' },

  // Post
  { path: 'posts', component: PostsComponent },
  { path: 'upload-post', component: UploadPostComponent },

  // Users
  { path: 'login-window', component: LoginWindowComponent },
  { path: 'musicians', component: MusiciansComponent },
  { path: 'musicians/:id', component: MusiciansComponent },
  { path: 'user-profile/:id', component: UserProfileComponent },
  { path: 'edit-profil-modal/:id', component: EditProfilModalComponent }
,{ path: 'edit-profil-modal', component: EditProfilModalComponent },
{ path: 'teacher-signup/:id', component: TeacherSignupComponent },
{ path: 'teacher-signup', component: TeacherSignupComponent },



  //Comments
  { path: 'edit-profil-modal/:id', component: EditProfilModalComponent },
  { path: 'edit-profil-modal', component: EditProfilModalComponent },
  { path: 'favoraites', component: FavoritesComponent },

  // Comment
  { path: 'comment', component: CommentComponent },
  { path: 'add-comment/:postId', component: AddCommentComponent },
  { path: 'add-comment', component: AddCommentComponent },

  // Shared
  { path: 'sidebar', component: SidebarComponent },
  { path: 'home-page', component: HomePageComponent },

  // Sheet Music
  { path: 'sheets-music', component: SheetsMusicComponent },
  { path: 'sheet-music/:id', component: SheetMusicComponent },
  { path: 'sheet-music', component: SheetMusicComponent },
  { path: 'music-card', component: SheetMusicComponent },
  { path: 'post-card', component: PostsComponent },

  // Teacher
  { path: 'teacher-list', component: TeacherListComponent },
  // { path: 'challenge-card', component: ChallengeCardComponent },
  // { path: 'community-group', component: CommunityGroupsComponent },
  // { path: 'chat-meesage', component: ChatMeesageComponent },

  // Notification
  { path: 'notifications', component: NotificationsComponent },

  // Chat Bot 
  { path: 'chat-bot', component: ChatBotComponent },

  // Wildcard
  { path: '**', component: HomePageComponent }
];
