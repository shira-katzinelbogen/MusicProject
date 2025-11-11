// src/app/services/user-state.service.ts

import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common'; // פונקציה לבדיקת סביבה
import { BehaviorSubject, Observable } from 'rxjs';

export interface UserProfile {
  name: string;
  hasProfilePicture: boolean; 
  profilePictureUrl?: string; 
}const STORAGE_KEY = 'currentUserProfile';

@Injectable({
  providedIn: 'root'
})
export class UserStateService {
  
  private currentUserSubject: BehaviorSubject<UserProfile | null>;
  public currentUser$: Observable<UserProfile | null>;
  
  // הזרקת PLATFORM_ID
  private platformId = inject(PLATFORM_ID);
  
  // דגל לבדיקה מיידית
  private isBrowser: boolean;

  constructor() {
    // קביעת הדגל: האם אנו רצים בדפדפן?
    this.isBrowser = isPlatformBrowser(this.platformId);
    
    let initialUser: UserProfile | null = null;
    
    // 👈 בדיקה חובה לפני הגישה ל-sessionStorage
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
    } // אחרת: initialUser נשאר null
    
    this.currentUserSubject = new BehaviorSubject<UserProfile | null>(initialUser);
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  // עדכון המתודה setUser
  setUser(user: UserProfile): void {
    if (this.isBrowser) { // 👈 בדיקה נוספת חובה
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    }
    this.currentUserSubject.next(user);
  }

  // עדכון המתודה clearUser
  clearUser(): void {
    if (this.isBrowser) { // 👈 בדיקה נוספת חובה
      sessionStorage.removeItem(STORAGE_KEY);
    }
    this.currentUserSubject.next(null);
  }

  /**
   * מחזיר את האות הראשונה של שם המשתמש.
   * משמש כשיטה חלופית להצגה במקום תמונת פרופיל.
   */
  getFirstLetter(): string | null {
    const user = this.currentUserSubject.getValue();
    if (user && user.name) {
      return user.name.charAt(0).toUpperCase();
    }
    return null;
  }
  
  /**
   * מחזיר את המשתמש הנוכחי (שימוש לקריאה סינכרונית, אם נחוץ).
   */
  getCurrentUserValue(): UserProfile | null {
    return this.currentUserSubject.getValue();
  }
}