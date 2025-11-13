import Users, { UsersProfileDTO } from "./Users";
export default class Post {
    id?: number;
    user?: Users;
    content?: string;
    hearts?: number;
    likes?: number;
    dateUploaded?: Date;
    comments?: Comment[];
    imagesBase64?: string[];
    usersFavorite?: Users[];
    audioPath?: string;
    videoPath?: string;
    title?: string;

    safeImages?: string[]; // ודא שאתחלת את המערך


}

export interface PostResponseDTO {
    id: number;
    user: UsersProfileDTO;
    title: string;
    content: string;
    hearts: number;
    likes: number;
    audioPath?: string;
    videoPath?: string;
    imagesBase64?: string[];
    dateUploaded: string; // מגיע כמחרוזת
}

export interface PostUploadDTO {
    userId: number;
    title: string;
    content: string;
}