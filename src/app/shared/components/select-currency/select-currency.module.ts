import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';

import { SelectCurrencyComponent } from './select-currency.component';

@NgModule({
  declarations: [SelectCurrencyComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, InputNumberModule, DropdownModule],
  exports: [SelectCurrencyComponent],
})
export class SelectCurrencyModule {}
