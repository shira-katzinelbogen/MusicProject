import Instrument from "./Instrument";
import Post from "./Post";
import sheetMusic from "./SheetMusic";
import Teacher from "./Teacher";

export enum UserType {
    STUDENT,
    MANAGER,
    TEACHER,
    MUSIC_LOVER
}

export default class Users {
  
profile?:{
    id?: number;
    imageProfilePath?: string;
    name?: string;
}
     id?: number;
    imageProfilePath?: string;
    name?: string;

    password?: string;
    email?: string;
    description?: string;
    userType?: UserType;
    createdAt?: Date;
    editedIn?: Date;
    active?: boolean;
    city?: string;
    country?: string;
    followers?: Users[];
    following?: Users[];
    instrumentsUsers?: Instrument[];
    teacher?: Teacher;

    sheetsMusic?: sheetMusic[];
    posts?: Post[];
    comments?: Comment[];
    favoriteSheetsMusic?: sheetMusic[];
    favoritePosts?: Post[];

   
}


