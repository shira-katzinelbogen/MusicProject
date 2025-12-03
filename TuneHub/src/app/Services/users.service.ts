
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs'
import Users, { ERole, UserType } from '../Models/Users';
import Teacher from '../Models/Teacher';
import Role from '../Models/Role';

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
        // הוספת הקונפיגורציה הנכונה
        return this._httpClient.get<Users>(
            `http://localhost:8080/api/users/userById/${id}`, 
            { withCredentials: true } // ⬅️ הפתרון הוא כאן!
        );
    }

    getMusicianById(id: number): Observable<Users> {
        return this._httpClient.get<Users>(`http://localhost:8080/api/users/musicianById/${id}`);
    }

    joinTeacher(studentId: number, teacherId: number): Observable<any> {
    return this._httpClient.put(`http://localhost:8080/api/users/joinTeacher/${studentId}/${teacherId}`, {});
  }

public updateUserRole(userId: number, newRole: ERole): Observable<any> {
    const roleDto: Role = { name: newRole }; 
    return this._httpClient.put(
        `http://localhost:8080/api/role/admin/${userId}/role`, 
        roleDto, 
        { responseType: 'text', withCredentials: true }
    ); 
}


getActiveUsersCount(): Observable<number> {
  return this._httpClient.get<number>('/api/users/count-active');
}
    
updateUser(userId: number, data: Partial<Users>, file?: File): Observable<Users> {
  const formData = new FormData();
  
  // הוספת שדות הטופס
  formData.append('name', data.name || '');
  formData.append('email', data.email || '');
  formData.append('city', data.city || '');
  formData.append('country', data.country || '');
  formData.append('description', data.description || '');

        // הוספת שדות הטופס
        

        // 💡 חשוב: אם לא נבחר קובץ חדש, אנו צריכים לשלוח את הנתיב הישן 
        // (מה שמאוחסן ב-imageProfilePath בטופס) כדי שה-Backend יידע לא למחוק אותו
        if (!file && data.imageProfilePath) {
            formData.append('imageProfilePath', data.imageProfilePath);
        }

        // הוספת הקובץ אם נבחר חדש
        if (file) {
            formData.append('image', file);
        }

        // נשנה את הכתובת ל־endpoint שיודע לקבל Multipart/FormData (נניח '/update-with-image')
        return this._httpClient.put<Users>(`${this.apiUrl}/updateUser/${userId}`, formData);
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

    
    getUsersByUserType(userType: UserType): Observable<Users[]> {
    const url = `http://localhost:8080/api/users/usersByUserType`; // הנתיב ללא המשתנה
    
    const params = new HttpParams().set('userTypes', userType.toString()); 
    // 2. ביצוע הקריאה עם הפרמטרים
    return this._httpClient.get<Users[]>(url, { params: params }); 
}

    getUserByName(name: String): Observable<Users> {
        return this._httpClient.get<Users>(`http://localhost:8080/api/users/userByName/${name}`)
    }

    getUsersProfileImageDTO(id: number): Observable<Users[]> {
        return this._httpClient.get<Users[]>(`http://localhost:8080/api/users/usersProfileImageDTO/${id}`)
    }

    // הפונקציה החדשה
    getUserProfileDTO(id: number): Observable<Users> {
        return this._httpClient.get<Users>(`${this.apiUrl}/users/${id}/dto`);
    }

signUpAsTeacher(userId: number, teacherData: Teacher): Observable<any> {
    // 🎯 הפתרון: הוספת אובייקט אופציות עם responseType: 'text'
    return this._httpClient.post(`${this.apiUrl}/signupTeacher/${userId}`, teacherData, {
        responseType: 'text' as 'json' // יש להשתמש ב- 'text'
    });
}


  // src/app/Services/users.service.ts
updateUserType(userId: number, newType: UserType): Observable<any> {
   const options = {
        withCredentials: true // <== חובה גם כאן!
    };
        return this._httpClient.put<any>(
            `http://localhost:8080/api/users/update-user-type/${userId}/${newType}`, 
            null, // אין צורך בגוף לבקשת PUT זו
        options
        );
    }
  
    signIn(credentials: any): Observable<any> {
        return this._httpClient.post(`${this.apiUrl}/signIn`, {
            name: credentials.name,
            password: credentials.password
        }, { withCredentials: true });
    }

signOut(): Observable<any> {
  return this._httpClient.post(
    `${this.apiUrl}/signOut`,
    {}, // גוף הבקשה
    {
      responseType: 'text',
      withCredentials: true
    }
  );
}

deleteUser(userId: number): Observable<any> {
        return this._httpClient.delete(`${this.apiUrl}/delete/${userId}`);
    }

//     refreshToken(): Observable<any> {
//     // 🎯 קורא לנקודת הקצה החדשה שיצרנו ב-Backend
//     // ה-Backend משתמש בקוקיז כדי לזהות את ה-Refresh Token
//     return this._httpClient.post('http://localhost:8080/api/users/refreshtoken', {}, { 
//         withCredentials: true // חובה לשלוח את הקוקיז
//     });
// }

    // ב-Backend זה צריך לנקות את ה-Token/Session


    // -----------------------------------------------------------
    // 2. דוגמה לפונקציה לעריכת פרופיל (לשימוש עתידי)
    // -----------------------------------------------------------
    updateProfile(userId: number, profileData: any): Observable<Users> {
        return this._httpClient.put<Users>(`${this.apiUrl}/updateUser/${userId}`, profileData);
    }


}