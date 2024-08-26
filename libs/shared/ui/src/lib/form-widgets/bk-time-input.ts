
import { Component, inject, input, output } from '@angular/core';
import { IonIcon, IonInput, IonItem, ModalController } from '@ionic/angular/standalone';
import { AsyncPipe } from '@angular/common';
import { TranslatePipe } from '@bk/pipes';
import { maskitoTimeOptionsGenerator } from '@maskito/kit';
import { MaskitoElementPredicate } from '@maskito/core';
import { BkTimeSelectModalComponent } from '../modals/time-select.modal';
import { getCurrentTime, InputMode } from '@bk/util';
import { MaskitoDirective } from '@maskito/angular';
import { addIcons } from "ionicons";
import { calendarOutline } from "ionicons/icons";

@Component({
  selector: 'bk-time-input',
  standalone: true,
  imports: [
    TranslatePipe, AsyncPipe,
    MaskitoDirective,
    IonItem, IonIcon, IonInput
  ],
  template: `
  <ion-item lines="none">
    <ion-icon  name="calendar-outline" slot="start" (click)="selectTime()" />
    <ion-input #bkTimeInput [name]="name()" [value]="value()"
      (ionChange)="timeChangedInField($event)"
      labelPlacement="floating"
      label="{{'@input.' + name() + '.label' | translate | async }}"
      placeholder="{{'@input.' + name() + '.placeholder' | translate | async }}"
      [inputMode]="inputMode()"
      [counter]="true"
      [maxlength]="5"
      autocomplete="off"
      [clearInput]="clearInput()"
      [maskito]="chTimeMask"
      [maskitoElement]="maskPredicate"
      [readonly]="readOnly()"
      />
  `
})
export class BkTimeInputComponent {
  protected modalController = inject(ModalController);

  public value = input.required<string>(); // mandatory view model
  public name = input.required<string>(); // mandatory name of the input field
  public readOnly = input(false); // if true, the input field is read-only
  public clearInput = input(true); // show an icon to clear the input field
  public inputMode = input<InputMode>('text'); // A hint to the browser for which keyboard to display.
  
  public changed = output<string>();

  constructor() {
    addIcons({calendarOutline});
  }

  /**
   * Update the date with the date changed in the input field (ViewDate format).
   * The date is written in IsoDate format into the view model.
   * @param event contains the date in view date format (dd.mm.yyyy)
   */
  protected timeChangedInField(event: CustomEvent) {
    this.changed.emit(event.detail.value);
  }

  protected async selectTime(time?: string): Promise<void> {
    const _time = time && time.length === 5 ? time : getCurrentTime();
    if (this.readOnly() === true) return;
    const _modal = await this.modalController.create({
      component: BkTimeSelectModalComponent,
      cssClass: 'time-modal',
      componentProps: {
        time: _time
      }
    });
    _modal.present();
    const { data, role } = await _modal.onDidDismiss();
    if (role === 'confirm') {
      if (typeof(data) === 'string' && data.length === 5) {
        this.changed.emit(data);
      } else {
        console.error('BkTimeInputComponent.selectTime: type of returned data is not string or not 5 chars long: ', data);
      }
    }
  }


  protected readonly chTimeMask = maskitoTimeOptionsGenerator({
    mode: 'HH:MM'
  });

  protected readonly maskPredicate: MaskitoElementPredicate = async (el: HTMLElement) => (el as HTMLIonInputElement).getInputElement();
}
