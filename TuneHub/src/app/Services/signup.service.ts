import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface SignupRequest {
  name: string;
  password: string;
  email: string;
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
    const formData: FormData = new FormData();
    const userBlob = new Blob([JSON.stringify(data)], { type: 'application/json' });

    formData.append('profile', userBlob);

    if (imageFile) {
      formData.append('image', imageFile, imageFile.name);
    } else {
      formData.append('image', new Blob(), 'null');
    }
    return this.http.post(`${this.apiUrl}/signUp`, formData);
  }
}

