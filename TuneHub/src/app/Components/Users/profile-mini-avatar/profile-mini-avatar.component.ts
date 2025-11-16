import { Component, OnInit, OnDestroy, HostListener, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { LoginService } from '../../../Services/login.service';
import { UserProfile, UserStateService } from '../../../Services/user-state.service';
import { UsersService } from '../../../Services/users.service';
import { FileUtilsService } from '../../../Services/fileutils.service';


@Component({
  selector: 'app-profile-mini-avatar', // הסלקטור החדש
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-mini-avatar.component.html', // נשתמש בקובץ HTML נפרד
  styleUrls: ['./profile-mini-avatar.component.css'] // נשתמש בקובץ CSS נפרד
})
export class ProfileMiniAvatarComponent implements OnInit, OnDestroy {
  currentUser$: Observable<UserProfile | null> | undefined;
  isDropdownOpen: boolean = false;

  userStateService = inject(UserStateService);
  usersService = inject(UsersService);
  router = inject(Router);
  elementRef = inject(ElementRef);
  public fileUtilsService = inject(FileUtilsService);

  ngOnInit(): void {
    this.currentUser$ = this.userStateService.currentUser$;
  }

  ngOnDestroy(): void {
    // אם לא משתמשים ב-subscribe ידני, אפשר להסיר.
  }

  toggleDropdown(event: Event): void {
    event.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isDropdownOpen = false;
    }
  }

  handleSignOut(event: Event): void {
    event.stopPropagation();
    this.usersService.signOut().subscribe({
      next: () => {
        this.userStateService.clearUser();
        this.router.navigate(['/home']);
        this.isDropdownOpen = false;
      },
      error: (error) => {
        this.userStateService.clearUser();
        this.router.navigate(['/home']);
        this.isDropdownOpen = false;
      }
    });
  }

  // פונקציה לניווט לעמוד הפרופיל המלא
  navigateToProfile(name: string): void {
    this.isDropdownOpen = false;
    // נניח שאתה מנתב לפי שם/handle/ID:
    this.router.navigate(['/profile', name]);
  }
}