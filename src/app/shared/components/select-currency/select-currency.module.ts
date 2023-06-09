import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';

import { SelectCurrencyComponent } from './select-currency.component';

@NgModule({
  declarations: [SelectCurrencyComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DividerModule,
    DropdownModule,
    InputNumberModule,
  ],
  exports: [SelectCurrencyComponent],
})
export class SelectCurrencyModule {}
