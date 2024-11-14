import { AsyncPipe } from '@angular/common';
import { AfterViewInit, Component, effect, input, output, viewChild } from '@angular/core';
import { TranslatePipe } from '@bk/pipes';
import { AutoComplete, bkTranslate, InputMode, PASSWORD_MAX_LENGTH } from '@bk/util';
import { IonInput, IonItem } from '@ionic/angular/standalone';
import { MaskitoElementPredicate, MaskitoOptions } from '@maskito/core';
import { BkCopyButtonComponent } from '../form/bk-copy-button';
import { vestFormsViewProviders } from 'ngx-vest-forms';
import { MaskitoDirective } from '@maskito/angular';

// Masks

// usefull word masks from text-input:
// lowercaseWordMask, uppercaseWordMask, caseInsensitiveWordMask

// passwordMask is used as default in bk-password-input
export const passwordMask: MaskitoOptions = {
  mask: /^[a-zA-Z0-9-_!@?:;äüö$*+&()=]+$/,
};


@Component({
  selector: 'bk-password-input',
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
        <ion-input #bkPasswordInput [name]="name()" [value]="value()" (ionInput)="onPasswordChange($event)"
          labelPlacement="floating"
          label="{{'@input.' + name() + '.label' | translate | async }}"
          placeholder="{{'@input.' + name() + '.placeholder' | translate | async }}"
          [inputMode]="inputMode()"
          type="password"
          [counter]="true"
          [maxlength]="maxLength()"
          [clearInput]="clearInput()"
          [maskito]="mask"
          [maskitoElement]="maskPredicate"
        />
      } 
      @if (copyable()) {
        <bk-copy-button [value]="ionInput().value" />
      }
    </ion-item>
  `
})
export class BkPasswordInputComponent implements AfterViewInit {
  public value = input.required<string>(); // mandatory view model
  public name = input('password'); // name of the input field
  public maxLength = input(PASSWORD_MAX_LENGTH); // max number of characters allowed
  public showError = input(true);
  public showHelper = input(false);
  public setFocus = input(false);
  public ionInput = viewChild.required<IonInput>('bkPasswordInput');

  public autocomplete = input<AutoComplete>('current-password'); // Automated input assistance in filling out form field values
  public clearInput = input(true); // show an icon to clear the input field
  public copyable = input(false); // if true, a button to copy the value of the input field is shown
  public inputMode = input<InputMode>('text'); // A hint to the browser for which keyboard to display.
  public mask = input<MaskitoOptions>(passwordMask);

  public changed = output<string>();

  constructor() {
    effect(() => {
      if (this.setFocus() === true) {
        this.ionInput().setFocus();
      }
    });
  } 

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
  protected onPasswordChange(event: CustomEvent): void {
    this.changed.emit(event.detail.value);
  }

  readonly maskPredicate: MaskitoElementPredicate = async (el: HTMLElement) => (el as HTMLIonInputElement).getInputElement();
}
