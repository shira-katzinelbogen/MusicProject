import Instrument from './Instrument';
import Post from './Post';
import SheetMusic from './SheetMusic';
import type Teacher from './Teacher';
import Comment from './Comment';
import Role, { ERole } from './Role';


export enum EUserType {
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
    roles: Role[];
    userTypes?: EUserType[];
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

    roles?: Role[];
    id?: number;
    imageProfilePath?: string;
    name?: string;
    password?: string;
    email?: string;
    description?: string;
    userTypes?: EUserType[];
    createdAt?: Date | string;
    editedIn?: Date;
    isActive?: boolean;
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



export interface UsersProfileCompleteDTO {
    id: number;
    name: string;
    email: string;
    createdAt: string;
    editedIn: string;
    active: boolean;
    description: string;
    rating: number;
    city: string;
    country: string;
    imageProfilePath: string;
    userTypes: string[];
    instruments: InstrumentResponseDTO[];
    sheetsMusic: SheetMusic[];
    posts: Post[];
    teacher: UsersProfileDTO;
    ownProfile: boolean;
    canBeMyStudent: boolean;
    myStudent: boolean;
    canEditRoles: boolean;
    canDelete: boolean;
    teacherDetails?: TeacherListingDTO;
    totalLikes: number;
    totalHearts: number;
    totalCommentsWritten: number;
    totalCommentsReceived: number;
}

export interface InstrumentResponseDTO {
    id: number;
    name: string;
}


export interface TeacherListingDTO {
    id: number;
    pricePerLesson: number;
    experience: number;
    lessonDuration: number;
    instruments: InstrumentResponseDTO[];
    students: UsersProfileDTO[];
}
