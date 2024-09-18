import { AsyncPipe } from '@angular/common';
import { AfterViewInit, Component, inject, input, output, viewChild } from '@angular/core';
import { TranslatePipe } from '@bk/pipes';
import { AutoComplete, bkTranslate, ENV, copyToClipboard, InputMode, INT_LENGTH, showToast } from '@bk/util';
import { ToastController } from '@ionic/angular';
import { IonIcon, IonInput, IonItem } from '@ionic/angular/standalone';
import { addIcons } from "ionicons";
import { copyOutline } from "ionicons/icons";

@Component({
  selector: 'bk-number-input',
  standalone: true,
  imports: [
    TranslatePipe, AsyncPipe, 
    IonItem, IonInput, IonIcon
  ],
  template: `
  <ion-item lines="none">
  <ion-input #bkNumberInput [name]="name()" [value]="value()" (ionInput)="onNumberChange($event)"
    labelPlacement="floating"
    label="{{ '@input.' + name() + '.label' | translate | async }}"
    placeholder="{{'@input.' + name() + '.placeholder' | translate | async }}"
    [inputMode]="inputMode()"
    type="number"
    [counter]=true
    [maxlength]="maxLength()"
    [autocomplete]="autocomplete()"
    [clearInput]="clearInput()"
    [readonly]="readOnly()"
  />
  @if (copyable()) {
    <ion-icon slot="end" name="copy-outline" (click)="copyValue()" />
  }
</ion-item>
  `
})
export class BkNumberInputComponent implements AfterViewInit {
  private toastController = inject(ToastController);
  private env = inject(ENV);

  public value = input.required<number>(); // mandatory view model
  public name = input.required<string>(); // mandatory name of the input field
  public readOnly = input(false); // if true, the input field is read-only
  public maxLength = input(INT_LENGTH); // max number of characters allowed

  public showError = input(false);
  public showHelper = input(false);

  public autocomplete = input<AutoComplete>('off'); // Automated input assistance in filling out form field values
  public clearInput = input(true); // show an icon to clear the input field
  public copyable = input(false); // if true, a button to copy the value of the input field is shown
  public inputMode = input<InputMode>('decimal'); // A hint to the browser for which keyboard to display.

  public changed = output<number>();
  public ionInput = viewChild.required<IonInput>('bkNumberInput');

  constructor() {
    addIcons({copyOutline});
  }

  ngAfterViewInit(): void {
    if (this.showError() === true) {
      this.ionInput().errorText = bkTranslate('@input.' + this.name() + '.error');
    }
    if (this.showHelper() === true) {
      this.ionInput().helperText = bkTranslate('@input.' + this.name() + '.helper');
    }
  }

  protected onNumberChange(event: CustomEvent): void {
    this.changed.emit(event.detail.value);
  }

  /**
   * Copy the value of the input field to the clipboard
   */
    public copyValue(): void {
      const _value = this.ionInput().value ? this.ionInput().value : '';
      copyToClipboard(_value ?? '');
      showToast(this.toastController, '@general.operation.copy.conf', this.env.settingsDefaults.toastLength);
    }
}
