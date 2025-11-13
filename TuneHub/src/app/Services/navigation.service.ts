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

    goToProfile(u: Users) {
        // 💡 התיקון הקריטי: בדוק את u.profile.id
        // משתמשים בבדיקת Optional Chaining (?. ) כדי למנוע קריסה אם 'profile' הוא null
        const profileId = u.profile?.id;

        if (profileId) {
            // אם ה-ID הוא מחרוזת ('2') נמיר למספר, למרות שזה לא חובה ל-router.navigate
            this.router.navigate(['/user-profile', profileId]); 
        }
        else {
            console.error('Profile ID is missing for this user.', u);
        }
    }
}