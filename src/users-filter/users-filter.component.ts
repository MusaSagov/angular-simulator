import { Component, DestroyRef, EventEmitter, inject, Output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounce, debounceTime, delay, distinctUntilChanged, map, tap } from 'rxjs';

@Component({
  selector: 'app-users-filter',
  imports: [ReactiveFormsModule],
  templateUrl: './users-filter.component.html',
  styleUrl: './users-filter.component.scss',
})
export class UsersFilterComponent {

  @Output() filterChange: EventEmitter<string | null> = new EventEmitter<string | null>();
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  filterControl: FormControl<string | null> = this.formBuilder.control<string | null>('');

  ngOnInit(): void {
    this.filterControl.valueChanges.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      tap((query: string | null) => this.filterChange.emit(query)),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

}
