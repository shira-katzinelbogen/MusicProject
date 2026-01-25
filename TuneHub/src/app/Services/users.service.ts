import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs'
import Users, {  UsersProfileCompleteDTO, UsersProfileDTO, EUserType } from '../Models/Users';
import Teacher from '../Models/Teacher';
import Role, { ERole } from '../Models/Role';

@Injectable({
    providedIn: 'root'
})

export class UsersService {
    private apiUrl = 'http://localhost:8080/api/users';
    public users: Users[] = [];
    public count = 0;

    constructor(private _httpClient: HttpClient) { }

    //Get
    getCurrentUserProfile(): Observable<UsersProfileDTO> {
        return this._httpClient.get<UsersProfileDTO>(`${this.apiUrl}/me`, { withCredentials: true });
    }
    getUserById(id: number): Observable<Users> {
        return this._httpClient.get<Users>(
            `${this.apiUrl}/userById/${id}`,
            { withCredentials: true }
        );
    }

    getMusicianById(id: number): Observable<Users> {
        return this._httpClient.get<Users>(`${this.apiUrl}/musicianById/${id}`, { withCredentials: true });
    }

    getCurrentUserMusicianDetails(): Observable<Users> {
        return this._httpClient.get<Users>(`${this.apiUrl}/currentUserMusicianDetails`, { withCredentials: true });
    }

    updateUserRole(userId: number, newRole: ERole): Observable<any> {
        const roleDto: Role = { name: newRole };
        return this._httpClient.put(
            `http://localhost:8080/api/role/admin/${userId}/role`,
            roleDto,
            { responseType: 'text', withCredentials: true }
        );
    }

    getActiveUsersCount(): Observable<number> {
        return this._httpClient.get<number>(`${this.apiUrl}/countActive`
        );
    }

    updateUser(data: Partial<Users>, file?: File): Observable<Users> {
        const formData = new FormData();

        formData.append('name', data.name || '');
        formData.append('email', data.email || '');
        formData.append('city', data.city || '');
        formData.append('country', data.country || '');
        formData.append('description', data.description || '');

        if (!file && data.imageProfilePath) {
            formData.append('imageProfilePath', data.imageProfilePath);
        }

        if (file) {
            formData.append('image', file);
        }

        return this._httpClient.put<Users>(
            `${this.apiUrl}/updateCurrentUser`,
            formData,
            { withCredentials: true }
        );
    }

    getUsers(): Observable<Users[]> {
        return this._httpClient.get<Users[]>(`${this.apiUrl}/users`, { withCredentials: true });
    }

    getMusicians(): Observable<Users[]> {
        return this._httpClient.get<Users[]>(`${this.apiUrl}/musicians`, { withCredentials: true });
    }

    getUsersByTeacherId(teacher_id: number): Observable<Users[]> {
        return this._httpClient.get<Users[]>(`${this.apiUrl}/usersByTeacherId/${teacher_id}`, { withCredentials: true })
    }


    getUsersByUserType(userType: EUserType): Observable<Users[]> {
        const url = `${this.apiUrl}/usersByUserType`; 

        const params = new HttpParams().set('userTypes', userType.toString());
        return this._httpClient.get<Users[]>(url, { params: params, withCredentials: true });
    }

    getUserByName(name: String): Observable<Users> {
        return this._httpClient.get<Users>(`${this.apiUrl}/userByName/${name}`, { withCredentials: true })
    }

    getUsersProfileImageDTO(id: number): Observable<Users[]> {
        return this._httpClient.get<Users[]>(`${this.apiUrl}/usersProfileImageDTO/${id}`, { withCredentials: true })
    }

    getUserProfileDTO(id: number): Observable<Users> {
        return this._httpClient.get<Users>(`${this.apiUrl}/users/${id}/dto`, { withCredentials: true });
    }

    signUpAsTeacher(userId: number, teacherData: Teacher): Observable<any> {
        return this._httpClient.post(`${this.apiUrl}/signupTeacher/${userId}`, teacherData, {
            responseType: 'text' as 'json' 
            , withCredentials: true
        });
    }

    updateUserType(userId: number, newType: EUserType): Observable<any> {

        return this._httpClient.put<any>(
            `${this.apiUrl}/update-user-type/${userId}/${newType}`,
            null,
            { withCredentials: true }

        );
    }

    updateCurrentUserTypeToMusician(): Observable<any> {

        return this._httpClient.put<any>(
            `${this.apiUrl}/currentUserTypeToMusician`,
            null,
            { withCredentials: true }

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
            {},
            {
                responseType: 'text',
                withCredentials: true
            }
        );
    }

    updateProfile(userId: number, profileData: any): Observable<Users> {
        return this._httpClient.put<Users>(`${this.apiUrl}/updateUser/${userId}`, profileData);
    }

    isOwnProfile(userId: number): Observable<boolean> {
        return this._httpClient.get<boolean>(`${this.apiUrl}/isOwn/${userId}`, { withCredentials: true });
    }

    getProfileComplete(id: number): Observable<UsersProfileCompleteDTO> {
        return this._httpClient.get<UsersProfileCompleteDTO>(`${this.apiUrl}/profile-complete/${id}`, { withCredentials: true });
    }

    joinTeacher(studentId: number): Observable<any> {
        return this._httpClient.put(
            `${this.apiUrl}/joinTeacher/${studentId}`,
            null,
            { withCredentials: true }
        );
    }

    deleteUser(id: number): Observable<any> {
        return this._httpClient.delete(`${this.apiUrl}/delete/${id}`, { withCredentials: true });
    }
}