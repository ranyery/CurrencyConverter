import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, retry } from 'rxjs';

import { CurrencyQuote, CurrencyQuotes } from '../interfaces/currency-quote';

@Injectable({
  providedIn: 'root',
})
export class QuotationService {
  private _baseUrl = 'https://economia.awesomeapi.com.br/last';

  constructor(private _httpClient: HttpClient) {}

  public getCurrencyPairQuote(from: string, to: string): Observable<CurrencyQuote> {
    return this._httpClient.get<CurrencyQuotes>(`${this._baseUrl}/${from}-${to}`).pipe(
      retry({ count: 2, delay: 500 }),
      map((response) => Object.values(response)),
      map((quoteArray) => quoteArray[0]),
      catchError((error: HttpErrorResponse) => {
        // Handle error
        throw error;
      })
    );
  }
}
