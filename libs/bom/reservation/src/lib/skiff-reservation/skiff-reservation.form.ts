import { AfterViewInit, Component, input, model, output, signal } from '@angular/core';
import { BkCheckComponent, BkColorComponent, BkDateInputComponent, BkNotesComponent, BkNumberInputComponent, BkTextInputComponent } from '@bk/ui';
import { AbstractFormComponent } from '@bk/base';
import { IonCol, IonGrid, IonItem, IonLabel, IonRow } from '@ionic/angular/standalone';
import { ReservationFormModel, reservationFormModelShape, reservationFormValidations } from '@bk/models';
import { TranslatePipe } from '@bk/pipes';
import { AsyncPipe } from '@angular/common';
import { vestForms } from 'ngx-vest-forms';

@Component({
  selector: 'bk-skiff-reservation-form',
  standalone: true,
  imports: [
    TranslatePipe, AsyncPipe, vestForms,
    BkNotesComponent, BkCheckComponent, BkTextInputComponent, BkNumberInputComponent, BkColorComponent, BkDateInputComponent,
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
        <!---------------------------------------------------
        RESERVATION
        --------------------------------------------------->
        <ion-row>
          <ion-col size="12" size-md="6">                                                         <!-- validFrom -->
            <bk-date-input name="validFrom" [storeDate]="vm.validFrom!" (changed)="updateField('validFrom', $event)" [showError]=true [showHelper]=true />
          </ion-col>
        </ion-row>
        
        <!---------------------------------------------------
        BOAT INFORMATION
        --------------------------------------------------->
        <ion-row>
          <ion-col size="12">
            <ion-item lines="none">
              <ion-label><strong>{{ '@event.type.reservation.skiff.boatInfo' | translate | async }}</strong></ion-label>
            </ion-item>
          </ion-col>
          <ion-col size="12" size-md="6">                                                                     <!-- boatName -->
            <bk-text-input name="boatName" [value]="vm.name!" (changed)="updateField('name', $event)" [readOnly]="readOnly()" />
          </ion-col>
          <ion-col size="12" size-md="6">                                                         <!-- load -->
            <bk-text-input name="load" [value]="vm.load!" (changed)="updateField('load', $event)" [readOnly]="readOnly()" />
          </ion-col>
          <ion-col size="12" size-md="6">                                                         <!-- currentValue -->
            <bk-number-input name="currentValue" [value]="vm.currentValue!" (changed)="updateField('currentValue', $event)" [readOnly]="readOnly()" />
          </ion-col>
          <ion-col size="12" size-md="6">                                                         <!-- color -->  
            <bk-color [hexColor]="vm.hexColor" (colorChanged)="setColor($event)"/>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col size="12">
            <ion-item lines="none">
              <ion-label>{{ '@event.type.reservation.skiff.conf1' | translate | async }}</ion-label>
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
export class SkiffReservationFormComponent extends AbstractFormComponent implements AfterViewInit {
  public vm = model.required<ReservationFormModel>();
  public override readOnly = input(!this.authorizationService.hasRole('resourceAdmin'));
  public confirmationChanged = output<boolean>();

  protected readonly suite = reservationFormValidations;
  protected readonly formValue = signal<ReservationFormModel>({});
  protected readonly shape = reservationFormModelShape;
  protected readonly errors = signal<Record<string, string>>({ });


  ngAfterViewInit() {
    this.resetForm();
  }

  protected setColor(hexColor: string): void {
    this.vm().hexColor = hexColor;
    this.updateField('hexColor', hexColor);
  }
}
