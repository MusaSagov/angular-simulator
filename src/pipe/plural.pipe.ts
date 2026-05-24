import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'plural',
  pure: true,
  standalone: true
})
export class PluralPipe implements PipeTransform {

  transform(value: number | string, one: string, two: string, five: string): string {
    const count: number = typeof value === 'string' ? Number(value) : value;
    if (Number.isNaN(count)) {
      return '';
    }

    const lastTwoDigits: number = count % 100;
    const lastDigit: number = count % 10;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
      return `${ count } ${ five }`;
    }
    if (lastDigit === 1) {
      return `${ count } ${ one }`;
    }
    if ([2, 3, 4].includes(lastDigit)) {
      return `${ count } ${ two }`;
    }
    return `${ count } ${ five}`;
  }
  
}