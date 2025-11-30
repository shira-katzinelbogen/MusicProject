import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'; // 💡 ייבוא חובה לפתרון השגיאה!

import { routes } from './app.routes';
import { AuthInterceptor } from './Models/AuthInterceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    
    provideHttpClient(
      withInterceptorsFromDi() // מאפשר שימוש בשיטת הרישום הקלאסית (multi: true)
    ),

    // 2. רישום ה-Interceptor עצמו:
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor, // שם הקלאס שיצרת לטיפול ב-401
      multi: true // מאפשר רישום מספר Interceptors
    },
    
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