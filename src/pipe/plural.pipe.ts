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

    const pluralKey = count % 100 >= 11 && count % 100 <= 14 ? 0 : count % 10;
    
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
