// src/app/pipes/highlight.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'highlight',
  standalone: true
})
export class HighlightPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(text: string, search: string): SafeHtml {
    if (!search || !text) {
      return text;
    }
    
    // יצירת ביטוי רגולרי גלובלי (g) ולא תלוי רישיות (i)
    const pattern = new RegExp(search, 'gi'); 
    
    // החלפת כל התאמה במחרוזת עם תגית <mark>
    const highlighted = text.replace(pattern, (match) => 
      `<mark class="highlighted-text">${match}</mark>`
    );
    
    // חיוני: עקיפת מנגנון האבטחה של Angular כדי להציג HTML
    return this.sanitizer.bypassSecurityTrustHtml(highlighted);
  }
}