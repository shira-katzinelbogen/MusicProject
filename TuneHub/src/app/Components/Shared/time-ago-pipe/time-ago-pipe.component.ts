// src/app/pipes/time-ago.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo',
  standalone: true
})
export class TimeAgoPipe implements PipeTransform {

  transform(value: string | Date | number): string {
    if (!value) return '';

    const date = value instanceof Date ? value : new Date(value);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 5) return 'just now';

    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
      second: 1
    };

    for (const key of Object.keys(intervals)) {
      const intervalSeconds = intervals[key as keyof typeof intervals];
      const count = Math.floor(seconds / intervalSeconds);

      if (count >= 1) {
        const label = count === 1 ? key : key + 's';
        return `${count} ${label} ago`;
      }
    }

    return '';
  }
}
