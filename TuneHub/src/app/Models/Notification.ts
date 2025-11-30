import { ERole } from "./Users";

export interface UsersProfileDTO {
    id: number;           // String ב-Java, עדיף להשתמש ב-number ב-TS
    name: string;
    imageProfilePath: string;
    roles: ERole[];       // Set<Role> ב-Java
}

 export enum ENotificationCategory {
    FOLLOW_UPDATES = 'FOLLOW_UPDATES',
    COMMENTS = 'COMMENTS',
    LIKES_FAVORITES = 'LIKES_FAVORITES',
    APPROVED_FOLLOWS = 'APPROVED_FOLLOWS',
    FOLLOW_REQUESTS = 'FOLLOW_REQUESTS',
    ADMIN = 'ADMIN'
    //    SYSTEM_ANNOUNCEMENT,
}



export interface NotificationResponseDTO {
    id: number;
    title: string;
    message: string;
    createdAt: string; // או Date, תלוי ב-Pipe שלך
    isRead: boolean;
    type: ENotificationCategory;
    targetId?: number;
    actor?: UsersProfileDTO;  // מי יזם את ההתראה
}

export interface NotificationCategory {
    key: ENotificationCategory | 'ALL';
    label: string;
}
