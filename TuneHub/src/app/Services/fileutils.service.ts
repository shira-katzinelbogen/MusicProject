import { Injectable } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';


@Injectable({
    providedIn: 'root'
})
export class FileUtilsService {
    constructor(private sanitizer: DomSanitizer) { }

    getImageUrl(base64?: string): SafeUrl {
        if (base64 && base64.trim()) {
            const imageUrl = `data:image/png;base64,${base64}`;
            return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
        }
        return 'assets/images/2.jpg';
    }

    getPDFUrl(base64?: string): SafeUrl {
    if (base64 && base64.trim()) {
        const pdfUrl = `data:application/pdf;base64,${base64}`;
        return this.sanitizer.bypassSecurityTrustResourceUrl(pdfUrl); 
    }
    return ''; 
}
}