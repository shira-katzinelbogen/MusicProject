import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { SidebarService } from '../../../Services/sidebar.service';
import { LoginwindowService } from '../../../Services/loginwindow.service';
import { SearchStateService } from '../../../Services/search-state.service';
import { ProfileMiniAvatarComponent } from '../../Users/profile-mini-avatar/profile-mini-avatar.component';
import { UserStateService } from '../../../Services/user-state.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { GlobalSearchComponent } from "../global-search/global-search.component";
// import { NotificationService } from '../../../Services/notification.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatIconModule,FormsModule, CommonModule, ProfileMiniAvatarComponent, GlobalSearchComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})

export class HeaderComponent {
  private router = inject(Router);
  sidebarService = inject(SidebarService);
  loginwindowService = inject(LoginwindowService);
  searchStateService = inject(SearchStateService);
  userStateService = inject(UserStateService);

  searchTerm = '';
  isSearchOpen$ = this.searchStateService.isSearchOpen$;

  isLoggedIn$: Observable<boolean> = this.userStateService.currentUser$.pipe(
    map(user => !!user)
  );

  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value;
    this.searchStateService.setSearchOpen(this.searchTerm.trim().length > 0);
  }

  goToHomePage(): void {
    this.router.navigate(['/home-page']);
  }

  goToFindMusicians(): void {
    this.sidebarService.close();
    this.router.navigate(['/musicians']);
  }

  goToLoginWindow(): void {
    this.sidebarService.close();
    this.router.navigate(['/login-window']);
  }

  onClearSearch() {
    this.searchTerm = '';
    this.searchStateService.setSearchOpen(false);
  }


  // loadUnreadCount(): void {
  //    this.unreadCount$ = this.notificationService.getUnreadCount();
  // }

  // navigateToNotifications(): void {
  //    this.router.navigate(['/notifications']);
  //    router.navigate(['/notifications']);
  // }
}

