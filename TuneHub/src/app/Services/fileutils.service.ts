import { Injectable } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})

export class FileUtilsService {

    constructor(private sanitizer: DomSanitizer) { }

    // 1. תמונות (Base64) - מתאים לרוב המקרים
    getImageUrl(base64?: string): SafeUrl | string {
        if (base64?.trim()) {
            // זיהוי סוג MIME לפי התחלת ה-Base64 (רוב הזמן זה jpeg או png)
            const mime = base64.startsWith('/9j/') ? 'jpeg' : 'png';
            return this.sanitizer.bypassSecurityTrustUrl(`data:image/${mime};base64,${base64}`);
        }
        return 'assets/images/2.jpg'; // תמונת ברירת מחדל
    }


    // 2. קובצי PDF (Base64)
    // getPDFUrl(base64?: string): SafeUrl {
    //     if (base64 && base64.trim()) {
    //         const pdfUrl = `data:application/pdf;base64,${base64}`;
    //         // שימוש ב-ResourceUrl מאפשר שימוש בכתובות URL בתוך iframe/embed
    //         return this.sanitizer.bypassSecurityTrustResourceUrl(pdfUrl);
    //     }
    //     return '';
    // }

      // 1. תמונות (Base64) - מתאים לרוב המקרים
    // getImageUrl(base64?: string): SafeUrl | string {
    //     if (base64?.trim()) {
    //         // זיהוי סוג MIME לפי התחלת ה-Base64 (רוב הזמן זה jpeg או png)
    //         const mime = base64.startsWith('/9j/') ? 'jpeg' : 'png';
    //         return this.sanitizer.bypassSecurityTrustUrl(`data:image/${mime};base64,${base64}`);
    //     }
    //     return 'assets/images/2.jpg'; // תמונת ברירת מחדל
    // }

    getPDFUrl(fileName: string): string {
    return `/api/sheetMusic/docs/${fileName}`; // מחזיר את ה-URL הישיר ל-PDF
}

    // 3. ✅ הוספה: טיפול בנתיבי וידאו ושמע (URL רגיל)
    // אם השרת מחזיר URL/נתיב רגיל (לא Base64), עדיין נדרשת טיהור אבטחה.
    getMediaUrl(path?: string): SafeUrl {
        if (path && path.trim()) {
            // עבור וידאו ושמע ב-HTML5, צריך להשתמש ב-ResourceUrl או ב-Url.
            // ResourceUrl מתאים יותר אם מדובר בשימוש במשאב חיצוני או בתוך <embed>.
            // אם זה רק לשדה 'src' של <video> / <audio>, אפשר להשתמש ב-Url.
            // נשתמש ב-ResourceUrl כברירת מחדל לאבטחה מרבית.
            return this.sanitizer.bypassSecurityTrustResourceUrl(path);
        }
        return '';
    }
    // return this.sanitizer.bypassSecurityTrustResourceUrl(`http://localhost:8080/api/sheetMusic/documents/${path}`);
}