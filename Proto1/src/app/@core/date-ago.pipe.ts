import { Pipe, PipeTransform } from '@angular/core';

const intervals: Partial<Record<Intl.RelativeTimeFormatUnit, number>> = {
  year: 31536000,
  month: 2592000,
  week: 604800,
  day: 86400,
  hour: 3600,
  minute: 60,
  second: 1,
};

const rtf = new Intl.RelativeTimeFormat('en', {
  numeric: 'auto',
  style: 'short',
});

@Pipe({
  name: 'dateAgo',
  pure: true,
})
export class DateAgoPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    if (!value) return value;
    const seconds = Math.floor((+new Date() - +new Date(value)) / 1000);
    if (seconds < 29) return 'Just now';

    for (const [unit,i] of Object.entries(intervals)) {
      const counter = Math.floor(seconds / i);
      console.log(counter, unit);
      if (counter > 0) return rtf.format(-counter, unit as Intl.RelativeTimeFormatUnit);
    }

    return value;
  }
}
