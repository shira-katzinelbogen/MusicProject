// src/app/services/user-state.service.ts

import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { log } from 'node:console';
import { UsersService } from './users.service';
import { Router } from '@angular/router';


export interface UserProfile {
  id: number;
  name: string;
  hasImageProfilePath: boolean;
  imageProfilePath?: string;
  roles: string[]; // ← רולים
}

const STORAGE_KEY = 'currentUserProfile';

@Injectable({
  providedIn: 'root'
})

export class UserStateService {

  private currentUserSubject: BehaviorSubject<UserProfile | null>;
  public currentUser$: Observable<UserProfile | null>;

  private platformId = inject(PLATFORM_ID);
  private isBrowser: boolean;

constructor(
  private _usersService: UsersService,
  private router: Router,
  // private platformId: Object
) {
  this.isBrowser = isPlatformBrowser(this.platformId);
  
  let initialUser: UserProfile | null = null;
  if (this.isBrowser) {
    const storedUser = sessionStorage.getItem(STORAGE_KEY);
    if (storedUser) {
      try {
        initialUser = JSON.parse(storedUser);
      } catch (e) {
        console.error("Failed to parse user profile from session storage", e);
        sessionStorage.removeItem(STORAGE_KEY);
      }
    }
  }

  this.currentUserSubject = new BehaviorSubject<UserProfile | null>(initialUser);
  this.currentUser$ = this.currentUserSubject.asObservable();
}

  /** שמירת המשתמש וההרשאות */
  setUser(user: UserProfile): void {
    if (this.isBrowser) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    }
    this.currentUserSubject.next(user);
    
  }
logout(): void {
  if (!this.isBrowser) return;

  // קוראים קודם לשרת
  this._usersService.signOut().subscribe({
    next: () => {
      // אחרי שהשרת אישר את הסיין אאוט
      sessionStorage.removeItem(STORAGE_KEY);
      this.currentUserSubject.next(null);

      this.router.navigate(['/home']);
    },
    error: (err) => console.error('Sign out failed:', err)
  });
}


  /** מחזיר את המשתמש הנוכחי באופן סינכרוני */
  getCurrentUserValue(): UserProfile | null {
    console.log(this.currentUserSubject.getValue());
    
    return this.currentUserSubject.getValue();
  }

  /** האם למשתמש יש רול מסוים */
  hasRole(role: string): boolean {
    const user = this.currentUserSubject.getValue();
    return !!user?.roles?.includes(role);
  }

  /** האם המשתמש הוא אדמין לדוגמה */
  isAdmin(): boolean {
    return this.hasRole('ADMIN');
  }

  /** האות הראשונה של שם המשתמש */
  getFirstLetter(): string | null {
    const user = this.currentUserSubject.getValue();
    if (user?.name) {
      return user.name.charAt(0).toUpperCase();
    }
    return null;
  }
  
}
