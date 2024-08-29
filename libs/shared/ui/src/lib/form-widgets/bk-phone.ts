import { AsyncPipe } from '@angular/common';
import { AfterViewInit, Component, input, output, viewChild } from '@angular/core';
import { TranslatePipe } from '@bk/pipes';
import { IonInput, IonItem } from '@ionic/angular/standalone';
import { MaskitoDirective } from '@maskito/angular';
import { MaskitoElementPredicate, MaskitoOptions } from '@maskito/core';
import { BkCopyButtonComponent } from '../form/bk-copy-button';
import { bkTranslate, PHONE_LENGTH } from '@bk/util';

@Component({
  selector: 'bk-phone',
  standalone: true,
  imports: [
    TranslatePipe, AsyncPipe,
    MaskitoDirective,
    IonItem, IonInput,
    BkCopyButtonComponent
  ],
  template: `
  <ion-item lines="none">
    <ion-input #bkPhone name="name()" [value]="value()" (ionInput)="onTextChange($event)"
      labelPlacement="floating"
      label="{{'@input.' + name() + '.label' | translate | async }}"
      placeholder="{{'@input.' + name() + '.placeholder' | translate | async }}"
      inputMode="tel"
      type="tel"
      [counter]="true"
      [maxlength]="maxLength()"
      autocomplete="tel"
      [clearInput]="clearInput()"
      [readonly]="readOnly()" 
      [maskito]="chPhoneMask"
      [maskitoElement]="maskPredicate"
    />
    @if (copyable()) {
        <bk-copy-button [value]="ionInput().value" />
      }
  </ion-item>
  `
})
export class BkPhoneComponent implements AfterViewInit {
  public value = input.required<string>(); // mandatory view model
  public name = input('phone'); // name of the input field
  public readOnly = input(false); // if true, the input field is read-only
  public maxLength = input(PHONE_LENGTH); // max number of characters allowed
  public clearInput = input(true); // show an icon to clear the input field
  public copyable = input(true); // if true, a button to copy the value of the input field is shown

  public showError = input(false);
  public showHelper = input(false);

  public ionInput = viewChild.required<IonInput>('bkPhone');
  public changed = output<string>();

  readonly usPhoneMask: MaskitoOptions = {
    mask: ['+', '1', ' ', '(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
  };
  readonly chPhoneMask: MaskitoOptions = {
    mask: ['+', '4', '1', ' ', /[1-9]/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/],
  };
  readonly maskPredicate: MaskitoElementPredicate = async (el: HTMLElement) => (el as HTMLIonInputElement).getInputElement();

  /*
  tbd: replace with dynamic maskito masks based on countryCode:

  import {maskitoPhoneOptionsGenerator} from '@maskito/phone';
  import metadata from 'libphonenumber-js/mobile/metadata';
 
  export default maskitoPhoneOptionsGenerator({countryIsoCode: 'HU', metadata});
  we did not yet implement this, because we ran into problems with the imports and need to investigate a bit.
  */

  ngAfterViewInit(): void {
    if (this.showError() === true) {
      this.ionInput().errorText = bkTranslate('@input.' + this.name() + '.error');
    }
    if (this.showHelper() === true) {
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
}
