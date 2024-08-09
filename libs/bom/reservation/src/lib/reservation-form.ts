import { AfterViewInit, Component, input, model, signal } from '@angular/core';
import { BkCatInputComponent, BkDateInputComponent, BkNotesComponent, BkNumberInputComponent, BkTagsComponent, BkTextInputComponent, BkTimeInputComponent } from '@bk/ui';
import { AbstractFormComponent } from '@bk/base';
import { IonCol, IonGrid, IonRow } from '@ionic/angular/standalone';
import { ModelType, ReservationState, ReservationStates, ReservationType, ReservationTypes } from '@bk/categories';
import { ReservationFormModel, reservationFormModelShape, reservationFormValidations } from '@bk/models';
import { ResourceTags } from '@bk/util';
import { FormDirective, vestForms } from 'ngx-vest-forms';

@Component({
  selector: 'bk-reservation-form',
  standalone: true,
  imports: [
    vestForms, FormDirective,
    BkTagsComponent, BkNotesComponent, BkTimeInputComponent,
    BkDateInputComponent, BkNumberInputComponent, BkTextInputComponent, BkCatInputComponent,
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
          CONTACT, TITLE, STATE and TYPE
        --------------------------------------------------->
          @if(vm.subjectType === MT.Person) {
            <ion-col size="12" size-md="6">                                                         <!-- firstName -->
              <bk-text-input name="firstName" [value]="vm.firstName!" (changed)="updateField('firstName', $event)" [readOnly]="true" />                                        
            </ion-col>
      
            <ion-col size="12" size-md="6">                                                         <!-- lastName -->
              <bk-text-input name="lastName" [value]="vm.lastName!" (changed)="updateField('lastName', $event)" [readOnly]="true" />                                        
            </ion-col>
          } @else {
            <ion-col size="12">                                                                     <!-- organisation name -->
              <bk-text-input name="orgName" [value]="vm.lastName!" (changed)="updateField('lastName', $event)" [readOnly]="true" />                                        
            </ion-col>
          }
          <ion-col size="12">                                                                       <!-- title -->
            <bk-text-input name="title" [value]="vm.name!" (changed)="updateField('name', $event)" [readOnly]="false" />                                        
          </ion-col>

          <ion-col size="12" size-md="6">                                                         <!-- state -->
            <bk-cat-input name="reservationState" [value]="vm.state ?? reservationState.Initial" [categories]="reservationStates" (changed)="updateField('state', $event)" [readOnly]="readOnly()" />
          </ion-col>

          <ion-col size="12" size-md="6">                                                         <!-- type -->
            <bk-cat-input name="reservationType" [value]="vm.type ?? reservationType.SocialEvent" [categories]="reservationTypes" (changed)="updateField('type', $event)" [readOnly]="readOnly()" />
          </ion-col>
        </ion-row>

        <!---------------------------------------------------
        RESERVATION
        --------------------------------------------------->
        <ion-row>
          <ion-col size="12" size-md="6">                                                         <!-- validFrom -->
            <bk-date-input name="validFrom" [storeDate]="vm.validFrom!" (changed)="updateField('validFrom', $event)" [showError]=true [showHelper]=true [readOnly]="readOnly()" />                                        
          </ion-col>

          <ion-col size="12" size-md="6">                                                         <!-- startTime -->
            <bk-time-input name="startTime" [value]="vm.startTime!" (changed)="updateField('startTime', $event)" [readOnly]="readOnly()" />
          </ion-col>

    
          <ion-col size="12" size-md="6">                                                         <!-- validTo -->
            <bk-date-input name="validTo" [storeDate]="vm.validTo!" (changed)="updateField('validTo', $event)" [showError]=true [showHelper]=true [readOnly]="readOnly()" />                                        
          </ion-col>

          <ion-col size="12" size-md="6">                                                         <!-- endTime -->
            <bk-time-input name="endTime" [value]="vm.endTime!" (changed)="updateField('endTime', $event)" [readOnly]="readOnly()" />
          </ion-col>
        </ion-row>
        <ion-row>


          <ion-col size="12" size-md="6">                                                         <!-- price (member fee), number -->
            <bk-number-input name="price" [value]="vm.price!" (changed)="updateField('price', $event)" [maxLength]=4 [showError]=true [readOnly]="readOnly()" />                                        
          </ion-col>

          <ion-col size="12" size-md="6">                                                         <!-- participants -->
           <bk-text-input name="participants" [value]="vm.participants!" (changed)="updateField('participants', $event)" [maxLength]=50 [showError]=true [showHelper]=true [readOnly]="false" />                                        
          </ion-col>

          <ion-col size="12" size-md="6">                                                         <!-- area -->
            <bk-text-input name="area" [value]="vm.area!" (changed)="updateField('area', $event)" [maxLength]=30 [showError]=true [showHelper]=true [readOnly]="false" />                                        
          </ion-col>

          <ion-col size="12" size-md="6">                                                         <!-- reservationRef -->
            <bk-text-input name="reservationRef" [value]="vm.reference!" (changed)="updateField('reference', $event)" [maxLength]=50 [showError]=true [showHelper]=true [readOnly]="false" />                                        
          </ion-col>           
        </ion-row>

      <!---------------------------------------------------
        TAG, NOTES 
        --------------------------------------------------->
        @if(authorizationService.isPrivileged()) {
          <ion-row>
            <ion-col>                                                                               <!-- tags -->
              <bk-tags storedTags="{{vm.tags}}" [allTags]="resourceTags" (changedTags)="onTagsChanged($event)" [readOnly]="readOnly()" />
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
export class ReservationFormComponent extends AbstractFormComponent implements AfterViewInit {
  public vm = model.required<ReservationFormModel>();
  public override readOnly = input(!this.authorizationService.hasRole('resourceAdmin'));

  protected readonly suite = reservationFormValidations;
  protected readonly formValue = signal<ReservationFormModel>({});
  protected readonly shape = reservationFormModelShape;
  protected readonly errors = signal<Record<string, string>>({ });

  protected MT = ModelType;
  protected resourceTags = ResourceTags;
  protected reservationType = ReservationType;
  protected reservationTypes = ReservationTypes;
  protected reservationState = ReservationState;
  protected reservationStates = ReservationStates;

  ngAfterViewInit() {
    this.resetForm();
  }
}
