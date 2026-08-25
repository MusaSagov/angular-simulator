import { Component } from '@angular/core';
import { ChildComponent } from '../child/child.component';
import { IPerson } from '../../interfaces/IPerson';

@Component({
  selector: 'app-parent',
  imports: [ChildComponent],
  templateUrl: './parent.component.html',
  styleUrl: './parent.component.scss',
})
export class ParentComponent {

  user: IPerson = {
    name: 'Alex',
    age: 20
  };

  changeName(): void {
    this.user = {
      ...this.user,
      name: 'Musa'
    }
  }

}