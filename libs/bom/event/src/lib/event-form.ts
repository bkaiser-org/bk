import { AfterViewInit, Component, inject, model, signal } from '@angular/core';
import { EventTypes, Periodicity, PeriodicityTypes } from '@bk/categories';
import { BkNotesComponent, BkTagsComponent, BkSpinnerComponent, BkTimeInputComponent, BkDateInputComponent, BkTextInputComponent, BkCatInputComponent, chFutureDate } from '@bk/ui';
import { EventFormModel, eventFormValidations, eventFormModelShape } from '@bk/models';
import { IonCol, IonGrid, IonRow, ModalController } from '@ionic/angular/standalone';
import { AbstractFormComponent } from '@bk/base';
import { EventType } from '@angular/router';
import { EventTags } from '@bk/util';
import { vestForms } from 'ngx-vest-forms';

@Component({
  selector: 'bk-event-form',
  standalone: true,
  imports: [
    vestForms,
    BkCatInputComponent, BkTagsComponent, BkNotesComponent, BkSpinnerComponent,
    BkTimeInputComponent, BkDateInputComponent, BkTextInputComponent,
    IonGrid, IonRow, IonCol, 
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
        <ion-col size="12">                                               <!-- eventType -->
          <bk-cat-input name="eventType" [value]="vm.type!" [categories]="eventTypes" (changed)="updateField('type', $event)" [readOnly]="readOnly()" />
        </ion-col>
        </ion-row>
        <ion-row>
          <ion-col size="12">                                             <!-- event name -->
            <bk-text-input name="name" [value]="vm.name!" (changed)="updateField('name', $event)" [maxLength]=20 [showError]=true [readOnly]="readOnly()" />                                        
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col size="12" size-md="6">                                 <!-- startDate -->
            <bk-date-input name="startDate" [storeDate]="vm.startDate!" (changed)="updateField('startDate', $event)" [showError]=true [showHelper]=true [readOnly]="readOnly()" />
          </ion-col>
          <ion-col size="12" size-md="6">                                 <!-- startTime -->
            <bk-time-input name="startTime" [value]="vm.startTime!" (changed)="updateField('startTime', $event)" [readOnly]="readOnly()" />
          </ion-col>
          <ion-col size="12" size-md="6">                                 <!-- endDate -->
            <bk-date-input name="endDate" [storeDate]="vm.endDate!" (changed)="updateField('endDate', $event)" [showError]=true [showHelper]=true [readOnly]="readOnly()" />
          </ion-col>
          <ion-col size="12" size-md="6">                                 <!-- endTime -->
            <bk-time-input name="endTime" [value]="vm.endTime!" (changed)="updateField('endTime', $event)" [readOnly]="readOnly()" />
          </ion-col>
          <ion-col size="12" size-md="6">                                               <!-- eventType -->
            <bk-cat-input name="periodicity" [value]="vm.periodicity!" [categories]="periodicities" (changed)="updateField('periodicity', $event)" [readOnly]="readOnly()" />
          </ion-col>
          @if(vm.periodicity !== periodicity.Once) {
            <ion-col size="12" size-md="6">                                 <!-- repeatUntilDate -->
              <bk-date-input name="repeatUntilDate" [storeDate]="vm.repeatUntilDate!" (changed)="updateField('repeatUntilDate', $event)" [mask]="chFutureDate" [showError]=true [showHelper]=true [readOnly]="readOnly()" />
            </ion-col>
          }
        </ion-row>
      
      <ion-row>
        <ion-col size="12">                                               <!-- location -->
          <!-- tbd: locationKey is currently only a text field -->
          <bk-text-input name="locationKey" [value]="vm.locationKey!" (changed)="updateField('locationKey', $event)" [maxLength]=30 [showError]=true [readOnly]="readOnly()" />                                        
        </ion-col>
      </ion-row>

      <ion-row>
        <ion-col size="12">                                              <!-- calendarName -->            
        <bk-text-input name="calendarName" [value]="vm.calendarName!" (changed)="updateField('calendarName', $event)" [maxLength]=20 [showError]=true [readOnly]="readOnly()" />                                        
        </ion-col>
      </ion-row>

      <!---------------------------------------------------
        TAG, NOTES 
        --------------------------------------------------->
      @if(authorizationService.isPrivileged()) {
        <ion-row>                                                                        <!-- tags -->
          <ion-col>
            <bk-tags storedTags="{{vm.tags}}" [allTags]="eventTags" (changedTags)="onTagsChanged($event)" [readOnly]="readOnly()" />
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
export class EventFormComponent extends AbstractFormComponent implements AfterViewInit {
  protected modalController = inject(ModalController);
  public vm = model.required<EventFormModel>();

  protected readonly suite = eventFormValidations;
  protected readonly formValue = signal<EventFormModel>({});
  protected readonly shape = eventFormModelShape;
  protected readonly errors = signal<Record<string, string>>({ });

  protected isChannelReadOnly = false;
  public ET = EventType;
  public eventTypes = EventTypes;
  protected eventTags = EventTags;
  protected periodicity = Periodicity;
  protected periodicities = PeriodicityTypes;
  protected chFutureDate = chFutureDate;
  
  ngAfterViewInit() {
    this.resetForm();
  }
}