import { AfterViewInit, Component, computed, inject, input, model, signal } from '@angular/core';
import { OrgType, OrgTypes } from '@bk/categories';
import { BkCatInputComponent, BkDateInputComponent, BkEmailComponent, BkNotesComponent, BkPhoneComponent, BkSpinnerComponent, BkTagsComponent, BkTextInputComponent, chVatMask } from '@bk/ui';
import { OrgNewFormModel, orgNewFormModelShape, orgNewValidations } from '@bk/models';
import { SwissCitySelectComponent } from '@bk/address';
import { AbstractFormComponent } from '@bk/base';
import { IonCol, IonGrid, IonRow, ModalController } from '@ionic/angular/standalone';
import { OrgTags } from '@bk/util';
import { getOrgNameByOrgType } from './org-form.util';
import { vestForms } from 'ngx-vest-forms';

@Component({
  selector: 'bk-org-new-form',
  standalone: true,
  imports: [
    vestForms,
    BkDateInputComponent, BkCatInputComponent, BkPhoneComponent, BkEmailComponent, BkSpinnerComponent,
    BkTagsComponent, BkNotesComponent, SwissCitySelectComponent, BkTextInputComponent,
    IonGrid, IonRow, IonCol
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
        ORGANISATION 
        --------------------------------------------------->
      <ion-row>                                                         <!-- orgType -->
        <ion-col size="12" size-md="6">
          <bk-cat-input name="orgType" [value]="vm.orgType!" [categories]="orgTypes" (changed)="updateField('orgType', $event)" [readOnly]="readOnly()" />
        </ion-col>
      </ion-row>

      <ion-row>                                                         <!-- orgName -->
        <ion-col size="12">
          <bk-text-input [name]="orgName()" [value]="vm.orgName!" (changed)="updateField('orgName', $event)" autocomplete="organization" [maxLength]=50 [showError]=true [readOnly]="readOnly()" />
        </ion-col>
      </ion-row>

      @if(vm.orgType !== OT.Group) {
        <ion-row>
          <ion-col size="12" size-md="6">                                 <!-- dateOfFoundation -->
            <bk-date-input name="dateOfFoundation" [storeDate]="vm.dateOfFoundation!" (changed)="updateField('dateOfFoundation', $event)" [readOnly]="readOnly()" />
          </ion-col>
  
          <ion-col size="12" size-md="6">                                 <!-- dateOfLiquidation -->
          <bk-date-input name="dateOfLiquidation" [storeDate]="vm.dateOfLiquidation!" (changed)="updateField('dateOfLiquidation', $event)" [readOnly]="readOnly()" />
          </ion-col>
        </ion-row>
  
      <!---------------------------------------------------
        ADDRESS 
        --------------------------------------------------->
        <ion-row>                                                                         <!-- street -->
          <ion-col size="12" size-md="6">
            <bk-text-input name="street" [value]="vm.street!" (changed)="updateField('street', $event)" autocomplete="street-address" [maxLength]=50 [readOnly]="readOnly()" />                                        
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

        <ion-row>
          <ion-col size="12" size-md="6">                                               <!-- phone -->
            <bk-phone [vm]="vm" [readOnly]="readOnly()" />
          </ion-col>

          <ion-col size="12" size-md="6">                                  <!-- email -->
            <bk-email [vm]="vm" [readOnly]="readOnly()" />
          </ion-col>
        </ion-row>

      <!---------------------------------------------------
        OTHER  
        --------------------------------------------------->
        <ion-row>
          <ion-col size="12" size-md="6">                                 <!-- taxId (VAT, MwSt) -->
            <bk-text-input name="taxId" [value]="vm.taxId!" (changed)="updateField('taxId', $event)" [maxLength]=20 [mask]="vatMask" [showError]=true [showHelper]=true [readOnly]="readOnly()" />
          </ion-col>
        </ion-row>
      }


      <!---------------------------------------------------
        TAG, NOTES 
        --------------------------------------------------->
      @if(authorizationService.isPrivileged()) {
        <ion-row>                                                         <!-- tags -->
          <ion-col>
            <bk-tags storedTags="{{vm.tags}}" [allTags]="orgTags" (changedTags)="onTagsChanged($event)" [readOnly]="readOnly()" />
          </ion-col>
        </ion-row>
      }

      @if(authorizationService.isAdmin()) {
        <ion-row>                                                         <!-- notes -->
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
export class OrgNewFormComponent extends AbstractFormComponent implements AfterViewInit {
  protected modalController = inject(ModalController);
  public vm = model.required<OrgNewFormModel>();
  protected orgName = computed(() => getOrgNameByOrgType(this.vm().orgType));
  public override readOnly = input(!this.authorizationService.hasRole('memberAdmin'));

  protected readonly suite = orgNewValidations;
  protected readonly formValue = signal<OrgNewFormModel>({});
  protected readonly shape = orgNewFormModelShape;

  public OT = OrgType;
  protected orgTypes = OrgTypes;
  protected orgTags = OrgTags;
  protected vatMask = chVatMask;

  ngAfterViewInit() {
    this.resetForm();
  }

  public async selectSwissCity(): Promise<void> {
    if (this.readOnly() === true) return;
    const _modal = await this.modalController.create({
      component: SwissCitySelectComponent,
      componentProps: {
        vm: this.vm()
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
}
