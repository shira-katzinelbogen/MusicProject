// navigation.service.ts

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
// 💡 נניח שהמודל Users מכיל שדה 'profile'
import Users from '../Models/Users'; 

@Injectable({
    providedIn: 'root'
})
export class NavigationService {

    constructor(private router: Router) { }

   goToProfile(userId: number | string) {
  if (userId) {
    this.router.navigate(['/user-profile', userId]);
  } else {
    console.error('Profile ID is missing');
  }
}

}