
import { AfterViewInit, Component, computed, inject, input, model, output, viewChild } from '@angular/core';
import { IonIcon, IonInput, IonItem, ModalController } from '@ionic/angular/standalone';
import { AsyncPipe } from '@angular/common';
import { TranslatePipe } from '@bk/pipes';
import { MaskitoDirective } from '@maskito/angular';
import { maskitoDateOptionsGenerator } from '@maskito/kit';
import { MaskitoElementPredicate, MaskitoOptions } from '@maskito/core';
import { bkTranslate, convertDateFormatToString, DATE_LENGTH, DateFormat, getTodayStr, InputMode } from '@bk/util';
import { BkDateSelectModalComponent } from '../modals/date-select.modal';
import { vestFormsViewProviders } from 'ngx-vest-forms';
import { addIcons } from "ionicons";
import { calendarOutline } from "ionicons/icons";

 // tbd: solve this based on the locale. Currently, we only support the swiss locale.
 export const chAnyDate = maskitoDateOptionsGenerator({
  mode: 'dd/mm/yyyy',
  separator: '.',
  min: new Date(1850, 0, 1)
});

export const chPastDate = maskitoDateOptionsGenerator({
  mode: 'dd/mm/yyyy',
  separator: '.',
  min: new Date(1900, 0, 1),
  max: new Date(),
});

export const chFutureDate = maskitoDateOptionsGenerator({
  mode: 'dd/mm/yyyy',
  separator: '.',
  min: new Date()
});

@Component({
  selector: 'bk-date-input',
  standalone: true,
  imports: [
    TranslatePipe, AsyncPipe,
    MaskitoDirective,
    IonItem, IonIcon, IonInput
  ],
  viewProviders: [vestFormsViewProviders],
  template: `
  <ion-item lines="none">
    <ion-icon  name="calendar-outline" slot="start" (click)="selectDate()" />
    <ion-input #bkDateInput [name]="name()" [value]="viewDate()" (ionChange)="dateChangedInField($event)"
      labelPlacement="floating"
      label="{{'@input.' + name() + '.label' | translate | async }}"
      placeholder="{{'@input.' + name() + '.placeholder' | translate | async }}"
      [inputMode]="inputMode()"
      type="text"
      [counter]="true"
      [maxlength]="maxLength()"
      autocomplete="autocomplete()"
      [clearInput]="clearInput()"
      [maskito]="mask()"
      [maskitoElement]="maskPredicate"
      [readonly]="readOnly()"
      />
  `
})
export class BkDateInputComponent implements AfterViewInit {
  protected modalController = inject(ModalController);

  // optional date in STORE_DATE format (yyyymmdd); this is the interface to the view model
  public storeDate = model<string | undefined>(getTodayStr(DateFormat.StoreDate)); 

  // the date in the calendar must be in ISO format (used as input into datetime picker), it may not be empty, instead default is today
  protected isoDate = computed(() => convertDateFormatToString(this.storeDate(), DateFormat.StoreDate, DateFormat.IsoDate, false)); 

   // convert to view date format for the string input field
  protected viewDate = computed(() => convertDateFormatToString(this.storeDate(), DateFormat.StoreDate, DateFormat.ViewDate, false));

  public name = input.required<string>(); // mandatory name of the input field
  public readOnly = input(false); // if true, the input field is read-only
  public clearInput = input(true); // show an icon to clear the input field
  public inputMode = input<InputMode>('text'); // A hint to the browser for which keyboard to display.
  public maxLength = input(DATE_LENGTH);
  public autocomplete = input('off'); // can be set to bday for birth date
  public mask = input<MaskitoOptions>(chAnyDate);

  public showError = input(false);
  public showHelper = input(false);

  public changed = output<string>();
  public ionInput = viewChild.required<IonInput>('bkDateInput');

  constructor() {
    addIcons({calendarOutline});
  }

  protected updateDate(storeDate: string) {
    this.storeDate.update(() => storeDate);
    this.changed.emit(storeDate);
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
   * Update the date with the date changed in the input field (which is in ViewDate format).
   * The date is written into StoreDate format into the view model.
   * @param event contains the date in view date format (dd.mm.yyyy)
   */
  protected dateChangedInField(event: CustomEvent) {
    this.updateDate(convertDateFormatToString(event.detail.value, DateFormat.ViewDate, DateFormat.StoreDate, false));
  }
  
  protected async selectDate(): Promise<void> {
    if (this.readOnly() === true) return;
    // make sure that a date is set, default is today
    const _storeDate = this.storeDate();
    if (!_storeDate || _storeDate.length === 0) {
      this.storeDate.update(() => getTodayStr(DateFormat.StoreDate));
    }
    const _modal = await this.modalController.create({
      component: BkDateSelectModalComponent,
      cssClass: 'date-modal',
      componentProps: {
        isoDate: this.isoDate()
      }
    });
    _modal.present();
    const { data, role } = await _modal.onDidDismiss();
    if (role === 'confirm') {
      if (typeof(data) === 'string') {
        this.updateDate(convertDateFormatToString(data, DateFormat.IsoDate, DateFormat.StoreDate, false));
      } else {
        console.error('BkDateInput.selectDate: type of returned data is not string: ', data);
      }
    }
  }

  protected readonly maskPredicate: MaskitoElementPredicate = async (el: HTMLElement) => (el as HTMLIonInputElement).getInputElement();
}
