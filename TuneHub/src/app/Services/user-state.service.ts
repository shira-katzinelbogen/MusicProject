import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { UsersService } from './users.service';
import { Router } from '@angular/router';
import {  UsersProfileDTO, EUserType } from '../Models/Users';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ERole } from '../Models/Role';

@Injectable({
  providedIn: 'root'
})

export class UserStateService {

  public currentUserSubject: BehaviorSubject<UsersProfileDTO | null> = new BehaviorSubject<UsersProfileDTO | null>(null);
  public currentUser$: Observable<UsersProfileDTO | null> = this.currentUserSubject.asObservable();
  public isAdmin$: Observable<boolean> = this.currentUser$.pipe(
  map(user =>
    !!user?.roles?.some(r =>
      r?.name === ERole.ROLE_ADMIN ||
      r?.name === ERole.ROLE_SUPER_ADMIN
    )
  )
);


  constructor(
    private _usersService: UsersService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }


  loadCurrentUser(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this._usersService.getCurrentUserProfile().subscribe({
      next: (user: UsersProfileDTO) => {
        this.currentUserSubject.next(user);
      },
      error: (err) => {
        this.currentUserSubject.next(null);
      }
    });
  }

  getCurrentUserValue(): UsersProfileDTO | null {
    return this.currentUserSubject.getValue();
  }

  hasRole(role: ERole): boolean {
    const user = this.currentUserSubject.getValue();
    if (!user?.roles) return false;
    
    const hasIt = user.roles.some((r: any) => {
      return r?.name === role;
    });
    
    return hasIt;
  }

  hasUserType(type: EUserType): boolean {
    const user = this.currentUserSubject.getValue();
    return !!user?.userTypes?.includes(type);
  }


  isMusician(): boolean {
    return this.hasUserType(EUserType.MUSICIAN);
  }

  isTeacher(): boolean {
    return this.hasUserType(EUserType.TEACHER);
  }

  canBecomeTeacher(): boolean {
    return this.isMusician() && !this.isTeacher();
  }


  isAdmin(): boolean {
    return this.hasRole(ERole.ROLE_ADMIN) || this.hasRole(ERole.ROLE_SUPER_ADMIN);
  }

  isSuperAdmin(): boolean {
    return this.hasRole(ERole.ROLE_SUPER_ADMIN);
  }

  getFirstLetter(): string | null {
    const user = this.currentUserSubject.getValue();
    return user?.name?.charAt(0).toUpperCase() ?? null;
  }

  clear(): void {
    this.currentUserSubject.next(null);
  }

  logout(): void {
    this._usersService.signOut().subscribe({
      next: () => {
        this.clear();
        this.router.navigate(['/home']);
      },
      error: (err) => console.error('Sign out failed:', err)
    });
  }
}


