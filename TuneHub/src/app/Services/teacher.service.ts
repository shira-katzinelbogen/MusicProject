
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import Teacher from '../Models/Teacher';

@Injectable({
    providedIn: 'root'
})

export class TeacherService {

    public teachers: Teacher[] = [];
    public count = 0;

    constructor(private _httpClient: HttpClient) { }
    private apiUrl = 'http://localhost:8080/api/teachers'; // או /api/users, תלוי היכן ה-Controller שלך

    //Get
    getTeacherById(id: number): Observable<Teacher> {
        return this._httpClient.get<Teacher>(`http://localhost:8080/api/teacher/teacherById/${id}`);
    }

    getTeachers(): Observable<Teacher[]> {
        return this._httpClient.get<Teacher[]>(`http://localhost:8080/api/teacher/teachers`);
    }

    getTeachersByName(name: String): Observable<Teacher[]> {
        return this._httpClient.get<Teacher[]>(`http://localhost:8080/api/teacher/teachersByName/${name}`)
    }

    getTeachersByInstrumentsId(Instruments_id: number): Observable<Teacher[]> {
        return this._httpClient.get<Teacher[]>(`http://localhost:8080/api/teacher/teacherByInstrumentsId/${Instruments_id}`)
    }


    getUsersByUserType(userType: string): Observable<any[]> {
  return this._httpClient.get<any[]>(`http://localhost:8080/api/users/usersByUserType/${userType}`);
}


    getTeachersByExprience(experience: number): Observable<Teacher[]> {
        return this._httpClient.get<Teacher[]>(`http://localhost:8080/api/teacher/teacherByExperience/${experience}`)
    }

    getTeachersByPricePerLesson(pricePerLesson: number): Observable<Teacher[]> {
        return this._httpClient.get<Teacher[]>(`http://localhost:8080/api/teacher/teacherByPricePerLesson/${pricePerLesson}`)
    }
    getTeachersByAddress(address: number): Observable<Teacher[]> {
        return this._httpClient.get<Teacher[]>(`http://localhost:8080/api/teacher/teacherByAddress/${address}`)
    }
    getTeachersByLessonDuration(lesson_duration: number): Observable<Teacher[]> {
        return this._httpClient.get<Teacher[]>(`http://localhost:8080/api/teacher/teacherByLessonDuration/${lesson_duration}`)
    }

     getTeachersByRating(rating: number): Observable<Teacher[]> { //אמור להיות DOUBLE   לראות אךי עושים את זה
        return this._httpClient.get<Teacher[]>(`http://localhost:8080/api/teacher/teacherByRating/${rating}`)
    }


filterTeachers(filters: any): Observable<Teacher[]> { // ✅ החזרת Observable<TeacherListingDTO[]>
    let params = new HttpParams();

    // 🎯 בניית פרמטרי שאילתה (כפי שמוצג)
    if (filters.city) {
      params = params.append('city', filters.city);
    }
    if (filters.country) {
      params = params.append('country', filters.country);
    }
    if (filters.priceRange) {
      params = params.append('priceRange', filters.priceRange);
    }
    if (filters.duration) {
      params = params.append('duration', filters.duration.toString());
    }
    if (filters.experience) {
      params = params.append('experience', filters.experience);
    }
    if (filters.instrumentId) {
      params = params.append('instrumentId', filters.instrumentId.toString());
    }
    // 💡 ודא שאתה משתמש ב-searchQuery כפי שקראת לו באובייקט ה-filters
    if (filters.searchQuery) {
      params = params.append('search', filters.searchQuery); 
    }
    
    // ✅ קריאה רגילה: ללא responseType: 'text', מאחר ואנו מצפים ל-JSON תקין
    return this._httpClient.get<Teacher[]>(`${this.apiUrl}/filter`, { params: params });
  }

    getAllCities(): Observable<string[]> {
        return this._httpClient.get<string[]>(`${this.apiUrl}/cities`);
    }

    /** * שליפת רשימת המדינות מה-Backend (שליפה מהקבועים ב-Java).
     * (קריאה ל-GET /api/teachers/countries)
     */
    getAllCountries(): Observable<string[]> {
        return this._httpClient.get<string[]>(`${this.apiUrl}/countries`);
    }

    // getCommentsByPostId(id: number): Observable<Teacher[]> {
    //     return this._httpClient.get<Teacher[]>(`http://localhost:8080/api/comment/commentsByPostId/${id}`)
    // }

}