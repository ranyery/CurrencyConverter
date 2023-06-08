import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private _primeNGConfig: PrimeNGConfig) {}

  ngOnInit() {
    this._primeNGConfig.ripple = true;
  }
}
