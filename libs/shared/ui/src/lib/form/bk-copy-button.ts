import { AsyncPipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { TranslatePipe } from '@bk/pipes';
import { ConfigService, copyToClipboard, showToast } from '@bk/util';
import { IonButton, IonIcon, ToastController } from '@ionic/angular/standalone';
import { addIcons } from "ionicons";
import { copyOutline } from "ionicons/icons";

@Component({
  selector: 'bk-copy-button',
  standalone: true,
  imports: [
    TranslatePipe, AsyncPipe,
    IonIcon, IonButton
  ],
  template: `
  @if (label().length > 0) {
    <ion-button fill="clear" (click)="copyValue()">
      <ion-icon slot="start" name="copy-outline" />
      {{ label() | translate | async }}
    </ion-button>
  } @else {
    <ion-icon slot="end" name="copy-outline" (click)="copyValue()" />
  }
  `
})
export class BkCopyButtonComponent {
  private toastController = inject(ToastController);
  private configService = inject(ConfigService);

  public value = input.required<string | number | null | undefined>(); // data to copy
  public label = input(''); // optional label for the button

  constructor() {
    addIcons({copyOutline});
  }

  public copyValue(): void {
    const _value = this.value();
    if (_value !== undefined && _value !== null) {
      copyToClipboard(_value);
      showToast(this.toastController, '@general.operation.copy.conf', this.configService.getConfigNumber('settings_toast_length'));  
    }
  }
}
