
import { HttpClient } from '@angular/common/http';
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



    // getCommentsByPostId(id: number): Observable<Teacher[]> {
    //     return this._httpClient.get<Teacher[]>(`http://localhost:8080/api/comment/commentsByPostId/${id}`)
    // }

}