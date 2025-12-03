import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo',
  standalone: true
})
export class TimeAgoPipe implements PipeTransform {

  transform(value: string | number | Date): string {
    if (!value) return '';

    let timestamp: number;

    if (typeof value === 'number') {
      timestamp = value;
    } else if (typeof value === 'string') {
      timestamp = parseFloat(value); 
    } else {
      timestamp = value.getTime() / 1000;
    }

    const date = new Date(timestamp * 1000);

    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

    if (seconds < 45) return 'just now';
    if (seconds < 90) return 'a minute ago';

    const minutes = seconds / 60;
    if (minutes < 45) return `${Math.floor(minutes)} minutes ago`;
    if (minutes < 90) return 'an hour ago';

    const hours = minutes / 60;
    if (hours < 24) return `${Math.floor(hours)} hours ago`;
    if (hours < 42) return 'a day ago';

    const days = hours / 24;
    if (days < 30) return `${Math.floor(days)} days ago`;
    if (days < 45) return 'a month ago';

    const months = days / 30.44;
    if (months < 12) return `${Math.floor(months)} months ago`;

    const years = months / 12;
    return `${Math.floor(years)} years ago`;
  }
}

