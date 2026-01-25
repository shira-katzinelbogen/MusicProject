import { Injectable } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

@Injectable({
    providedIn: 'root'
})

export class FileUtilsService {

    constructor(private sanitizer: DomSanitizer) { }

    getImageUrl(base64?: string): SafeUrl | string {
        if (base64?.trim()) {
            const mime = base64.startsWith('/9j/') ? 'jpeg' : 'png';
            return this.sanitizer.bypassSecurityTrustUrl(`data:image/${mime};base64,${base64}`);
        }
        return 'assets/images/sheets_music.webp';
    }

    getPDFUrl(base64: string): SafeResourceUrl {
        return this.sanitizer.bypassSecurityTrustResourceUrl(`data:application/pdf;base64,${base64}`);
    }

    getMediaUrl(path?: string): SafeUrl {
        if (path && path.trim()) {

            return this.sanitizer.bypassSecurityTrustResourceUrl(path);
        }
        return '';
    }
}