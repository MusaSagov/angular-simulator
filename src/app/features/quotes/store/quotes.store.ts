
import { IQuote } from '../interfaces/IQuote';
import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed,  withMethods,  withState, } from '@ngrx/signals';
import { QuotesApiService } from '../quotes-api.service';
import { catchError, EMPTY } from 'rxjs';
import { withLoading } from './quotes-loading.feature';

interface IQuotesState {
  quotes: IQuote[];
  favorites: number[];
  filter: 'all' | 'favorites';
  randomQuote: IQuote | null;
}

const initialState: IQuotesState = {
  quotes: [],
  favorites: [],
  filter: 'all',
  randomQuote: null,
};

export const QuotesStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withLoading(),
  withComputed(({ favorites, quotes, filter }) => ({
    favoritesCount: computed(() => favorites().length),
    authorsCount: computed(() =>
      new Set(quotes().map((quote) => quote.author)).size
    ),
    filteredQuotes: computed(() => {
      if (filter() === 'favorites') {
        return quotes().filter((quote) =>
          favorites().includes(quote.id)
        );
      }

      return quotes();
    }),
  })),
  withMethods((store) => {
    const quotesApiService: QuotesApiService = inject(QuotesApiService);
    return {
      removeFavorite: (id: number) => {
        patchState(store, {
          favorites: store.favorites().filter((favoriteId) => favoriteId !== id),
        });
      },
      addFavorite: (id: number) => {
        patchState(store, {
          favorites: [...store.favorites(), id],
        });
      },
      toggleFavorite: (id: number) => {
        const isFavorite: boolean = store.favorites().includes(id);

        if (isFavorite) {
          patchState(store, {
            favorites: store.favorites().filter((favoriteId) => favoriteId !== id),
          });
        } else {
          patchState(store, {
            favorites: [...store.favorites(), id],
          });
        }
      },
      setFilter: (filter: 'all' | 'favorites') => {
        patchState(store, { filter });
      },
      getRandomQuote: () => {
        const quotes: IQuote[]= store.quotes();
        if (quotes.length === 0) {
          return;
        }
        const randomIndex: number = Math.floor(Math.random() * quotes.length);
        patchState(store, {
          randomQuote: quotes[randomIndex],
        });
      },
      loadQuotes: () => {
        store.startLoading();
        quotesApiService.getQuotes()
          .pipe(
            catchError(() => {
              store.setLoadingError('Не удалось загрузить цитаты');
              return EMPTY;
            })
          )
          .subscribe((response) => {
            patchState(store, { 
              quotes: response.quotes,
            });
            store.finishLoading();
          });
      },
    }
  })
);