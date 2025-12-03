import Instrument from './Instrument'; 
import Post from './Post';
import SheetMusic from './SheetMusic';
import type Teacher from './Teacher';
import Comment from './Comment';


export enum ERole {
    ROLE_USER = 'ROLE_USER',
    ROLE_ADMIN = 'ROLE_ADMIN',
    ROLE_SUPER_ADMIN = 'ROLE_SUPER_ADMIN',
}


export enum UserType {
    STUDENT = 'STUDENT',
    MANAGER = 'MANAGER',
    TEACHER = 'TEACHER',
    MUSIC_LOVER = 'MUSIC_LOVER',
    MUSICIAN = 'MUSICIAN'
}

export interface UsersProfileDTO {
    id: number;
    name: string;
    imageProfilePath: string;
    roles: ERole[];
}


export interface UsersSignUpDTO {
    name: string;
    email: string;
    password: string;
    imageProfilePath?: string;
}


export interface Profile {
    id: number,
    name: string;
    email: string;
    imageProfilePath?: string;
    city: string,
    country: string,
    website: string
}



export default class Users {
    profile?: {
        id?: number,
        name?: string,
        imageProfilePath?: string,
        roles?: string[]
    }

    roles?: ERole[];
    id?: number;
    imageProfilePath?: string;
    name?: string;
    password?: string;
    email?: string;
    description?: string;
    userTypes?: UserType[];
    createdAt?: Date | string;
    editedIn?: Date;
    active?: boolean;
    city?: string;
    country?: string;
    rating?: number;
    followers?: Users[];
    following?: Users[];
    instrumentsUsers?: Instrument[];
    teacher?: Teacher;
    sheetsMusic?: SheetMusic[];
    posts?: Post[];
    comments?: Comment[];
    favoriteSheetsMusic?: SheetMusic[];
    favoritePosts?: Post[];
}



