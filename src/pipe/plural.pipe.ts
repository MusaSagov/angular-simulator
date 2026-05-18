import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'plural',
  pure: true,
  standalone: true
})
export class PluralPipe implements PipeTransform {

  transform(value: number | string): string {
    const n = typeof value === 'string' ? Number(value) : value;
    if (Number.isNaN(n)) {
      return '';
    }
    switch (n) {
      case 1:
        return `${n} пользователь`;
      case 2:
      case 3:
      case 4:
        return `${n} пользователя`;
      default:
        return `${n} пользователей`;
    }
  }

}
