import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs';

import { QuotationService } from '../services/quotation.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  private _valorUSD = 0;

  public form = new FormGroup({
    amount: new FormControl<number | undefined | null>(undefined, [Validators.required]),
    converted: new FormControl<number | undefined | null>(undefined, [Validators.required]),
  });

  constructor(private _quotationService: QuotationService) {}

  ngOnInit(): void {
    this._bindControlChanges();
    this._quotationService.getCurrencyPair().subscribe({
      next: (response) => {
        const { bid } = response;
        this._valorUSD = Number(bid);
      },
      error: () => {
        // Handle
      },
    });
  }

  private _bindControlChanges(): void {
    const amountControl = this.form.controls['amount'];
    const convertedControl = this.form.controls['converted'];

    const [amountControl$, convertedControl$] = [amountControl, convertedControl].map((control) => {
      return control.valueChanges.pipe(
        filter((value) => typeof value === 'number'),
        debounceTime(200),
        distinctUntilChanged()
      );
    });

    amountControl$.subscribe({
      next: (value) => {
        if (!value) return;

        const quotation = value * this._valorUSD;
        const roundedQuotation = this._roundValue(quotation);
        convertedControl.setValue(roundedQuotation, { emitEvent: false });
      },
      error: () => {
        // Handle error
      },
    });

    convertedControl$.subscribe({
      next: (value) => {
        if (!value) return;

        const quotation = value / this._valorUSD;
        const roundedQuotation = this._roundValue(quotation);
        amountControl.setValue(roundedQuotation, { emitEvent: false });
      },
      error: () => {
        // Handle
      },
    });
  }

  private _roundValue(value: number): number {
    const formattedValue = value.toFixed(2);
    return Number(formattedValue);
  }
}
