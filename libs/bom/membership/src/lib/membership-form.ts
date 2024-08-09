/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { AfterViewInit, Component, computed, input, model, signal } from '@angular/core';
import { GenderTypes, getDefaultMembershipCategory, getMembershipCategories, getMembershipState, MembershipStates } from '@bk/categories';
import { bexioIdMask, BkButtonComponent, BkCatInputComponent, BkDateInputComponent, BkIbanComponent, BkNotesComponent, BkNumberInputComponent, BkTagsComponent, BkTextInputComponent } from '@bk/ui';
import { MembershipFormModel, membershipFormModelShape, membershipFormValidations } from '@bk/models';
import { AbstractFormComponent } from '@bk/base';
import { IonCol, IonGrid, IonRow } from '@ionic/angular/standalone';
import { TranslatePipe } from '@bk/pipes';
import { AsyncPipe } from '@angular/common';
import { MembershipTags } from '@bk/util';
import { vestForms } from 'ngx-vest-forms';

@Component({
  selector: 'bk-membership-form',
  standalone: true,
  imports: [
    TranslatePipe, AsyncPipe, vestForms,
    BkCatInputComponent, BkTextInputComponent, BkDateInputComponent,
    BkButtonComponent, BkNumberInputComponent, BkIbanComponent, BkTagsComponent, BkNotesComponent,
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
        <ion-row>
        <!---------------------------------------------------
        PERSON 
        --------------------------------------------------->
          <ion-col size="12" size-md="6">                                                         <!-- firstName -->
            <bk-text-input name="firstName" [value]="vm.firstName!" (changed)="updateField('firstName', $event)" autocomplete="given-name" [maxLength]=30 [showError]=true [readOnly]="readOnly()" />                                        
          </ion-col>
    
          <ion-col size="12" size-md="6">                                                         <!-- name (lastName)-->
            <bk-text-input name="lastName" [value]="vm.lastName!" (changed)="updateField('lastName', $event)"autocomplete="family-name"  [maxLength]=30 [showError]=true [readOnly]="readOnly()" />                                        
          </ion-col>
        </ion-row>

        <!---------------------------------------------------
        MEMBERSHIP
        --------------------------------------------------->
        <ion-row>
          <ion-col size="12" size-md="6">                                                         <!-- dateOfEntry -->
            <bk-date-input name="dateOfEntry" [storeDate]="vm.dateOfEntry!" (changed)="updateField('dateOfEntry', $event)" [showError]=true [showHelper]=true [readOnly]="readOnly()" />
          </ion-col>
    
          @if(vm.dateOfExit && vm.dateOfExit.length > 0) {
            <ion-col size="12" size-md="6">                                                         <!-- dateOfExit -->
              <bk-date-input name="dateOfExit" [storeDate]="vm.dateOfExit!" (changed)="updateField('dateOfExit', $event)" [showError]=true [showHelper]=true [readOnly]="readOnly()" />
            </ion-col>
          }

          <ion-col size="12" size-md="6">                                                         <!-- memberCategory (subType, number)-->
            <bk-cat-input name="memberCategory" [value]="vm.memberCategory ?? defaultMembershipCategory()" 
              [categories]="memberCategories()" (changed)="updateField('memberCategory', $event)" [readOnly]="true"/>                                                   
          </ion-col>
          <ion-col size="12" size-md="6">                                                         <!-- memberState (state, number)-->
            <bk-cat-input name="memberState" [value]="vm.memberState ?? initialMembershipState()" 
              [categories]="memberStates" (changed)="updateField('memberState', $event)" [readOnly]="true"/>                                                   
          </ion-col>
          
          <ion-col size="12" size-md="6">                                                         <!-- price (member fee), number -->
            <bk-number-input name="price" [value]="vm.price!" (changed)="updateField('price', $event)" [maxLength]=6 [showError]=true [readOnly]="readOnly()" />                                        
          </ion-col>
        </ion-row>

      <!---------------------------------------------------
        PROPERTIES 
        --------------------------------------------------->
        <ion-row>
          <ion-col size="12" size-md="6">                                                         <!-- bexioId -->
            <bk-text-input name="bexioId" [value]="vm.bexioId!" (changed)="updateField('bexioId', $event)" [maxLength]=6 [mask]="bexioMask" [showError]=true [readOnly]="readOnly()" />                                        
          </ion-col>

          <ion-col size="12" size-md="6">                                                         <!-- abbreviation -->
            <bk-text-input name="abbreviation" [value]="vm.abbreviation!" (changed)="updateField('abbreviation', $event)" [maxLength]=20 [showError]=true [readOnly]="readOnly()" />                                        
          </ion-col>

          <ion-col size="12" size-md="6">                                                         <!-- orgFunction -->
            <bk-text-input name="orgFunction" [value]="vm.orgFunction!" (changed)="updateField('orgFunction', $event)" [maxLength]=30 [showError]=true [readOnly]="readOnly()" />                                        
          </ion-col>

          <ion-col size="12" size-md="6">                                                         <!-- nickName -->
            <bk-text-input name="nickName" [value]="vm.nickName!" (changed)="updateField('nickName', $event)" [maxLength]=20 [showError]=true [readOnly]="readOnly()" />                                        
          </ion-col>
        </ion-row>

      <!---------------------------------------------------
        TAG, NOTES 
        --------------------------------------------------->
        @if(authorizationService.isPrivileged()) {
          <ion-row>
            <ion-col>                                                                               <!-- tags -->
              <bk-tags storedTags="{{vm.tags}}" [allTags]="membershipTags" (changedTags)="onTagsChanged($event)" [readOnly]="readOnly()" />
            </ion-col>
          </ion-row>
        }
    
        @if(authorizationService.isAdmin()) {
          <ion-row>                                                                               <!-- notes -->
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
export class MembershipFormComponent extends AbstractFormComponent implements AfterViewInit {
  public vm = model.required<MembershipFormModel>();
  public override readOnly = input(!this.authorizationService.hasRole('memberAdmin'));
  protected initialMembershipState = computed(() => getMembershipState(this.vm().orgId!, this.vm().memberState!));
  protected defaultMembershipCategory = computed(() => getDefaultMembershipCategory(this.vm().orgId!));

  protected readonly suite = membershipFormValidations;
  protected readonly formValue = signal<MembershipFormModel>({});
  protected readonly shape = membershipFormModelShape;
  protected readonly errors = signal<Record<string, string>>({ });

  protected genderTypes = GenderTypes;
  protected membershipTags = MembershipTags;
  protected memberCategories = computed(() => getMembershipCategories(this.vm().orgId));
  protected bexioMask = bexioIdMask;
  protected memberStates = MembershipStates;

  ngAfterViewInit() {
    this.resetForm();
  }
}
