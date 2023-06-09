import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, debounceTime, distinctUntilChanged, filter, map, switchMap } from 'rxjs';

import { ICurrency } from 'src/app/shared/components/select-currency/interfaces/currency';
import { QuotationService } from '../services/quotation.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  private _currentQuotation = 0;

  private _amountCurrency$ = new BehaviorSubject<ICurrency | undefined>(undefined);
  private _convertedCurrency$ = new BehaviorSubject<ICurrency | undefined>(undefined);

  public form = new FormGroup({
    amount: new FormControl<number | undefined | null>(undefined, [Validators.required]),
    converted: new FormControl<number | undefined | null>(undefined, [Validators.required]),
  });

  public changeSide = false;

  constructor(private _quotationService: QuotationService) {}

  ngOnInit(): void {
    this._listenCurrencyChanges();
    this._bindControlValueChanges();
  }

  private _bindControlValueChanges(): void {
    const amountControl = this.form.controls['amount'];
    const convertedControl = this.form.controls['converted'];

    const [amountControl$, convertedControl$] = [amountControl, convertedControl].map((control) => {
      return control.valueChanges.pipe(
        filter((value) => !!value && typeof value === 'number'),
        debounceTime(0),
        distinctUntilChanged()
      );
    });

    amountControl$.subscribe((value) => {
      if (!value) return;

      const quotation = value * this._currentQuotation;
      convertedControl.setValue(quotation, { emitEvent: false });
    });

    convertedControl$.subscribe((value) => {
      if (!value) return;

      const quotation = value / this._currentQuotation;
      amountControl.setValue(quotation, { emitEvent: false });
    });
  }

  public amountCurrencyChange(event: ICurrency): void {
    this._amountCurrency$.next(event);
  }

  public convertedCurrencyChange(event: ICurrency): void {
    this._convertedCurrency$.next(event);
  }

  public switchSide() {
    this.changeSide = !this.changeSide;
  }

  private _listenCurrencyChanges(): void {
    this._amountCurrency$
      .pipe(
        filter((value) => value !== undefined),
        map((currency) => currency!.code),
        switchMap((amountCurrencyCode) => {
          const { code } = this._convertedCurrency$.getValue()!;
          return this._quotationService.getCurrencyPairQuote(amountCurrencyCode!, code);
        })
      )
      .subscribe({
        next: (currencyQuote) => {
          // Handle
          console.log('_amountCurrency$ quote:', currencyQuote);
        },
        error: () => {
          // Handle error
        },
      });

    this._convertedCurrency$
      .pipe(
        filter((value) => value !== undefined),
        map((currency) => currency!.code),
        switchMap((convertedCurrencyCode) => {
          const { code } = this._amountCurrency$.getValue()!;
          return this._quotationService.getCurrencyPairQuote(convertedCurrencyCode!, code);
        })
      )
      .subscribe({
        next: (currencyQuote) => {
          // Handle
          console.log('_convertedCurrency$ quote:', currencyQuote);
        },
        error: () => {
          // Handle error
        },
      });
  }
}
