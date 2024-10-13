import { AsyncPipe } from '@angular/common';
import { AfterViewInit, Component, input, output, viewChild } from '@angular/core';
import { TranslatePipe } from '@bk/pipes';
import { IonInput, IonItem } from '@ionic/angular/standalone';
import { BkCopyButtonComponent } from '../form/bk-copy-button';
import { bkTranslate, URL_LENGTH } from '@bk/util';

@Component({
  selector: 'bk-image-url',
  standalone: true,
  imports: [
    TranslatePipe, AsyncPipe,
    IonItem, IonInput,
    BkCopyButtonComponent
  ],
  template: `
  <ion-item lines="none">
      <ion-input #bkUrl [name]="name()" [value]="value()" (ionInput)="onTextChange($event)"
        labelPlacement="floating"
        label="{{'@input.' + name() + '.label' | translate | async }}"
        placeholder="{{'@input.' + name() + '.placeholder' | translate | async }}"
        inputmode="url"
        type="url"
        [counter]="!readOnly()"
        [maxlength]="maxLength()"
        autocomplete="url"
        [clearInput]="clearInput()"
        [readonly]="readOnly()" 
      />
      @if (copyable()) {
        <bk-copy-button [value]="ionInput().value" />
      }
    </ion-item>
  `
})
export class BkImageUrlComponent implements AfterViewInit {
  public value = input.required<string>(); // mandatory view model
  public name = input('url'); // name of the input field
  public readOnly = input(false); // if true, the input field is read-only
  public maxLength = input(URL_LENGTH); // max number of characters allowed
  public clearInput = input(true); // show an icon to clear the input field
  public copyable = input(true); // if true, a button to copy the value of the input field is shown

  public showError = input(false);
  public showHelper = input(false);

  public ionInput = viewChild.required<IonInput>('bkUrl');
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
}
