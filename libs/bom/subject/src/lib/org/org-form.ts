import { AfterViewInit, Component, computed, input, model, signal} from '@angular/core';
import { OrgType, OrgTypes } from '@bk/categories';
import { bexioIdMask, BkCatInputComponent, BkDateInputComponent, BkNotesComponent, BkTagsComponent, BkTextInputComponent, chVatMask } from '@bk/ui';
import { OrgFormModel, orgFormModelShape, orgFormValidations } from '@bk/models';
import { AbstractFormComponent } from '@bk/base';
import { IonCol, IonGrid, IonRow } from '@ionic/angular/standalone';
import { OrgTags } from '@bk/util';
import { getOrgNameByOrgType } from './org-form.util';
import { vestForms } from 'ngx-vest-forms';

@Component({
  selector: 'bk-org-form',
  standalone: true,
  imports: [
    vestForms,
    BkCatInputComponent, BkDateInputComponent, BkTextInputComponent, BkTagsComponent, BkNotesComponent,
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
          <bk-cat-input name="orgType" [value]="vm.orgType!" [categories]="orgTypes" [readOnly]="true" />
        </ion-col>
      </ion-row>

      <ion-row>                                                         <!-- orgName -->
        <ion-col size="12">
          <bk-text-input [name]="orgName()" [value]="vm.orgName!" (changed)="updateField('orgName', $event)" autocomplete="organization" [maxLength]=50 [showError]=true [readOnly]="readOnly()" />
        </ion-col>
      </ion-row>

      @if (vm.orgType !== OT.Group) {
        <ion-row>
          <ion-col size="12" size-md="6">                                 <!-- dateOfFoundation -->
            <bk-date-input name="dateOfFoundation" [storeDate]="vm.dateOfFoundation!" (changed)="updateField('dateOfFoundation', $event)" [showError]=true [readOnly]="readOnly()" />
          </ion-col>
  
          <ion-col size="12" size-md="6">                                 <!-- dateOfLiquidation -->
            <bk-date-input name="dateOfLiquidation" [storeDate]="vm.dateOfLiquidation!" (changed)="updateField('dateOfLiquidation', $event)" [showError]=true [readOnly]="readOnly()" />
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
        <ion-row>                                                         <!-- bexio id -->
          <ion-col size="12">
            <bk-text-input name="bexioId" [value]="vm.bexioId!" (changed)="updateField('bexioId', $event)" [maxLength]=6 [mask]="bexioMask" [showError]=true [showHelper]=true [readOnly]="readOnly()" />                                        
          </ion-col>
        </ion-row>
        <ion-row>                                                         <!-- notes -->
          <ion-col>
            <bk-notes [value]="vm.notes ?? ''" (changed)="updateField('notes', $event)" />
          </ion-col>
        </ion-row>
      }
    </ion-grid>
  </form>
}
  `
})
export class OrgFormComponent extends AbstractFormComponent implements AfterViewInit {
  public vm = model.required<OrgFormModel>();
  protected orgName = computed(() => getOrgNameByOrgType(this.vm().orgType));
  public override readOnly = input(!this.authorizationService.hasRole('memberAdmin'));

  protected readonly suite = orgFormValidations;
  protected readonly formValue = signal<OrgFormModel>({});
  protected readonly shape = orgFormModelShape;
  protected readonly errors = signal<Record<string, string>>({ });

  public OT = OrgType;
  public orgTypes = OrgTypes;
  protected orgTags = OrgTags;
  protected bexioMask = bexioIdMask;
  protected vatMask = chVatMask;

  ngAfterViewInit() {
    this.resetForm();
  }
}
