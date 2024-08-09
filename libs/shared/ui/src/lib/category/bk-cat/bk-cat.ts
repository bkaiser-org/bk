import { Component, input } from '@angular/core';
import { Category, CategoryConfig } from '@bk/categories';
import { compareCategories } from './bk-cat.util';
import { IonIcon, IonItem, IonLabel, IonList, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { TranslatePipe } from '@bk/pipes';
import { AsyncPipe } from '@angular/common';
import { vestFormsViewProviders } from 'ngx-vest-forms';

@Component({
  selector: 'bk-cat',
  standalone: true,
  imports: [
    TranslatePipe, AsyncPipe,
    IonList, IonItem, IonSelect, IonSelectOption, IonLabel, IonIcon
  ],
  viewProviders: [vestFormsViewProviders],
  template: `
    <ion-item lines="none">
      @if(config(); as config) {
        <ion-select [name]="name()" 
          label="{{ config.label | translate | async }}"
          [disabled]="readOnly()"
          label-placement="floating"
          interface="popover"
          [value]="config.categories![config.selectedCategoryId!]"
          [compareWith]="compareWith">
          @for (cat of config.categories; track cat) {
            <ion-select-option [value]="cat">
              {{ '@' + cat.i18nBase + '.label' | translate | async }}
            </ion-select-option>
          }
        </ion-select>
      }
    </ion-item>
  `
})
export class BkCatComponent {
  public config = input.required<CategoryConfig>();
  public name = input('cat');
  public readOnly = input(false); // if true, the selected category is shown as a ready-only text

  /**
   * Compare two Categories.
   * Return true if they are the same.
   */
  public compareWith(cat1: Category, cat2: Category): boolean {
    return compareCategories(cat1, cat2);
  }
}

