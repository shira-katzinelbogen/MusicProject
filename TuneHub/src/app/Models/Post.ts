import Users from "./Users";

// export interface UserProfileDTO {
//     id: number;
//     name: string;
//     imageProfilePath: string;
// }
// export interface PostMedia {
//     id?: number; 
//     type: 'AUDIO' | 'VIDEO' | 'IMAGE' | string; // התאמה ל-ENUM/String ב-Java
//     url?: string; // השרת ימלא שדה זה לאחר השמירה
// }

export interface PostResponseDTO {
    id?: number;
    userId?: number;
    title: string;
    content?: string;
    hearts?: number;
    likes?: number;
    audioPath?: string | null;      // שם הקובץ (או נתיב) של האודיו
    videoPath?: string | null;      // שם הקובץ (או נתיב) של הווידאו
    imagesBase64?: string[];        // רשימת תמונות בפורמט Base64
    dateUploaded: string;          // תאריך העלאה
    // ייתכן שיש צורך להוסיף שדות נוספים כמו 'user' אם הם חוזרים מהשרת
}

export interface PostUploadDTO {
    userid:number;
    title: string;
    content: string;
    // id: number;

    // ייתכן שיש להוסיף כאן מזהה משתמש או שדות נוספים הנדרשים ליצירת הפוסט
    // לדוגמה: userId: number;
}
export default class Post {
    id?: number;
    user?: Users;
    content?: string;
    hearts?: number;
    likes?: number;
    audio?: string;
    video?: string;
    dateUploaded?: Date;
    comments?: Comment[];
    imagesPath?: string;
    audiosPath?: string;
    usersFavorite?: Users[];
}