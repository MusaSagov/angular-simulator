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
    let pluralKey: number;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
      pluralKey = 0;
    } else {
      pluralKey = lastDigit;
    }

    switch (pluralKey) {
      case 1:
        return `${ count } пользователь`;
      case 2:
      case 3:
      case 4:
        return `${ count } пользователя`;
      default:
        return `${ count } пользователей`;
    }
  }

}
