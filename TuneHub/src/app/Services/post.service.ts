import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import Post, { PostResponseDTO, PostUploadDTO } from '../Models/Post';

@Injectable({
    providedIn: 'root'
})


export class PostService {

    public posts: Post[] = [];
    public count = 0;
    private apiUrl = 'http://localhost:8080/api/post'; 
    constructor(private _httpClient: HttpClient) { }

    //Get
    getPostById(id: number): Observable<Post> {
        return this._httpClient.get<Post>(`${this.apiUrl}/postById/${id}`, { withCredentials: true } );
    }

    getPosts(): Observable<Post[]> {
        return this._httpClient.get<Post[]>(`${this.apiUrl}/posts`, { withCredentials: true } );
    }

    getPostsByUserId(id: number): Observable<Post[]> {
        return this._httpClient.get<Post[]>(`${this.apiUrl}/postsByUserId/${id}`, { withCredentials: true } );
    }


uploadPost(
    dto: { title: string; content: string; },
    images: File[] | null,
    audio: File | null,
    video: File | null
): Observable<PostResponseDTO> {
console.log("DTO I'm sending:", dto);
    const formData = new FormData();
    const blob = new Blob([JSON.stringify(dto)], { type: 'application/json' });
    formData.append('data', blob);

    if (images && images.length > 0) {
        for (const img of images) {
            formData.append('images', img, img.name);
        }
    }
    if (audio) formData.append('audio', audio, audio.name);
    if (video) formData.append('video', video, video.name);

    return this._httpClient.post<PostResponseDTO>(`${this.apiUrl}/uploadPost`, formData,  { withCredentials: true });
}
}





