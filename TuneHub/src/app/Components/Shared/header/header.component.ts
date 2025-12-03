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
import { GlobalSearchComponent } from "../global-search/global-search.component";
import { NotificationService } from '../../../Services/notification.service';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatIconModule, CommonModule, ProfileMiniAvatarComponent, GlobalSearchComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  unreadCount$!: Observable<number | string>;
  private router = inject(Router);
  sidebarService = inject(SidebarService); 
  loginwindowService = inject(LoginwindowService);
  userStateService = inject(UserStateService);
  private notificationService = inject(NotificationService);

  searchQuery: string = '';
  showSearchBox = false;
  searchTerm: string = '';
  isSearchOpen: boolean = false;

 ngOnInit(): void {
  this.unreadCount$ = this.notificationService.unreadCount$;

  this.notificationService.loadUnreadCount();
}


  onSearchChange(event: any) {
    const value = event.target.value;
    this.searchQuery = value;
    this.showSearchBox = value.trim().length > 0;
  }
  onSearchInput(event: any) {
    this.searchTerm = event.target.value;

    this.isSearchOpen = this.searchTerm.trim().length > 0;
  }

  isLoggedIn$: Observable<boolean> = this.userStateService.currentUser$.pipe(
    map(user => !!user) 
  );
  goToHomePage() {
    this.router.navigate(['/home-page']);
  }

  goToFindMusicians() {
    this.sidebarService.close(); 
    this.router.navigate(['/musicians']);
  }

  goToLoginWindow() {
    this.sidebarService.close();
    this.router.navigate(['/login-window']);
  }

  loadUnreadCount(): void {
    this.unreadCount$ = this.notificationService.getUnreadCount();
  }

  navigateToNotifications(): void {
    this.router.navigate(['/notifications']);
    console.log('Navigating to Notifications page...');
    // router.navigate(['/notifications']);
  }

}
