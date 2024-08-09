import { AsyncPipe } from '@angular/common';
import { Component, input, model } from '@angular/core';
import { ControlContainer, FormsModule, NgForm } from '@angular/forms';
import { AddressFormModel, OrgNewFormModel, PersonNewFormModel } from '@bk/models';
import { TranslatePipe } from '@bk/pipes';
import { IonInput, IonItem } from '@ionic/angular/standalone';
import { MaskitoDirective } from '@maskito/angular';
import { MaskitoElementPredicate, MaskitoOptions } from '@maskito/core';
import { BkCopyButtonComponent } from '../form/bk-copy-button';

@Component({
  selector: 'bk-phone',
  standalone: true,
  imports: [
    TranslatePipe, AsyncPipe,
    FormsModule, MaskitoDirective,
    IonItem, IonInput,
    BkCopyButtonComponent
  ],
  template: `
  <ion-item lines="none">
    <ion-input #input [(ngModel)]="vm().phone" name="phone"
      label="{{ label() | translate | async }}"
      labelPlacement="floating"
      inputMode="tel"
      type="tel"
      [counter]="true"
      [maxlength]="30"
      placeholder="{{ placeholder() | translate | async }}"
      autocomplete="tel"
      [clearInput]="true"
      errorText="{{errorText() | translate | async }}"
      readonly="{{readOnly()}}"
      [maskito]="chPhoneMask"
      [maskitoElement]="maskPredicate" />
    <bk-copy-button [value]="vm().phone" />
  </ion-item>
  `,
  /* 
   * BIG TROUBLE WITHOUT THIS VIEWPROVIDER
   * See Kara's talk: https://youtu.be/CD_t3m2WMM8?t=1826
   * COMMENT OUT to see:
   * - NgForm has no controls! Controls are detached from the form.
   * - Form-level status values (touched, valid, etc.) no longer change
   * - Controls still validate, update model, and update their statuses
   */
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
})
export class BkPhoneComponent {
  public vm = model.required<OrgNewFormModel | PersonNewFormModel | AddressFormModel>(); // mandatory view model
  public readOnly = input(false); // if true, the input field is read-only
  public label = input('@input.phone.label');
  public placeholder = input('@input.phone.placeholder');
  public errorText = input('@input.phone.error');

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
}
