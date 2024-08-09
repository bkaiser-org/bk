import { AfterViewInit, Component, input, model, output, signal } from '@angular/core';
import { BkCatInputComponent, BkCheckComponent, BkDateInputComponent, BkNotesComponent, BkTextInputComponent, BkTimeInputComponent } from '@bk/ui';
import { AbstractFormComponent } from '@bk/base';
import { IonCol, IonGrid, IonItem, IonLabel, IonRow } from '@ionic/angular/standalone';
import { ModelType, ReservationType, ReservationTypes } from '@bk/categories';
import { ReservationFormModel, reservationFormModelShape, reservationFormValidations } from '@bk/models';
import { TranslatePipe } from '@bk/pipes';
import { AsyncPipe } from '@angular/common';
import { vestForms } from 'ngx-vest-forms';

@Component({
  selector: 'bk-bh-reservation-form',
  standalone: true,
  imports: [
    TranslatePipe, AsyncPipe, vestForms,
    BkNotesComponent, BkTimeInputComponent, BkCheckComponent, BkDateInputComponent, BkTextInputComponent, BkCatInputComponent,
    IonGrid, IonRow, IonCol, IonLabel, IonItem
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

          <ion-col size="12" size-md="6">                                                         <!-- dateOfExit -->
            <bk-date-input name="validTo" [storeDate]="vm.validTo!" (changed)="updateField('validTo', $event)" [showError]=true [showHelper]=true [readOnly]="readOnly()" />
          </ion-col>

          <ion-col size="12" size-md="6">                                                         <!-- endTime -->
            <bk-time-input name="endTime" [value]="vm.endTime!" (changed)="updateField('endTime', $event)" [readOnly]="readOnly()" />
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col size="12" size-md="6">                                                         <!-- participants -->
            <bk-text-input name="participants" [value]="vm.participants!" (changed)="updateField('participants', $event)" [maxLength]=50 [showError]=true [showHelper]=true [readOnly]="false" />                                        
          </ion-col>

          <ion-col size="12" size-md="6">                                                         <!-- area -->
            <bk-text-input name="area" [value]="vm.area!" (changed)="updateField('area', $event)" [maxLength]=30 [showError]=true [showHelper]=true [readOnly]="readOnly()" />                                        
          </ion-col>

          <ion-col size="12">
            <ion-item lines="none">
              <ion-label>{{ '@event.type.reservation.bh.conf1' | translate | async }}</ion-label>
            </ion-item>
          </ion-col>
          <ion-col size="12">
            <ion-item lines="none">
              <ion-label>{{ '@event.type.reservation.bh.conf2' | translate | async }}</ion-label>
            </ion-item>
          </ion-col>
          <ion-col size="12">   
            <ion-item lines="none">
              <ion-label>{{ '@event.type.reservation.bh.conf3' | translate | async }}</ion-label>
            </ion-item>
          </ion-col>                                             
          <ion-col size="12">                                                         <!-- confirmation -->
            <bk-check name="confirmed" (changed)="confirmationChanged.emit($event)" />
          </ion-col>
        </ion-row>

      <!---------------------------------------------------
        NOTES 
        --------------------------------------------------->    
          <ion-row>                                                                               <!-- notes -->
            <ion-col>                                           
            <bk-notes [value]="vm.notes ?? ''" (changed)="updateField('notes', $event)" />
            </ion-col>
          </ion-row>
      </ion-grid>
    </form>
  }
  `
})
export class BhReservationFormComponent extends AbstractFormComponent implements AfterViewInit {
  public vm = model.required<ReservationFormModel>();
  public override readOnly = input(this.authorizationService.hasRole('resourceAdmin'));
  public confirmationChanged = output<boolean>();

  protected readonly suite = reservationFormValidations;
  protected readonly formValue = signal<ReservationFormModel>({});
  protected readonly shape = reservationFormModelShape;
  protected readonly errors = signal<Record<string, string>>({ });

  protected MT = ModelType;
  protected reservationType = ReservationType;
  protected reservationTypes = ReservationTypes;

  ngAfterViewInit() {
    this.resetForm();
  }

  onChange(confirmed: boolean) {
    this.confirmationChanged.emit(confirmed);
  }
}
