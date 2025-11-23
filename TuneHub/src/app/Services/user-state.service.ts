// src/app/services/user-state.service.ts

import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { log } from 'node:console';

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

  constructor() {
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

  /** ניקוי המשתמש */
  clearUser(): void {
    if (this.isBrowser) {
      sessionStorage.removeItem(STORAGE_KEY);
    }
    this.currentUserSubject.next(null);
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
