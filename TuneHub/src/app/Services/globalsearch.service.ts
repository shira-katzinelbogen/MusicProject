import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalSearchResponseDTO } from '../Models/globalSearch';


@Injectable({
  providedIn: 'root'
})
export class GlobalSearchService {

  private apiUrl = 'http://localhost:8080/api/search/global';

  constructor(private http: HttpClient) {}

  search(term: string): Observable<GlobalSearchResponseDTO> {
    return this.http.get<GlobalSearchResponseDTO>(`${this.apiUrl}/${term}`, { withCredentials: true });
  }
}
