import { AsyncPipe } from '@angular/common';
import { Component, input, model } from '@angular/core';
import { ControlContainer, FormsModule, NgForm } from '@angular/forms';
import { OrgNewFormModel, PersonNewFormModel } from '@bk/models';
import { TranslatePipe } from '@bk/pipes';
import { IonInput, IonItem } from '@ionic/angular/standalone';
import { BkCopyButtonComponent } from '../form/bk-copy-button';

@Component({
  selector: 'bk-email',
  standalone: true,
  imports: [
    TranslatePipe, AsyncPipe, 
    FormsModule,
    IonItem, IonInput,
    BkCopyButtonComponent
  ],
  template: `
  <ion-item lines="none">
    <ion-input #bkEmail [(ngModel)]="vm().email" name="email"
      label="{{ label() | translate | async }}"
      labelPlacement="floating"
      inputMode="email"
      type="email"
      [counter]="true"
      [maxlength]="50"
      placeholder="{{ placeholder() | translate | async }}"
      autocomplete="email"
      [clearInput]="true"
      errorText="{{ errorText() | translate | async }}"
      readonly="{{readOnly()}}">
    </ion-input>
    <bk-copy-button [value]="vm().email" />
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
export class BkEmailComponent {
  public vm = model.required<OrgNewFormModel | PersonNewFormModel>(); // mandatory view model
  public readOnly = input(false); // if true, the input field is read-only
  public label = input('@input.email.label');
  public placeholder = input('@input.email.placeholder');
  public errorText = input('@input.email.error');
}
