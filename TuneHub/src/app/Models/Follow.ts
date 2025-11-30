// src/app/Models/Follow.ts

export enum EFollowStatus {
  NONE = 'NONE',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  DENIED = 'DENIED'
  // CANCELED?, אם תרצי
}

export default interface Follow {
  id?: number;            // optional, כי כשמוסיפים חדש זה עדיין לא קיים
  followerId: number;      // המשתמש שעקף
  followingId: number;     // המשתמש שאחריו עוקבים
  status: EFollowStatus;   // סטטוס המעקב
  createdAt?: string;      // Timestamp ISO string, optional
}
