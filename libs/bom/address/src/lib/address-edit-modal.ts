import { Component, computed, inject, input } from '@angular/core';
import { BkChangeConfirmationComponent, BkHeaderComponent, BkSpinnerComponent } from '@bk/ui';
import { AddressFormModel, AddressModel } from '@bk/models';
import { AddressFormComponent } from './address-form';
import { getAddressModalTitle } from './address.util';
import { convertAddressToForm, convertFormToAddress } from './address-form.util';
import { AsyncPipe } from '@angular/common';
import { TranslatePipe } from '@bk/pipes';
import { AuthorizationService } from '@bk/base';
import { ModelType } from '@bk/categories';
import { IonContent, ModalController } from '@ionic/angular/standalone';

@Component({
  selector: 'bk-address-edit-modal',
  standalone: true,
  imports: [
    BkSpinnerComponent, AddressFormComponent, BkHeaderComponent, BkChangeConfirmationComponent,
    IonContent,
    TranslatePipe, AsyncPipe
  ],
  template: `
    <bk-header title="{{ title() | translate | async }}" [isModal]="true" />
    @if(formCanBeSaved) {
        <bk-change-confirmation (okClicked)="save()" />
      } 
    <ion-content>
      @if (vm()) {
        <bk-address-form [vm]="vm()" [readOnly]="readOnly()" (changedData)="onDataChange($event)" (changedFormState)="onFormStateChange($event)" />
      } @else {
        <bk-spinner />
      }
    </ion-content>
  `
})
export class AddressEditModalComponent {
  private readonly modalController = inject(ModalController);
  protected authorizationService = inject(AuthorizationService);

  public address = input.required<AddressModel>();
  public readOnly = input(false); // if the modal is used in the profile page, we need to set readOnly differently
  public parentType = input.required<ModelType>();
  public title = computed(() => getAddressModalTitle(this.address().bkey));
  public vm = computed(() => convertAddressToForm(this.address())); 

  protected formCanBeSaved = false;
  public currentForm: AddressFormModel | undefined;

  public onDataChange(form: AddressFormModel): void {
    this.currentForm = form;
  }

  public onFormStateChange(formCanBeSaved: boolean): void {
    this.formCanBeSaved = formCanBeSaved;
  }

  public save(): Promise<boolean> {
    if (this.currentForm) {
      return this.modalController.dismiss(convertFormToAddress(this.currentForm), 'confirm');
    }
    return this.modalController.dismiss(null, 'cancel');
  }
}
