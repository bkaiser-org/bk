import { AsyncPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { ColorIonic, ColorsIonic } from '@bk/categories';
import { CategoryPlainNamePipe, TranslatePipe } from '@bk/pipes';
import { IonItem, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'bk-error-toolbar',
  standalone: true,
  imports: [
    TranslatePipe, AsyncPipe, CategoryPlainNamePipe,
    IonToolbar, IonItem
  ],
  template: `
    @if(errorMessage(); as errorMessage) {
      <ion-toolbar [color]="color() | categoryPlainName:colorsIonic">
        <ion-item lines="none" [color]="color() | categoryPlainName:colorsIonic">
          {{ errorMessage | translate | async }}
        </ion-item>
      </ion-toolbar>
    }
  `
})
export class BkErrorToolbarComponent {
  public errorMessage = input.required<string>();
  public color = input<ColorIonic>(ColorIonic.Danger);


  protected colorsIonic = ColorsIonic;
}
