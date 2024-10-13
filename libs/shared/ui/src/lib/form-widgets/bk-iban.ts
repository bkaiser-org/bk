import { AsyncPipe } from '@angular/common';
import { AfterViewInit, Component, input, output, viewChild } from '@angular/core';
import { TranslatePipe } from '@bk/pipes';
import { IonInput, IonItem } from '@ionic/angular/standalone';
import { MaskitoElementPredicate, MaskitoOptions } from '@maskito/core';
import { BkCopyButtonComponent } from '../form/bk-copy-button';
import { MaskitoDirective } from '@maskito/angular';
import { bkTranslate, IBAN_LENGTH } from '@bk/util';

@Component({
  selector: 'bk-iban',
  standalone: true,
  imports: [
    TranslatePipe, AsyncPipe, 
    MaskitoDirective,
    IonItem, IonInput,
    BkCopyButtonComponent
  ],
  template: `
    <ion-item lines="none">
      <ion-input #bkIban [name]="name()" [value]="value()" (ionInput)="onTextChange($event)" scControlWrapper
        labelPlacement="floating"
        label="{{'@input.' + name() + '.label' | translate | async }}"
        placeholder="{{'@input.' + name() + '.placeholder' | translate | async }}"
        inputMode="text"
        type="text"
        [counter]="!readOnly()"
        [maxlength]="maxLength()"
        autocomplete="off"
        [clearInput]="clearInput()"
        [readonly]="readOnly()" 
        [maskito]="chIbanMask"
        [maskitoElement]="maskPredicate"
      />
      @if (copyable()) {
        <bk-copy-button [value]="ionInput().value" />
      }
    </ion-item>
  `
})
export class BkIbanComponent implements AfterViewInit {
  public value = input.required<string>(); // mandatory view model
  public name = input('iban'); // name of the input field
  public readOnly = input(false); // if true, the input field is read-only
  public maxLength = input(IBAN_LENGTH); // max number of characters allowed
  public clearInput = input(true); // show an icon to clear the input field
  public copyable = input(true); // if true, a button to copy the value of the input field is shown

  public showError = input(true);
  public showHelper = input(true);

  public ionInput = viewChild.required<IonInput>('bkIban');
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

  readonly chIbanMask: MaskitoOptions = {
    mask: ['C', 'H', /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\w/, /\w/, /\w/, ' ', /\w/, /\w/, /\w/, /\w/, ' ', /\w/, /\w/, /\w/, /\w/, ' ', /\w/],
  };
  readonly maskPredicate: MaskitoElementPredicate = async (el: HTMLElement) => (el as HTMLIonInputElement).getInputElement();
}

