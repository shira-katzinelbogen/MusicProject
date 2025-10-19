import { Routes } from '@angular/router';

//Users
import { LoginWindowComponent } from './Components/Users/login-window/login-window.component';
import { MusiciansComponent } from './Components/Users/musicians/musicians.component';

//Shared
import { HomePageComponent } from './Components/Shared/home-page/home-page.component';
import { SidebarComponent } from './Components/Shared/sidebar/sidebar.component';


export const routes: Routes = [
  { path: '', redirectTo: '/home-page', pathMatch: 'full' },
  //Users
  { path: 'login-window', component: LoginWindowComponent },
  { path: 'musicians', component: MusiciansComponent },

  //Shared
  { path: 'sidebar', component: SidebarComponent },
  { path: '**', component: HomePageComponent }

];
