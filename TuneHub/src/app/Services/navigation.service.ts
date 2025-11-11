// navigation.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import Users from '../Models/Users';

@Injectable({
    providedIn: 'root' // הופך את השירות לגלובלי וזמין לכולם
})
export class NavigationService {

    constructor(private router: Router) { }

    goToProfile(u: Users) {
        if (u.id) {
            this.router.navigate(['/user-profile', u.id]);
        }
        else {
            console.error('Profile ID is missing for this user.', u);
        }
    }
}