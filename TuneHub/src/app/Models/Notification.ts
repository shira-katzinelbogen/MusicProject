import { ERole } from "./Users";

export interface UsersProfileDTO {
    id: number;         
    name: string;
    imageProfilePath: string;
    roles: ERole[];      
}

 export enum ENotificationCategory {
    FOLLOW_UPDATES = 'FOLLOW_UPDATES',
    COMMENTS = 'COMMENTS',
    LIKES_FAVORITES = 'LIKES_FAVORITES',
    APPROVED_FOLLOWS = 'APPROVED_FOLLOWS',
    FOLLOW_REQUESTS = 'FOLLOW_REQUESTS',
    ADMIN = 'ADMIN'
}

export interface NotificationResponseDTO {
    id: number;
    title: string;
    message: string;
    createdAt: string; 
    isRead: boolean;
    type: ENotificationCategory;
    targetId?: number;
    actor?: UsersProfileDTO;  
}

export interface NotificationCategory {
    key: ENotificationCategory | 'ALL';
    label: string;
}
