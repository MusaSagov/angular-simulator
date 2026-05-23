import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'plural',
  pure: true,
  standalone: true
})
export class PluralPipe implements PipeTransform {

  transform(value: number | string): string {
    const count: number = typeof value === 'string' ? Number(value) : value;
    if (Number.isNaN(count)) {
      return '';
    }

    const lastTwoDigits: number = count % 100;
    const lastDigit: number = count % 10;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
      return `${ count } пользователей`;
    }
    if (lastDigit === 1) {
      return `${ count } пользователь`;
    } else if (lastDigit === 2 || lastDigit === 3 || lastDigit === 4) {
      return `${ count } пользователя`;
    } else {
      return `${ count } пользователей`;
    }
  }

}