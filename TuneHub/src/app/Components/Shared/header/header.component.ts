import { Component } from '@angular/core';

import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
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

  constructor(private router: Router) {}

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
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