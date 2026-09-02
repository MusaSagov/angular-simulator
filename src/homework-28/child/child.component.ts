import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IPerson } from '../../interfaces/IPerson';

@Component({
  selector: 'app-child',
  imports: [],
  templateUrl: './child.component.html',
  styleUrl: './child.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChildComponent {

  @Input({ required: true }) user!: IPerson; 

}

// При OnPush Ангуляр проверяет Input по ссылке. Если написать this.user.name = 'Eugene', меняется только поле объекта, но ссылка остаётся прежней, поэтому Ангуляр не видит изменения для ChildComponent.
// Решение — создать новый объект через spread-оператор. Новая ссылка становится триггером для OnPush, и интерфейс обновляется.