import { Component, OnInit, OnDestroy, HostListener, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import {  UserStateService } from '../../../Services/user-state.service';
import { UsersService } from '../../../Services/users.service';
import { FileUtilsService } from '../../../Services/fileutils.service';
import { NavigationService } from '../../../Services/navigation.service';
import { UsersProfileDTO } from '../../../Models/Users';

@Component({
  selector: 'app-profile-mini-avatar', 
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-mini-avatar.component.html', 
  styleUrls: ['./profile-mini-avatar.component.css'] 
})

export class ProfileMiniAvatarComponent implements OnInit, OnDestroy {
  currentUser$: Observable<UsersProfileDTO | null> | undefined;
  isDropdownOpen: boolean = false;

  userStateService = inject(UserStateService);
  usersService = inject(UsersService);
  router = inject(Router);
  elementRef = inject(ElementRef);
  public fileUtilsService = inject(FileUtilsService);
  public navigationService = inject(NavigationService);
  
  ngOnInit(): void {
    this.currentUser$ = this.userStateService.currentUser$;
  }

  ngOnDestroy(): void {
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
        this.userStateService.logout();
        this.router.navigate(['/home']);
        this.isDropdownOpen = false;
      },
      error: (error) => {
        this.userStateService.logout();
        this.router.navigate(['/home']);
        this.isDropdownOpen = false;
      }
    });
  }

  navigateToProfile(name: string): void {
    this.isDropdownOpen = false;
    this.router.navigate(['/profile', name]);
  }
}