import { Component, DestroyRef, EventEmitter, inject, Output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { debounce, debounceTime, delay, distinctUntilChanged, map } from 'rxjs';

@Component({
  selector: 'app-users-filter',
  imports: [ReactiveFormsModule],
  templateUrl: './users-filter.component.html',
  styleUrl: './users-filter.component.scss',
})
export class UsersFilterComponent {

  fd = inject(FormBuilder);
  filterControl = this.fd.control<string | null>('');
  @Output() filter = new EventEmitter<string>();

  destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.filterControl.valueChanges.pipe(
      map(v => v?.trim() ?? ''),
      distinctUntilChanged(),
      delay(200),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(query => {
      this.filter.emit(query);
    });
  }
}
