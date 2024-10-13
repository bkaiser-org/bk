import { AsyncPipe } from '@angular/common';
import { AfterViewInit, Component, input, output, viewChild } from '@angular/core';
import { TranslatePipe } from '@bk/pipes';
import { AutoComplete, bkTranslate, InputMode, SHORT_NAME_LENGTH } from '@bk/util';
import { IonInput, IonItem } from '@ionic/angular/standalone';
import { MaskitoElementPredicate, MaskitoOptions } from '@maskito/core';
import { BkCopyButtonComponent } from '../form/bk-copy-button';
import { vestFormsViewProviders } from 'ngx-vest-forms';
import { MaskitoDirective } from '@maskito/angular';

export const lowercaseWordMask: MaskitoOptions = {
  mask: /^[a-z0-9-_]+$/,
};
export const uppercaseWordMask: MaskitoOptions = {
  mask: /^[A-Z0-9-_]+$/,
};
export const caseInsensitiveWordMask: MaskitoOptions = {
  mask: /^[a-zA-Z0-9-_]+$/,
};
export const what3WordMask: MaskitoOptions = {
  mask: [/\w+/, /\./, /\w+/, /\./, /\w+/]
};
export const sizeMask: MaskitoOptions = {
  mask: /^[0-9]{1,3}$/,
};
export const bexioIdMask: MaskitoOptions = {
  mask: /^[0-9]{1,6}$/,
};
export const coordinateMask: MaskitoOptions = {
  mask: /^[0-9.,]+$/,
};
export const chVatMask: MaskitoOptions = {
  mask: ['C', 'H', 'E', '-', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, ' ', 'M', 'W', 'S', 'T'],
};
export const chSsnMask: MaskitoOptions = {
  mask: ['7', '5', '6', '.', /\d/, /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, /\d/, '.', /\d/, /\d/],
};
export const chZipCodeMask: MaskitoOptions = {
  mask: /^[0-9]{1,4}$/,
};


@Component({
  selector: 'bk-text-input',
  standalone: true,
  imports: [
    TranslatePipe, AsyncPipe,
    BkCopyButtonComponent,
    MaskitoDirective,
    IonItem, IonInput
  ],
  viewProviders: [vestFormsViewProviders],
  template: `
    <ion-item lines="none">
      @if(mask(); as mask) {
        <ion-input #bkTextInput [name]="name()" [value]="value()" (ionInput)="onTextChange($event)"
          labelPlacement="floating"
          label="{{'@input.' + name() + '.label' | translate | async }}"
          placeholder="{{'@input.' + name() + '.placeholder' | translate | async }}"
          [inputMode]="inputMode()"
          type="text"
          [counter]="!readOnly()"
          [maxlength]="maxLength()"
          [autocomplete]="autocomplete()"
          [clearInput]="clearInput()"
          [readonly]="readOnly()"
          [maskito]="mask"
          [maskitoElement]="maskPredicate"
        />
      } @else {
        <ion-input #bkTextInput [name]="name()" [value]="value()" (ionInput)="onTextChange($event)"
          labelPlacement="floating"
          label="{{'@input.' + name() + '.label' | translate | async }}"
          placeholder="{{'@input.' + name() + '.placeholder' | translate | async }}"
          [inputMode]="inputMode()"
          type="text"
          [counter]="!readOnly()"
          [maxlength]="maxLength()"
          [autocomplete]="autocomplete()"
          [clearInput]="clearInput()"
          [readonly]="readOnly()"
        />
      }
      @if (copyable()) {
        <bk-copy-button [value]="ionInput().value" />
      }
    </ion-item>
  `
})
export class BkTextInputComponent implements AfterViewInit {
  public value = input.required<string>(); // mandatory view model
  public name = input.required<string>(); // mandatory name of the input field
  public readOnly = input(false); // if true, the input field is read-only
  public maxLength = input(SHORT_NAME_LENGTH); // max number of characters allowed

  public showError = input(false);
  public showHelper = input(false);
  public ionInput = viewChild.required<IonInput>('bkTextInput');

  public autocomplete = input<AutoComplete>('off'); // Automated input assistance in filling out form field values
  public clearInput = input(true); // show an icon to clear the input field
  public copyable = input(false); // if true, a button to copy the value of the input field is shown
  public inputMode = input<InputMode>('text'); // A hint to the browser for which keyboard to display.
  public mask = input<MaskitoOptions>();

  public changed = output<string>();

  ngAfterViewInit(): void {
    if (!this.readOnly() && this.showError() === true) {
      this.ionInput().errorText = bkTranslate('@input.' + this.name() + '.error');
    }
    if (!this.readOnly() && this.showHelper() === true) {
      this.ionInput().helperText = bkTranslate('@input.' + this.name() + '.helper');
    }
  }

  /**
   * Signal the updated text value to the container element after each keystroke (onInput)
   * and after leaving the edit field (onChange)
   */
  protected onTextChange(event: CustomEvent): void {
    this.changed.emit(event.detail.value);
  }

  readonly maskPredicate: MaskitoElementPredicate = async (el: HTMLElement) => (el as HTMLIonInputElement).getInputElement();
}
