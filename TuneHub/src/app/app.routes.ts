import { Routes } from '@angular/router';
import { NavbarComponent } from './Components/Shared/navbar/navbar.component';
import { SidebarComponent } from './Components/Shared/sidebar/sidebar.component';

export const routes: Routes = [

    // { path: 'navbar', component: NavbarComponent },
    { path: 'sidebar', component: SidebarComponent },
      { path: '**', component: NavbarComponent }  // נתיב ברירת מחדל

];
