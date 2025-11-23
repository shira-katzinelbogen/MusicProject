import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  // מקבל נתונים מ-sessionStorage
  getItem(key: string): string | null {
    if (this.isBrowser) {
      return sessionStorage.getItem(key);
    }
    return null;
  }

  // שומר נתונים ב-sessionStorage
  setItem(key: string, value: string): void {
    if (this.isBrowser) {
      sessionStorage.setItem(key, value);
    }
  }
}