import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

// הגדרת הממשק לנתונים הנשלחים
export interface SignupRequest {
  name: string;
  password: string;
  email: string;
  //לבדוק לגבי זה
  imageProfilePath: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class SignupService {
  private apiUrl = 'http://localhost:8080/api/users';
  private http = inject(HttpClient);

  constructor() { }

  signup(data: SignupRequest, imageFile: File | null): Observable<any> {

    // יצירת אובייקט FormData כדי לאפשר שליחת קובץ ו-JSON יחד
    const formData: FormData = new FormData();
    const userBlob = new Blob([JSON.stringify(data)], { type: 'application/json' });

    formData.append('profile', userBlob);

    if (imageFile) {
      formData.append('image', imageFile, imageFile.name);
    } else {
      // שולח חלק 'image' ריק (כמו מחרוזת ריקה) במקום קובץ.
      // זה מבטיח שהבקשה היא תמיד multipart/form-data עם שני חלקים.
      formData.append('image', new Blob(), 'null');
    }
    return this.http.post(`${this.apiUrl}/signUp`, formData);
  }
}

