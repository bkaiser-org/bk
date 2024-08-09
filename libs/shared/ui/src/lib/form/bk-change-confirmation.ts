import { AsyncPipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { CategoryPlainNamePipe, TranslatePipe } from '@bk/pipes';
import { IonButton, IonButtons, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { ColorIonic, ColorsIonic } from '@bk/categories';

@Component({
  selector: 'bk-change-confirmation',
  standalone: true,
  imports: [
    TranslatePipe, AsyncPipe, CategoryPlainNamePipe,
    IonButton, IonToolbar, IonTitle, IonButtons
  ],
  template: `
    <ion-toolbar [color]="color() | categoryPlainName:colorsIonic">
      <ion-title slot="start">{{ confirmation() | translate | async }}</ion-title>
      <ion-buttons slot="end">
        @if(showCancel()) {
          <ion-button (click)="cancelClicked.emit()">{{ cancelLabel() | translate | async }}</ion-button>
        }
        <ion-button (click)="okClicked.emit()">{{ okLabel() | translate | async }}</ion-button>
      </ion-buttons>
    </ion-toolbar>
  `
})
export class BkChangeConfirmationComponent {
  public confirmation = input('@general.operation.change.confirm');
  public okLabel = input('@general.operation.change.ok');
  public cancelLabel = input('@general.operation.change.cancel');
  public showCancel = input(false);
  public color = input<ColorIonic>(ColorIonic.Warning);

  public okClicked = output(); // event to notify the parent component about ok button clicked
  public cancelClicked = output(); // event to notify the parent component about cancel button clicked

  protected colorsIonic = ColorsIonic;
}
