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
    rating?: number;
    isLiked?: boolean;
    isFavorite?: boolean;
    safeImages?: string[]; 
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
    dateUploaded: string; 
       isLiked?: boolean;
    isFavorite?: boolean;
    
}

export interface PostUploadDTO {
    title: string;
    content: string;
}