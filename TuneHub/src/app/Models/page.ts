// ממשק זה מייצג את מבנה הנתונים המוחזר מ-Spring Data Page
// הוא הכרחי כדי שה-NotificationService יוכל לטפל בתגובת השרת
export interface Page<T> {
    content: T[]; // רשימת הפריטים בפועל (במקרה שלנו: NotificationResponseDTO)
    totalPages: number;
    totalElements: number;
    size: number;
    number: number; // מספר העמוד הנוכחי (מתחיל מ-0)
    numberOfElements: number;
    first: boolean;
    last: boolean;
    empty: boolean;
}