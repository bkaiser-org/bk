import { Component, computed, inject, input } from '@angular/core';
import { BkChangeConfirmationComponent, BkHeaderComponent, BkSpinnerComponent } from '@bk/ui';
import { IonButton, IonContent, IonModal, ModalController } from '@ionic/angular/standalone';
import { AsyncPipe } from '@angular/common';
import { TranslatePipe } from '@bk/pipes';
import { AuthorizationService } from '@bk/base';
import { TripFormModel, TripModel } from '@bk/models';
import { convertFormToTrip, convertTripToForm, getTripTitle } from './trip.util';
import { TripFormComponent } from './trip-form';

@Component({
  selector: 'bk-trip-modal',
  standalone: true,
  imports: [
    BkSpinnerComponent, BkHeaderComponent, BkChangeConfirmationComponent, TripFormComponent,
    TranslatePipe, AsyncPipe,
    IonModal, IonContent, IonButton
  ],
  template: `
    <bk-header title="{{ title() | translate | async }}" [isModal]="true" />
    @if(formCanBeSaved) {
        <bk-change-confirmation (okClicked)="save()" />
      } 
    <ion-content>
      @if (vm(); as vm) {
        <bk-trip-form [vm]="vm" (changedData)="onDataChange($event)" (changedFormState)="onFormStateChange($event)" />
      } @else {
        <bk-spinner />
      }
    </ion-content>
  `
})
export class TripModalComponent {
  private modalController = inject(ModalController);
  protected authorizationService = inject(AuthorizationService);

  public trip = input.required<TripModel>();
  protected title = computed(() => getTripTitle(this.trip().bkey));
  public vm = computed(() => convertTripToForm(this.trip()));

  protected formCanBeSaved = false;
  public currentForm: TripFormModel | undefined;

  public onDataChange(form: TripFormModel): void {
    this.currentForm = form;
  }

  public onFormStateChange(formCanBeSaved: boolean): void {
    this.formCanBeSaved = formCanBeSaved;
  }

  public save(): Promise<boolean> {
    if (this.currentForm) {
      return this.modalController.dismiss(convertFormToTrip(this.currentForm), 'confirm');
    }
    return this.modalController.dismiss(null, 'cancel');
  }
}
