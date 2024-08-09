import { Component, computed, inject, input } from '@angular/core';
import { BkChangeConfirmationComponent, BkHeaderComponent, BkSpinnerComponent } from '@bk/ui';
import { IonButton, IonContent, IonModal, ModalController } from '@ionic/angular/standalone';
import { AsyncPipe } from '@angular/common';
import { TranslatePipe } from '@bk/pipes';
import { AuthorizationService } from '@bk/base';
import { LocationFormModel, LocationModel } from '@bk/models';
import { convertFormToLocation, convertLocationToForm, getLocationTitle } from './location.util';
import { LocationFormComponent } from './location-form';

@Component({
  selector: 'bk-location-modal',
  standalone: true,
  imports: [
    BkSpinnerComponent, BkHeaderComponent, BkChangeConfirmationComponent, LocationFormComponent,
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
        <bk-location-form [vm]="vm" (changedData)="onDataChange($event)" (changedFormState)="onFormStateChange($event)" />
      } @else {
        <bk-spinner />
      }
    </ion-content>
  `
})
export class LocationModalComponent {
  private modalController = inject(ModalController);
  protected authorizationService = inject(AuthorizationService);

  public location = input.required<LocationModel>();
  protected title = computed(() => getLocationTitle(this.location().bkey));
  protected vm = computed(() => convertLocationToForm(this.location()));

  protected formCanBeSaved = false;
  public currentForm: LocationFormModel | undefined;

  public onDataChange(form: LocationFormModel): void {
    this.currentForm = form;
  }

  public onFormStateChange(formCanBeSaved: boolean): void {
    this.formCanBeSaved = formCanBeSaved;
  }

  public save(): Promise<boolean> {
    if (this.currentForm) {
      return this.modalController.dismiss(convertFormToLocation(this.currentForm), 'confirm');
    }
    return this.modalController.dismiss(null, 'cancel');
  }
}
