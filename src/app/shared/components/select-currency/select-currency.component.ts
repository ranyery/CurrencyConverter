import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { DropdownChangeEvent } from 'primeng/dropdown';
import { Subscription } from 'rxjs';

import currencies from '../../../../assets/data/json/currencies.json';
import { ICurrency } from './interfaces/currency';

interface IInputNumberEvent {
  originalEvent: KeyboardEvent;
  value?: number | null;
  formattedValue: string;
}

@Component({
  selector: 'app-select-currency',
  templateUrl: './select-currency.component.html',
  styleUrls: ['./select-currency.component.scss'],
})
export class SelectCurrencyComponent implements OnInit, OnChanges, OnDestroy {
  @Input({ required: true }) control!: FormControl<number | null | undefined>;
  @Input() label = '';
  @Input() disabled = false;

  @Output() valueChange = new EventEmitter<number>();
  @Output() currencyChange = new EventEmitter<ICurrency>();

  public currencies: ICurrency[] = [];
  public placeholder = '';

  public selectedCurrency!: ICurrency;

  private _subscriptions: Subscription = new Subscription();

  constructor() {
    // Handle
  }

  ngOnInit(): void {
    this.currencies = currencies;
    this.selectedCurrency = currencies[Math.floor(Math.random() * currencies.length - 1)];
    this.currencyChange.emit(this.selectedCurrency);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['disabled']) {
      const disableOrEnable = this.disabled ? 'disable' : 'enable';
      this.control[disableOrEnable]();
    }

    if (changes['control']) {
      console.error("changes['control']: Atualizar aqui pq vai ter lado");
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public onInput(event: any) {
    const { value, originalEvent } = event as IInputNumberEvent;
    const isBackspacePressed = originalEvent.key === 'Backspace';

    if (!value || (!value && isBackspacePressed)) {
      this.control.setValue(0);
      this.valueChange.emit(0);
      return;
    }

    this.control.setValue(value);
    this.valueChange.emit(value);
  }

  public onChangeCurrency(event: DropdownChangeEvent): void {
    this.currencyChange.emit(event.value);
  }

  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }
}
