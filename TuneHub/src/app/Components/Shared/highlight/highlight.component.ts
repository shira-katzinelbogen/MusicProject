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
    
    const pattern = new RegExp(search, 'gi'); 
    
    const highlighted = text.replace(pattern, (match) => 
      `<mark class="highlighted-text">${match}</mark>`
    );
    
    return this.sanitizer.bypassSecurityTrustHtml(highlighted);
  }
}