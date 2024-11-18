import { AsyncPipe } from '@angular/common';
import { AfterViewInit, Component, input, output, viewChild } from '@angular/core';
import { TranslatePipe } from '@bk/pipes';
import { IonInput, IonItem } from '@ionic/angular/standalone';
import { BkCopyButtonComponent } from '../form/bk-copy-button';
import { bkTranslate, EMAIL_LENGTH } from '@bk/util';

@Component({
  selector: 'bk-email',
  standalone: true,
  imports: [
    TranslatePipe, AsyncPipe, 
    IonItem, IonInput,
    BkCopyButtonComponent
  ],
  template: `
  <ion-item lines="none">
    <ion-input #bkEmail [name]="name()" [value]="value()" (ionInput)="onTextChange($event)" (ionChange)="committed.emit()"
      labelPlacement="floating"
      label="{{'@input.' + name() + '.label' | translate | async }}"
      placeholder="{{'@input.' + name() + '.placeholder' | translate | async }}"
      inputMode="email"
      type="email"
      [counter]="!readOnly()"
      [maxlength]="maxLength()"
      autocomplete="email"
      [clearInput]="clearInput()"
      [readonly]="readOnly()" 
    />
    @if (copyable()) {
        <bk-copy-button [value]="ionInput().value" />
      }
  </ion-item>
  `
})
export class BkEmailComponent implements AfterViewInit {
  public value = input.required<string>(); // mandatory view model
  public name = input('email'); // name of the input field
  public readOnly = input(false); // if true, the input field is read-only
  public maxLength = input(EMAIL_LENGTH); // max number of characters allowed
  public clearInput = input(true); // show an icon to clear the input field
  public copyable = input(true); // if true, a button to copy the value of the input field is shown

  public showError = input(false);
  public showHelper = input(false);

  public ionInput = viewChild.required<IonInput>('bkEmail');
  public changed = output<string>();
  public committed = output<void>();

  ngAfterViewInit(): void {
    const _name = this.name();
    if (_name && !this.readOnly()) {
      if (this.showError() === true) {
        this.ionInput().errorText = bkTranslate(`@input.${_name}.error`);
      }
      if (this.showHelper() === true) {
        this.ionInput().helperText = bkTranslate(`@input.${_name}.helper`);
      }  
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
