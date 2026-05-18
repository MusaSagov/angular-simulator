import { Pipe, PipeTransform } from '@angular/core';
import { PhoneFormat } from '../enums/PhoneFormat';

@Pipe({
  name: 'phone',
  standalone: true,
})
export class PhonePipe implements PipeTransform {

  transform(value: string, mode: PhoneFormat): string {
    if (!value) return '';
    const digits: string = value.replace(/\D/g, '');
    if (digits.length < 12) return digits;

    switch (mode) {
      case PhoneFormat.COMPACT:
        return '+' + digits;
      case PhoneFormat.INTERNATIONAL:
        return '+' + digits.slice(0, 2) + ' ' +
               digits.slice(2, 5) + ' ' +
               digits.slice(5, 8) + ' ' +
               digits.slice(8, 10) + ' ' +
               digits.slice(10, 12);
      case PhoneFormat.NATIONAL:
        return digits.slice(2, 5) + ' ' +
               digits.slice(5, 8) + ' ' +
               digits.slice(8, 10) + ' ' +
               digits.slice(10, 12);
      case PhoneFormat.MASKED:
        return '+' + digits.slice(0, 2) + ' ' +
               digits.slice(2, 5) + ' *** ** ' +
               digits.slice(10, 12);
      default:
        return digits;
    }
  }

}
