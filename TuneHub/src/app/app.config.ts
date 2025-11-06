import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http'; // 💡 ייבוא חובה לפתרון השגיאה!

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    
    // ********* הוספה לפתרון שגיאת HttpClient *********
    provideHttpClient(), 
    // ************************************************
    
    // ניווט: מופיע פעם אחת בלבד
    provideRouter(routes), 
    
    // הגדרות הידרציה
    provideClientHydration(withEventReplay()),
    
    // provideAnimations() // מומלץ להשאיר אם משתמשים ב-Angular Material
  ]
};