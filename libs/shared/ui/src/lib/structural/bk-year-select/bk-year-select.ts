import { Component, input } from '@angular/core';
import { IonItem, IonLabel, IonList, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { TranslatePipe } from '@bk/pipes';
import { AsyncPipe } from '@angular/common';
import { YearConfig } from '@bk/categories';

@Component({
  selector: 'bk-year-select',
  standalone: true,
  imports: [
    TranslatePipe, AsyncPipe,
    IonList, IonItem, IonSelect, IonSelectOption, IonLabel
  ],
  template: `
  @if(readOnly()) {
    <ion-label>{{ config().label | translate | async }}</ion-label>
  } @else {
    <ion-select
      label="{{ config().label | translate | async }}"
      label-placement="floating"
      interface="popover"
      [value]="config().selectedYear"
      [compareWith]="compareWith">
      @for(year of config().years; track year) {
        <ion-select-option [value]="year">{{ year }}</ion-select-option>
      }
    </ion-select>
  }
  `
})
export class BkYearSelectComponent {
  public config = input.required<YearConfig>();
  public readOnly = input(false); // if true, the selected category is shown as a ready-only text

  /**
   * Compare two Years.
   * Return true if they are the same.
   */
  compareWith(year1: number, year2: number): boolean {
    return (year1 === year2);
  }
}
