import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { SidebarService } from '../../../Services/sidebar.service';
import { LoginwindowService } from '../../../Services/loginwindow.service';
import { ProfileMiniAvatarComponent } from '../../Users/profile-mini-avatar/profile-mini-avatar.component';
import { UserStateService } from '../../../Services/user-state.service'; // ודא נתיב נכון
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatIconModule,CommonModule,ProfileMiniAvatarComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  private router = inject(Router);
  sidebarService = inject(SidebarService); // ← משתמש ב-Signal
  loginwindowService = inject(LoginwindowService);
  userStateService = inject(UserStateService);

  isLoggedIn$: Observable<boolean> = this.userStateService.currentUser$.pipe(
    map(user => !!user) // מחזיר true אם יש אובייקט משתמש, אחרת false
  );
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
