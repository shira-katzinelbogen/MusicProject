
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs'
import Users, { UserType } from '../Models/Users';

@Injectable({
    providedIn: 'root'
})

export class UsersService {

    private apiUrl = 'http://localhost:8080/api/users';
    public users: Users[] = [];
    public count = 0;

    constructor(private _httpClient: HttpClient) { }

    //Get
    getUserById(id: number): Observable<Users> {
        return this._httpClient.get<Users>(`http://localhost:8080/api/users/userById/${id}`);
    }

    getMusicianById(id: number): Observable<Users> {
        return this._httpClient.get<Users>(`http://localhost:8080/api/users/musicianById/${id}`);
    }

 updateUser(userId: number, data: Partial<Users>, file?: File): Observable<Users> {
    const formData = new FormData();
    formData.append('name', data.name || '');
    formData.append('email', data.email || '');
    formData.append('city', data.city || '');
    formData.append('country', data.country || '');
    formData.append('description', data.description || '');
    if (file) {
      formData.append('image', file);
    }

    return this._httpClient.put<Users>(`${this.apiUrl}/${userId}`, formData);
  }


    getUsers(): Observable<Users[]> {
        return this._httpClient.get<Users[]>(`http://localhost:8080/api/users/users`);
    }

    getMusicians(): Observable<Users[]> {
        return this._httpClient.get<Users[]>(`http://localhost:8080/api/users/musicians`);
    }

    getUsersByTeacherId(teacher_id: number): Observable<Users[]> {
        return this._httpClient.get<Users[]>(`http://localhost:8080/api/users/usersByTeacherId/${teacher_id}`)
    }

    getUsersByUserType(user_type: UserType): Observable<Users[]> {
        return this._httpClient.get<Users[]>(`http://localhost:8080/api/users/usersByUserType/${user_type}`)
    }

    getUserByName(name: String): Observable<Users> {
        return this._httpClient.get<Users>(`http://localhost:8080/api/users/userByName/${name}`)
    }

    getUsersProfileImageDTO(id: number): Observable<Users[]> {
        return this._httpClient.get<Users[]>(`http://localhost:8080/api/users/usersProfileImageDTO/${id}`)
    }


    signIn(credentials: any): Observable<any> {
        return this._httpClient.post(`${this.apiUrl}/signIn`, {
            name: credentials.name,
            password: credentials.password
        }, { withCredentials: true });
    }
    signOut(): Observable<any> {
        return this._httpClient.post(`${this.apiUrl}/signOut`, {}, {
            responseType: 'text' // שינוי חשוב: השרת מחזיר מחרוזת גולמית
        });
    }

    
    // ב-Backend זה צריך לנקות את ה-Token/Session
  
  
  // -----------------------------------------------------------
  // 2. דוגמה לפונקציה לעריכת פרופיל (לשימוש עתידי)
  // -----------------------------------------------------------
  updateProfile(userId: number, profileData: any): Observable<Users> {
    // ⚠️ נתיב לדוגמה - ודא שהוא תואם ל-Backend שלך!
    return this._httpClient.put<Users>(`${this.apiUrl}/${userId}/profile`, profileData);
  }


}