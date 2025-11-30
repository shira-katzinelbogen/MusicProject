import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Service to handle administrative actions related to posts and users.
 * This service communicates with the admin endpoints in the backend.
 */
@Injectable({
  providedIn: 'root' // גורם ל-Service להיות זמין לכל הקומפוננטות
})
export class AdminService {

  // נתיב הבסיס ל-Backend. ודא שהוא תואם לכתובת השרת שלך.
  private baseUrl = 'http://localhost:8080/api'; 
  
  constructor(private http: HttpClient) { }

  /**
   * 1. Calls the backend to send a generic content warning notification to a post owner.
   * Corresponds to Java endpoint: POST /api/admin/sendPostOwnerWarningNotification/{postId}
   * * @param postId The ID of the post to warn about.
   * @returns An Observable for the HTTP operation.
   */

// קובץ: admin.service.ts

sendWarningNotification(postId: number): Observable<any> {
    const url = `${this.baseUrl}/post/admin/sendPostOwnerWarningNotification/${postId}`;
    
    // שימוש ב-{} (אובייקט ריק) כגוף הבקשה במקום null, 
    // כדי למנוע מ-Angular לחשוב שהוא צריך להתעלם מגוף הבקשה.
    // זה עוזר לוודא שכותרות ה-Content-Type נשלחות כראוי עבור POST,
    // אך זה לא פותר את ה-403 אם הבעיה היא ב-Cookie.
    const body = {}; 
    
    // 💡 הדבר החשוב ביותר: ודא שהאפשרויות { withCredentials: true } מועברות!
    return this.http.post(url, body, { withCredentials: true }); 
}
  /**
   * 2. Calls the backend to delete a post and send a notification to the owner.
   * Corresponds to Java endpoint: DELETE /api/post/postByPostId/{id} (אנו נשתמש ב-DELETE)
   * * הערה: בגלל שב-Java השתמשנו ב-DELETE עם התראה, נבנה פונקציה תואמת.
   * כדי שהשרת יבצע את שתי הפעולות (מחיקה + התראה), נצטרך לוודא שנקודת הקצה ב-Java
   * מוגדרת למעשה כך שתקרא לפונקציה המעודכנת `deletePostByPostId`.
   * * @param postId The ID of the post to delete and notify about.
   * @returns An Observable for the HTTP operation.
   */
  deletePostWithNotification(postId: number): Observable<any> {
    // הנתיב תלוי היכן הגדרת את הפונקציה בשרת (PostController או AdminController)
    // אם השתמשת בנתיב המקורי שלך: /api/post/postByPostId/{id}
    const url = `${this.baseUrl}/post/deletePostByPostId/${postId}`; 
    
    return this.http.delete(url, { withCredentials: true }); // שימוש ב-DELETE כנדרש ב-Java
  }
}