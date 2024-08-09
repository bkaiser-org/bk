import { AsyncPipe } from '@angular/common';
import { Component, input, model } from '@angular/core';
import { ControlContainer, FormsModule, NgForm } from '@angular/forms';
import { AddressFormModel } from '@bk/models';
import { TranslatePipe } from '@bk/pipes';
import { IonInput, IonItem } from '@ionic/angular/standalone';
import { MaskitoModule } from '@maskito/angular';
import { MaskitoElementPredicateAsync, MaskitoOptions } from '@maskito/core';
import { BkCopyButtonComponent } from '../form/bk-copy-button';

@Component({
  selector: 'bk-iban',
  standalone: true,
  imports: [
    TranslatePipe, AsyncPipe, 
    FormsModule, MaskitoModule,
    IonItem, IonInput,
    BkCopyButtonComponent
  ],
  template: `
    <ion-item lines="none">
      <ion-input #bkIban [(ngModel)]="vm().iban" name="iban" scControlWrapper
        label="{{ label() | translate | async }}"
        labelPlacement="floating"
        inputMode="text"
        type="text"
        [counter]="true"
        [maxlength]="26"
        placeholder="{{ placeholder() | translate | async }}"
        autocomplete="off"
        [clearInput]="true"
        errorText="{{errorText() | translate | async }}"
        helperText="{{helperText() | translate | async }}"
        readonly="{{readOnly()}}"
        [maskito]="chIbanMask"
        [maskitoElement]="maskPredicate" />
      <bk-copy-button [value]="vm().iban" />
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
export class BkIbanComponent {
  public vm = model.required<AddressFormModel>(); // mandatory view model
  public readOnly = input(false); // if true, the input field is read-only
  public label = input('@input.iban.label');
  public placeholder = input('@input.iban.placeholder');
  public errorText = input('@input.iban.error');
  public helperText = input('@input.iban.helper');

  readonly chIbanMask: MaskitoOptions = {
    mask: ['C', 'H', /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\w/, /\w/, /\w/, ' ', /\w/, /\w/, /\w/, /\w/, ' ', /\w/, /\w/, /\w/, /\w/, ' ', /\w/],
  };
  readonly maskPredicate: MaskitoElementPredicateAsync = async (el) => (el as HTMLIonInputElement).getInputElement();
}

