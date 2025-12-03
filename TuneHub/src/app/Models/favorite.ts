export type FavoriteType = 'POST' | 'SHEET_MUSIC' | 'USER' | 'MUSICIAN'; // שימוש ב-Enum של השרת

// מודל כללי למועדף
export interface Favorite {
  id: number; // ID של הרשומה בטבלת Favorites
  targetType: FavoriteType; // סוג המועדף (POSTS, TEACHERS, וכו')
  targetId: number; // ה-ID של הפוסט/מורה/מוזיקאי
  createdAt: Date; 
  
  // 🚨 שדה זה יחזיק את כל הנתונים של הישות המועדפת (למשל, כל הנתונים של PostResponseDTO)
  // נניח שהשרת ימיר את הישות המועדפת ל-DTO כללי
  details: any; 
}