import { Directive, ElementRef, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[BoldOnHover]',
  standalone: true,
})
export class BoldOnHoverDirective {

  constructor(private el: ElementRef) {}

  @HostBinding('style.fontWeight') fontWeight: string = 'Bold';

  @HostListener('mouseenter')
  onEnter() {
    this.fontWeight = 'bold';
  }

  @HostListener('mouseleave')
  onLeave() {
    this.fontWeight = ''
  }

}
