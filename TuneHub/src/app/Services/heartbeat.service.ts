import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, interval, Subscription } from 'rxjs';
import { AuthService } from './auth.service'; 

@Injectable({
  providedIn: 'root'
})
export class HeartbeatService {
  
  private readonly HEARTBEAT_INTERVAL = 30000; 
  private heartbeatSubscription: Subscription | null = null;
  private readonly HEARTBEAT_URL = '/api/user/heartbeat';

  constructor(
    private http: HttpClient,
    private authService: AuthService 
  ) {}

  /**
   * שולח בקשת Heartbeat בודדת לשרת, כולל הטוקן ב-Header.
   */
  private sendHeartbeat(): Observable<any> {
    const token = this.authService.getAccessToken(); // <---  שורה זו הייתה חסרה!
    
    // ודא שהטוקן קיים לפני שליחת הבקשה
    if (!token) {
        this.stopHeartbeat();
        // אם אין טוקן, אין צורך לשלוח, המשתמש לא מחובר
        return new Observable(observer => observer.error('No access token available.'));
    }

    // *** הוספת הטוקן ל-Headers ***
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // שליחת הבקשה עם ה-Headers המכילים את הטוקן
    return this.http.post(this.HEARTBEAT_URL, {}, { headers: headers });
  }

  /**
   * מתחיל את הטיימר הקבוע לשליחת Heartbeat
   */
  public startHeartbeat(): void {
    if (this.heartbeatSubscription) {
      return;
    }

    // 1. שלח בקשה ראשונה באופן מיידי
    this.sendHeartbeat().subscribe({
        error: (err) => {
            console.error('Initial Heartbeat Failed', err);
            this.stopHeartbeat(); 
        }
    });

    // 2. הגדר טיימר קבוע
    this.heartbeatSubscription = interval(this.HEARTBEAT_INTERVAL)
      .subscribe(() => {
        this.sendHeartbeat().subscribe({
          next: () => console.log('Heartbeat sent successfully.'),
          error: (err) => {
            console.error('Periodic Heartbeat Failed:', err);
          }
        });
      });
  }

  /**
   * עוצר את הטיימר
   */
  public stopHeartbeat(): void {
    if (this.heartbeatSubscription) {
      this.heartbeatSubscription.unsubscribe();
      this.heartbeatSubscription = null;
      console.log('Heartbeat service stopped.');
    }
  }
}