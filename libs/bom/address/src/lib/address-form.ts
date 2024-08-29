import { AfterViewInit, Component, OnInit, inject, model, signal } from '@angular/core';
import { AddressChannel, AddressChannels, AddressUsage, AddressUsages, getCategoryName } from '@bk/categories';
import { BkCheckComponent, BkNotesComponent, BkTagsComponent, BkSpinnerComponent, BkEmailComponent, BkPhoneComponent, BkIbanComponent, BkTextInputComponent, BkCatInputComponent } from '@bk/ui';
import { AddressFormModel, addressFormModelShape, addressFormValidations } from '@bk/models';
import { SwissCitySelectComponent } from './swissCities/swiss-city-select.modal';
import { IonCol, IonGrid, IonInput, IonRow, ModalController } from '@ionic/angular/standalone';
import { AbstractFormComponent } from '@bk/base';
import { AddressTags } from '@bk/util';
import { vestForms } from 'ngx-vest-forms';

@Component({
  selector: 'bk-address-form',
  standalone: true,
  imports: [
    vestForms,
    BkCatInputComponent, BkTextInputComponent, BkCheckComponent, BkTagsComponent, BkNotesComponent, BkSpinnerComponent,
    BkEmailComponent, BkPhoneComponent, BkIbanComponent,
    IonGrid, IonRow, IonCol, IonInput
],
  template: `
  @if(vm(); as vm) {
  <form scVestForm
    [formShape]="shape"
    [formValue]="formValue()"
    [suite]="suite" 
    (formValueChange)="formValue.set($event)">

    <ion-grid>
      <!---------------------------------------------------
        CHANNEL, USAGE, VALUE 
        --------------------------------------------------->
      <ion-row>
        <ion-col size="12" size-md="6">                                               <!-- addressChannel -->
          <bk-cat-input name="addressChannel" [value]="vm.addressChannel!" [categories]="addressChannels" (changed)="updateField('addressChannel', $event)" [readOnly]="isChannelReadOnly" />
        </ion-col>

        @if(vm.addressChannel === AC.Custom) {
          <ion-col size="12" size-md="6">                                             <!-- addressChannelLabel -->
            <bk-text-input name="addressChannelLabel" [value]="vm.addressChannelLabel!" (changed)="updateField('addressChannelLabel', $event)" [readOnly]="readOnly()" [showError]=true />
          </ion-col>
        }
      </ion-row>

      <ion-row>
        <ion-col size="12" size-md="6">                                               <!-- addressUsage -->
          <bk-cat-input name="addressUsage" [value]="vm.addressUsage!" [categories]="addressUsages" (changed)="updateField('addressUsage', $event)" [readOnly]="readOnly()" />
        </ion-col>

        @if(vm.addressUsage === AU.Custom) {
          <ion-col size="12" size-md="6">                                             <!-- addressUsageLabel -->
            <bk-text-input name="addressUsageLabel" [value]="vm.addressUsageLabel!" (changed)="updateField('addressUsageLabel', $event)" [readOnly]="readOnly()" [showError]=true />
          </ion-col>
        }
      </ion-row>

      @switch (vm.addressChannel) {
        @case (AC.Email) {
          <ion-row>
            <ion-col size="12">                                     <!-- email -->
              <bk-email [value]="vm.email!" [readOnly]="readOnly()" (changed)="updateEmail($event)" />
            </ion-col>
          </ion-row>
        }
        @case (AC.Phone) {
          <ion-row>
            <ion-col size="12">                                      <!-- phone -->
              <bk-phone [value]="vm.phone!" [readOnly]="readOnly()" (changed)="updatePhone($event)" />
            </ion-col>
          </ion-row>
        }
        @case (AC.Postal) {
          <ion-row>
            <ion-col size="12" size-md="6">                                               <!-- street -->
              <bk-text-input name="street" [value]="vm.street!" (changed)="updateField('street', $event)"  autocomplete="street-address" [maxLength]=50 [readOnly]="readOnly()" [showError]=true />
            </ion-col>
    
            <ion-col size="12" size-md="6">                                               <!-- addressValue2 -->
              <bk-text-input name="addressValue2" [value]="vm.addressValue2!" (changed)="updateField('addressValue2', $event)" [maxLength]=50 [readOnly]="readOnly()" />
            </ion-col>
          </ion-row>

          <ion-row (click)="selectSwissCity()">
            <ion-col size="12" size-md="3">                                               <!-- country -->
             <bk-text-input name="countryCode" [value]="vm.countryCode!" [readOnly]="true" />
            </ion-col>
    
            <ion-col size="12" size-md="3">                                               <!-- zipCode -->
              <bk-text-input name="zipCode" [value]="vm.zipCode!" [readOnly]="true" />
            </ion-col>
            
            <ion-col size="12" size-md="6">                                                <!-- city -->
              <bk-text-input name="city" [value]="vm.city!" [readOnly]="true" />
            </ion-col>
          </ion-row>
        }
        @case (AC.BankAccount) {
          <ion-row>
            <ion-col size="12">                                                           <!-- iban -->
              <bk-iban [value]="vm.iban!" [readOnly]="readOnly()" (changed)="updateIban($event)" />
            </ion-col>
          </ion-row>
        }
        @default {
          <ion-row>
            <ion-col size="12">                                                           <!-- addressValue -->
              <bk-text-input name="addressValue" [value]="vm.addressValue!" (changed)="updateField('addressValue', $event)" [readOnly]="readOnly()" [showError]=true />
            </ion-col>
          </ion-row>
        }
      }

      <!---------------------------------------------------
        OTHER 
        --------------------------------------------------->
      <ion-row>
        @if(vm.isCc === false && isFavorable(vm)) {                                     <!-- isFavorite -->
          <ion-col size="12" size-md="6">
            <bk-check name="isFavorite" [isChecked]="vm.isFavorite!" (changed)="onFavoriteChange(vm, $event)" />
          </ion-col>  
        }

        @if(vm.isFavorite === false && vm.addressChannel === AC.Email) {                <!-- isCc -->
          <ion-col size="12" size-md="6">
            <bk-check name="isCc" [isChecked]="vm.isCc!" (changed)="onCcChange(vm, $event)" />
          </ion-col>  
        }
      </ion-row>

      <!---------------------------------------------------
        TAG, NOTES 
        --------------------------------------------------->
      @if(authorizationService.isPrivileged()) {
        <ion-row>                                                                        <!-- tags -->
          <ion-col>
            <bk-tags storedTags="{{vm.tags}}" [allTags]="addressTags" (changedTags)="onTagsChanged($event)" [readOnly]="readOnly()" />
          </ion-col>
        </ion-row>
      }

      @if(authorizationService.isAdmin()) {
        <ion-row>                                                                       <!-- notes -->
          <ion-col>
          <bk-notes [value]="vm.notes ?? ''" (changed)="updateField('notes', $event)" />
          </ion-col>
        </ion-row>    
      }
    </ion-grid>
  </form>
} @else {
  <bk-spinner />
}
`
})
export class AddressFormComponent extends AbstractFormComponent implements AfterViewInit, OnInit {
  protected modalController = inject(ModalController);
  public vm = model.required<AddressFormModel>();

  protected readonly suite = addressFormValidations;
  protected readonly formValue = signal<AddressFormModel>({});
  protected shape = addressFormModelShape;
  protected readonly errors = signal<Record<string, string>>({ });

  protected isChannelReadOnly = false;
  public AC = AddressChannel;
  public AU = AddressUsage;
  public addressChannels = AddressChannels;
  public addressUsages = AddressUsages;
  public addressTags = AddressTags;
  
  ngAfterViewInit() {
    this.resetForm();
  }

  ngOnInit(): void {
    const _bkey = this.vm().bkey;
    if (!_bkey || _bkey.length === 0) { // new address, make the channel editable (if user has permission)
      this.isChannelReadOnly = this.readOnly();
    } else {  // existing address, channel should not be editable
      this.isChannelReadOnly = true;
    }
  }

  public isFavorable(vm: AddressFormModel): boolean {
    return vm.addressChannel === (AddressChannel.Email as number) || vm.addressChannel === (AddressChannel.Phone as number) || vm.addressChannel === (AddressChannel.Postal as number);
  }

  public getChannelLabel(vm: AddressFormModel, labelName: 'label' | 'placeholder'): string {
    return vm.addressChannel ? `subject.address.channel.${getCategoryName(AddressChannels, vm.addressChannel)}.${labelName}` : '';
  }

  public onFavoriteChange(vm: AddressFormModel, isFavorite: boolean): void {
    vm.isFavorite = isFavorite;
  }

  public onCcChange(vm: AddressFormModel, isCc: boolean): void {
    vm.isCc = isCc;
  }

  public async selectSwissCity(): Promise<void> {
    if (this.readOnly() === true) return;
    const _modal = await this.modalController.create({
      component: SwissCitySelectComponent,
      componentProps: {
        vm: this.vm
      }
    });
    _modal.present();
    const { data, role } = await _modal.onDidDismiss();
    if (role === 'confirm') {
      if (data) {
        this.updateField('zipCode', String(data.zipCode));
        this.updateField('countryCode', String(data.countryCode));
        this.updateField('city', String(data.name));
      }
    }
  }

  protected updateEmail($event: string): void {
    this.updateField('addressValue', $event);
    this.updateField('email', $event);
  }

  protected updatePhone($event: string): void {
    this.updateField('addressValue', $event);
    this.updateField('phone', $event);
  }

  protected updateIban($event: string): void {
    this.updateField('addressValue', $event);
    this.updateField('iban', $event);
  }

  protected onChannelChange($event: Event): void {
    this.onCategoryChange($event, 'addressChannel');
  }
}