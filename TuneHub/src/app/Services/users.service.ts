
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs'
import Users, { UserType } from '../Models/Users';

@Injectable({
    providedIn: 'root'
})

export class UsersService {

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

    getUsersProfileImageDTO(id:number): Observable<Users[]> {
        return this._httpClient.get<Users[]>(`http://localhost:8080/api/users/usersProfileImageDTO/${id}`)
    }

    





}