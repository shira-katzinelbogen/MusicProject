import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortNumber'
})

export class ShortNumberPipe implements PipeTransform {
  transform(value: number): string {
    if (value == null) return '0';
    if (value < 1000) return value.toString();
    if (value < 1_000_000) return (value / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    if (value < 1_000_000_000) return (value / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    return (value / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
  }
}
