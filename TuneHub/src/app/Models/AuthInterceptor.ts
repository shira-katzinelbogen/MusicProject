import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { UsersService } from '../Services/users.service'; // הנתיב לשירות שלך
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  // הזרקת השירותים הנדרשים
  constructor(private usersService: UsersService, private router: Router) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    
    return next.handle(request).pipe(catchError(error => {
      // 1. נבדוק אם זו שגיאת 401 וזו לא בקשת הריענון עצמה (למניעת לולאה אינסופית)
      if (error instanceof HttpErrorResponse && error.status === 401 && !request.url.includes('refreshtoken') && !request.url.includes('signIn')) {
        return this.handle401Error(request, next);
      }
      
      return throwError(() => error);
    }));
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      // 2. קריאה לשרת לריענון הטוקן
      return this.usersService.refreshToken().pipe(
        switchMap((response: any) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(true); // סמן שהריענון הצליח
          
          // 3. שלח שוב את הבקשה המקורית (השרת כבר שלח קוקי חדש!)
          return next.handle(request);
        }),
        catchError((err) => {
          // 4. אם הריענון נכשל (כי ה-Refresh Token פג תוקף או בוטל)
          this.isRefreshing = false;
          this.router.navigate(['/login']); // שלח משתמש לדף התחברות
          return throwError(() => err);
        })
      );
    } 
    // אם כבר מתבצע ריענון, המתן
    return this.refreshTokenSubject.pipe(
      filter(token => token != null),
      take(1),
      switchMap(val => {
        return next.handle(request);
      })
    );
  }
}