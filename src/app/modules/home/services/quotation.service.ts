import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, retry } from 'rxjs';

import { CurrencyQuote, CurrencyQuotes } from '../interfaces/currency-quote';

@Injectable({
  providedIn: 'root',
})
export class QuotationService {
  // private _baseUrl = 'https://economia.awesomeapi.com.br/last/USD-BRL';
  private _baseUrl = 'https://currency-conversion-api.vercel.app/api/convert?from=brl&to=brl';

  constructor(private _httpClient: HttpClient) {}

  public getCurrencyPair(): Observable<CurrencyQuote> {
    return this._httpClient.get<CurrencyQuotes>(this._baseUrl).pipe(
      retry({ count: 2, delay: 200 }),
      catchError((error: HttpErrorResponse) => {
        // Handle error
        throw error;
      }),
      map((response) => Object.values(response)),
      map((quoteArray) => quoteArray[0])
    );
  }
}
