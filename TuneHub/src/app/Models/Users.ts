import Instrument from './Instrument'; // מניח שהממשק הזה קיים
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
    MUSICIANS = 'MUSICIANS'
}

// --------------------------------------------------------------------------

/**
 * 1. UsersProfileDTO (Java)
 * מייצג את המידע הבסיסי של המשתמש שמוצג ברשימות או בכרטיסיות
 */
export interface UsersProfileDTO {
    id: number;           // String ב-Java, עדיף להשתמש ב-number ב-TS
    name: string;
    imageProfilePath: string;
    roles: ERole[];       // Set<Role> ב-Java
}


// --------------------------------------------------------------------------

/**
 * 2. UsersMusiciansDTO (Java)
 * מייצג פרטים נוספים על פרופיל משתמש
 */
// export interface UsersMusiciansDTO {
//     profile: UsersProfileDTO;      // משתמש ב-DTO שהוגדר למעלה
//     city: string;
//     country: string;
//     active: boolean;
//     description: string;
//     instruments: InstrumentResponseDTO; // מניח שזה InstrumentResponseDTO
//     EUserType: UserType;
// }

// --------------------------------------------------------------------------

/**
 * 3. UsersSignUpDTO (Java)
 * מייצג את הנתונים הנשלחים בעת הרשמה חדשה
 */
export interface UsersSignUpDTO {
    name: string;
    email: string;
    password: string;
    imageProfilePath?: string; // אופציונלי להרשמה
}


export interface Profile  {
    id:number,
    name: string;
    email: string;
    imageProfilePath?: string;
    //   roles: string[] // אופציונלי להרשמה
     
    
    //   handle: 'sarahjmusic',
      city: string,
      country: string,
      website: string
    
}


// --------------------------------------------------------------------------

/**
 * 4. Users (Class/Interface במקור)
 * המבנה המלא של אובייקט משתמש (בדרך כלל כששולפים אותו מה-DB)
 */
export default class Users {
    // השדות הללו נראו ככפילות במקור, נשלב אותם:
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
    createdAt?: Date  | string;
    editedIn?: Date;
    active?: boolean;
    city?: string;
    country?: string;
    rating?: number;
    
    // רשימות
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



