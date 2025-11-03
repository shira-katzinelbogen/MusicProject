import { Component, ViewChild } from '@angular/core';

import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav } from '@angular/material/sidenav';
import { SidebarService } from '../../../Services/sidebar.service';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// 

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterModule, 
    MatIconModule,

    // BrowserAnimationsModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})

export class HeaderComponent {
  isSidebarOpen = false;

  constructor(private router: Router,private sidebarService: SidebarService) {}

  // toggleSidebar() {
  //   this.isSidebarOpen = !this.isSidebarOpen;
  // }

  // closeSidebar() {
  //   this.isSidebarOpen = false;
  // }

  toggleSidebar() {
    this.sidebarService.toggle();  
  }

  closeSidebar() {
    this.sidebarService.close();  
  }
    


 
  goToProfile() {
    this.closeSidebar();
    this.router.navigate(['/user-profile']);
  }

  goToFindMusicians() {
    this.closeSidebar();
    this.router.navigate(['/musicians']); // תוקן מ-musicans ל-musicians
  }

  goToLoginWindow() {
    this.closeSidebar();
    this.router.navigate(['/login-window']);
  }

  goToHomePage() {
    this.closeSidebar();
    this.router.navigate(['/home-page']);
  }
}

