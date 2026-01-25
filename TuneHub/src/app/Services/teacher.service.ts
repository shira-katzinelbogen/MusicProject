
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
  private apiUrl = 'http://localhost:8080/api/teacher';

  //Get
  getTeacherById(id: number): Observable<Teacher> {
    return this._httpClient.get<Teacher>(`${this.apiUrl}/teacherById/${id}`);
  }

  getTeachers(): Observable<Teacher[]> {
    return this._httpClient.get<Teacher[]>(`${this.apiUrl}/teachers`);
  }

  getTeachersByName(name: String): Observable<Teacher[]> {
    return this._httpClient.get<Teacher[]>(`${this.apiUrl}/teachersByName/${name}`)
  }

  getTeachersByInstrumentsId(Instruments_id: number): Observable<Teacher[]> {
    return this._httpClient.get<Teacher[]>(`${this.apiUrl}/teacherByInstrumentsId/${Instruments_id}`)
  }


  getUsersByUserType(userType: string): Observable<any[]> {
    return this._httpClient.get<any[]>(`http://localhost:8080/api/users/usersByUserType/${userType}`);
  }


  getTeachersByExprience(experience: number): Observable<Teacher[]> {
    return this._httpClient.get<Teacher[]>(`${this.apiUrl}/teacherByExperience/${experience}`)
  }

  getTeachersByPricePerLesson(pricePerLesson: number): Observable<Teacher[]> {
    return this._httpClient.get<Teacher[]>(`${this.apiUrl}/teacherByPricePerLesson/${pricePerLesson}`)
  }
  getTeachersByAddress(address: number): Observable<Teacher[]> {
    return this._httpClient.get<Teacher[]>(`${this.apiUrl}/teacherByAddress/${address}`)
  }
  getTeachersByLessonDuration(lesson_duration: number): Observable<Teacher[]> {
    return this._httpClient.get<Teacher[]>(`${this.apiUrl}/teacherByLessonDuration/${lesson_duration}`)
  }

  getTeachersByRating(rating: number): Observable<Teacher[]> {
    return this._httpClient.get<Teacher[]>(`${this.apiUrl}/teacherByRating/${rating}`)
  }


  filterTeachers(filters: any): Observable<Teacher[]> {
    let params = new HttpParams();

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
    if (filters.searchQuery) {
      params = params.append('search', filters.searchQuery);
    }

    return this._httpClient.get<Teacher[]>(`${this.apiUrl}/filter`, { params: params });
  }

  getAllCities(): Observable<string[]> {
    return this._httpClient.get<string[]>(`${this.apiUrl}/cities`);
  }

  getAllCountries(): Observable<string[]> {
    return this._httpClient.get<string[]>(`${this.apiUrl}/countries`);
  }
}