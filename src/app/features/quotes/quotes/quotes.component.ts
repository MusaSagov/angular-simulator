import { Component, inject, OnInit } from '@angular/core';
import { QuotesStore } from '../store/quotes.store';

@Component({
  selector: 'app-quotes',
  standalone: true,
  templateUrl: './quotes.component.html',
  styleUrl: './quotes.component.scss',
})
export class QuotesComponent implements OnInit {

  readonly store = inject(QuotesStore);

  ngOnInit(): void {
    this.store.loadQuotes();
  }

}