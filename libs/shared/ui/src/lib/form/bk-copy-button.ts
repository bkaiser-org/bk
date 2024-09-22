import { AsyncPipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { SvgIconPipe, TranslatePipe } from '@bk/pipes';
import { ENV, copyToClipboard, showToast } from '@bk/util';
import { IonButton, IonIcon, ToastController } from '@ionic/angular/standalone';

@Component({
  selector: 'bk-copy-button',
  standalone: true,
  imports: [
    TranslatePipe, AsyncPipe, SvgIconPipe,
    IonIcon, IonButton
  ],
  template: `
  @if (label().length > 0) {
    <ion-button fill="clear" (click)="copyValue()">
      <ion-icon slot="start" src="{{'copy-outline' | svgIcon }}" />
      {{ label() | translate | async }}
    </ion-button>
  } @else {
    <ion-icon slot="end" src="{{'copy-outline' | svgIcon }}" (click)="copyValue()" />
  }
  `
})
export class BkCopyButtonComponent {
  private toastController = inject(ToastController);
  private env = inject(ENV);

  public value = input.required<string | number | null | undefined>(); // data to copy
  public label = input(''); // optional label for the button

  public copyValue(): void {
    const _value = this.value();
    if (_value !== undefined && _value !== null) {
      copyToClipboard(_value);
      showToast(this.toastController, '@general.operation.copy.conf', this.env.settingsDefaults.toastLength);  
    }
  }
}
