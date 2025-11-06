// import { Component, inject } from '@angular/core';

// import { Router, RouterModule } from '@angular/router';
// import { MatIconModule } from '@angular/material/icon';
// import { SidebarService } from '../../../Services/sidebar.service';
// // import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// // 

// @Component({
//   selector: 'app-header',
//   standalone: true,
//   imports: [
//     RouterModule, 
//     MatIconModule,
//     // BrowserAnimationsModule
//   ],
//   templateUrl: './header.component.html',
//   styleUrl: './header.component.css'
// })

// export class HeaderComponent {
//   isSidebarOpen = false;
 
//   constructor(private router: Router) {}

// private sidebarService = inject(SidebarService);

//   isOpen = this.sidebarService.isOpen; // Signal readonly

//   toggleSidebar() {
//     this.sidebarService.toggle();
//   }
  

//   // toggleSidebar() {
//   //   this.isSidebarOpen = !this.isSidebarOpen;
//   // }

//   closeSidebar() {
//     this.isSidebarOpen = false;
//   }

//   goToProfile() {
//     this.closeSidebar();
//     this.router.navigate(['/user-profile']);
//   }

//   goToFindMusicians() {
//     this.closeSidebar();
//     this.router.navigate(['/musicians']); 
//   }

//   goToLoginWindow() {
//     this.closeSidebar();
//     this.router.navigate(['/login-window']);
//   }

//   goToHomePage() {
//     this.closeSidebar();
//     this.router.navigate(['/home-page']);
//   }

  

//   openSidebar() {
//     this.sidebarService.toggle();
//   }
// }






import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { SidebarService } from '../../../Services/sidebar.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  private router = inject(Router);
  sidebarService = inject(SidebarService); // ← משתמש ב-Signal

  goToHomePage() {
    this.router.navigate(['/home-page']);
  }

  goToFindMusicians() {
    this.sidebarService.close(); // סוגר סיידבר לפני ניווט
    this.router.navigate(['/musicians']);
  }

  goToLoginWindow() {
    this.sidebarService.close();
    this.router.navigate(['/login-window']);
  }

}
