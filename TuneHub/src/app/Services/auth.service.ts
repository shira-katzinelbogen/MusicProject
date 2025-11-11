// auth.service.ts

import { Injectable } from "@angular/core";
import { HeartbeatService } from "./heartbeat.service";

// ... ייבוא רכיבים

@Injectable({
providedIn: 'root'
})
export class AuthService {
    
    constructor(private heartbeatService: HeartbeatService) {}
    
    logout(): void {
        // 1. עצור את הטיימר בצד הלקוח
        this.heartbeatService.stopHeartbeat(); 
        
        // 2. שלח בקשת ניתוק לשרת (אם יש כזו) כדי לנקות את הטוקנים
        // 3. נקה טוקנים מה-localStorage/Cookies
        // 4. נווט מחדש לדף הבית
    }
    
    public getAccessToken(): string | null {
        // התאם את זה למקום שבו אתה שומר בפועל את הטוקן שלך!
        const token = localStorage.getItem('access_token'); 
        
        // החזרת הטוקן או null אם לא נמצא
        return token; 
    }
}