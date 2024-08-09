import { AfterViewInit, Component, computed, inject, model, signal } from '@angular/core';
import { BkCatInputComponent, BkDateInputComponent, BkEmailComponent, BkNotesComponent, BkNumberInputComponent, BkPhoneComponent, BkTagsComponent, BkTextInputComponent, chSsnMask } from '@bk/ui';
import { GenderTypes, getMembershipCategories, getDefaultMembershipCategory } from '@bk/categories';
import { PersonNewFormModel, personNewFormModelShape, personNewValidations } from '@bk/models';
import { SwissCitySelectComponent } from '@bk/address';
import { AbstractFormComponent } from '@bk/base';
import { IonCol, IonGrid, IonRow, ModalController } from '@ionic/angular/standalone';
import { PersonTags } from '@bk/util';
import { vestForms } from 'ngx-vest-forms';

@Component({
  selector: 'bk-person-new-form',
  standalone: true,
  imports: [
    vestForms,
    BkTextInputComponent, BkDateInputComponent, BkCatInputComponent, BkPhoneComponent, BkEmailComponent, 
    BkNumberInputComponent, BkTagsComponent, BkNotesComponent, SwissCitySelectComponent,
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
        PERSON 
        --------------------------------------------------->
      <ion-row>
        <ion-col size="12" size-md="6">                                     <!-- firstName -->
         <bk-text-input name="firstName" [value]="vm.firstName!" (changed)="updateField('firstName', $event)" autocomplete="given-name" [autofocus]="true" [maxLength]=30 [showError]=true [readOnly]="readOnly()" />                                        
        </ion-col>

        <ion-col size="12" size-md="6">                                     <!-- name (lastName)-->
          <bk-text-input name="lastName" [value]="vm.lastName!" (changed)="updateField('lastName', $event)" autocomplete="family-name" [maxLength]=30 [showError]=true [readOnly]="readOnly()" />                                        
        </ion-col>

        <ion-col size="12" size-md="6">                                     <!-- dateOfBirth -->
          <bk-date-input name="dateOfBirth" [storeDate]="vm.dateOfBirth!" (changed)="updateField('dateOfBirth', $event)" autocomplete="bday" [showError]=true [showHelper]=true [readOnly]="readOnly()" />
        </ion-col>

        <ion-col size="12" size-md="6">                                     <!-- dateOfDeath -->
          <bk-date-input name="dateOfDeath" [storeDate]="vm.dateOfDeath!" (changed)="updateField('dateOfDeath', $event)" [showError]=true [showHelper]=true [readOnly]="readOnly()" />
        </ion-col>
        
        <ion-col size="12" size-md="6">                                     <!-- gender -->
          <bk-cat-input name="gender" [value]="vm.gender!" [categories]="genderTypes" (changed)="updateField('gender', $event)" [readOnly]="readOnly()" />
        </ion-col>
      </ion-row>

      <!---------------------------------------------------
        ADDRESS 
        --------------------------------------------------->
      <ion-row>
        <ion-col size="12" size-md="6">                                      <!-- street -->
          <bk-text-input name="street" [value]="vm.street!" (changed)="updateField('street', $event)" autocomplete="street-address" [maxLength]=50 [showError]=true [readOnly]="readOnly()" />                                        
        </ion-col>
      </ion-row>

      <ion-row (click)="selectSwissCity()">
        <ion-col size="12" size-md="3">                                      <!-- countryCode -->
          <bk-text-input name="countryCode" [value]="vm.countryCode!" [maxLength]=2 [readOnly]="true" />                                        
        </ion-col>

        <ion-col size="12" size-md="3">                                      <!-- zipCode -->
          <bk-text-input name="zipCode" [value]="vm.zipCode!" [maxLength]=4 [readOnly]="true" />                                        
        </ion-col>

        <ion-col size="12" size-md="6">                                       <!-- city -->
          <bk-text-input name="city" [value]="vm.city!" [maxLength]=30 [readOnly]="true" />                                        
        </ion-col>
      </ion-row>

      <ion-row>
        <ion-col size="12" size-md="6">                                      <!-- phone -->
          <bk-phone [vm]="vm" [readOnly]="readOnly()" />
        </ion-col>

        <ion-col size="12" size-md="6">                                     <!-- email -->
          <bk-email [vm]="vm" [readOnly]="readOnly()" />
        </ion-col>
      </ion-row>

      <!---------------------------------------------------
        OTHER  
        --------------------------------------------------->
      <ion-row>
        <ion-col size="12" size-md="6">                                 <!-- SSN / AHV -->
          <bk-text-input name="ssn" [value]="vm.ssn!" (changed)="updateField('ssn', $event)" [maxLength]=16 [mask]="ssnMask" [showError]=true [showHelper]=true [copyable]=true [readOnly]="readOnly()" />                                        
        </ion-col>
      </ion-row>

      <!---------------------------------------------------
        MEMBERSHIP 
        --------------------------------------------------->
      @if(vm.orgId && vm.orgId.length !== 0) {
        <ion-row>
          <ion-col size="12" size-md="6">                                 <!-- dateOfEntry -->
            <bk-date-input name="dateOfEntry" [storeDate]="vm.dateOfEntry!" (changed)="updateField('dateOfEntry', $event)" [showError]=true [showHelper]=true [readOnly]="readOnly()" />
          </ion-col>
  
          <ion-col size="12" size-md="6">                                 <!-- dateOfExit -->
            <bk-date-input name="dateOfExit" [storeDate]="vm.dateOfExit!" (changed)="updateField('dateOfExit', $event)" [showError]=true [showHelper]=true [readOnly]="readOnly()" />
          </ion-col>
  
          <ion-col size="12" size-md="6">                                <!-- memberCategory -->
            <bk-cat-input name="memberCategory" [value]="vm.memberCategory ?? defaultMemberCategory()" 
              [categories]="memberCategories()" (changed)="updateField('memberCategory', $event)" [readOnly]="readOnly()"/>                                                               
          </ion-col>
        </ion-row>
      }

      <!---------------------------------------------------
        TAG, NOTES, DEBUG 
        --------------------------------------------------->
      @if(authorizationService.isPrivileged()) {
        <ion-row>                                                          <!-- tags -->
          <ion-col>
            <bk-tags storedTags="{{vm.tags}}" [allTags]="personTags" (changedTags)="onTagsChanged($event)" [readOnly]="readOnly()" />
          </ion-col>
        </ion-row>
      }
    
      @if(authorizationService.isAdmin()) {
        <ion-row>                                                           <!-- notes -->
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
export class PersonNewFormComponent extends AbstractFormComponent implements AfterViewInit {
  protected modalController = inject(ModalController);
  public vm = model.required<PersonNewFormModel>(); // current view model for editing
  protected memberCategories = computed(() => getMembershipCategories(this.vm().orgId));
  protected defaultMemberCategory = computed(() => getDefaultMembershipCategory(this.vm().orgId));

  public readonly suite = personNewValidations;
  protected readonly formValue = signal<PersonNewFormModel>({});
  protected readonly shape = personNewFormModelShape;
  protected readonly errors = signal<Record<string, string>>({ });

  public genderTypes = GenderTypes;
  public personTags = PersonTags;
  protected ssnMask = chSsnMask;

  ngAfterViewInit() {
    this.resetForm();
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

}
