import { Pipe, PipeTransform, inject } from '@angular/core';
import { TimeService } from '../Services/time.service';

@Pipe({
  name: 'timeAgo',
  standalone: true,
  pure: false 
})
export class TimeAgoPipe implements PipeTransform {
  private timeService = inject(TimeService);

  transform(value: string | number | Date | any): string {
    if (!value) return '';

    const now = this.timeService.currentTime();
    
    let date: Date;
    if (value instanceof Date) {
      date = value;
    } else {
      date = new Date(value);
    }

    const seconds = Math.floor((now - date.getTime()) / 1000);

    if (seconds < 60) return 'just now';
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return minutes === 1 ? 'a minute ago' : `${minutes} minutes ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return hours === 1 ? 'an hour ago' : `${hours} hours ago`;

    const days = Math.floor(hours / 24);
    if (days < 30) return days === 1 ? 'a day ago' : `${days} days ago`;

    const months = Math.floor(days / 30.44);
    if (months < 12) return months === 1 ? 'a month ago' : `${months} months ago`;

    const years = Math.floor(months / 12);
    return years === 1 ? 'a year ago' : `${years} years ago`;
  }
}