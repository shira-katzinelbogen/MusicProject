import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { SidebarService } from '../../../Services/sidebar.service';
import { LoginwindowService } from '../../../Services/loginwindow.service';

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
  loginwindowService = inject(LoginwindowService);

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
