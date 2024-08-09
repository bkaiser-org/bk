import { AfterViewInit, Component, input, model, signal } from '@angular/core';
import { BoatTypes, BoatUsages, ResourceType, ResourceTypes } from '@bk/categories';
import { BkCatInputComponent, BkColorComponent, BkNotesComponent, BkNumberInputComponent, BkTagsComponent, BkTextInputComponent } from '@bk/ui';
import { ResourceFormModel, resourceFormShape, resourceFormValidations } from '@bk/models';
import { AbstractFormComponent } from '@bk/base';
import { IonCol, IonGrid, IonRow, IonToolbar } from '@ionic/angular/standalone';
import { PrettyjsonPipe, TranslatePipe } from '@bk/pipes';
import { ResourceTags } from '@bk/util';
import { vestForms } from 'ngx-vest-forms';

@Component({
  selector: 'bk-resource-form',
  standalone: true,
  imports: [
    TranslatePipe, PrettyjsonPipe, vestForms,
    BkTextInputComponent, BkNumberInputComponent, BkCatInputComponent, BkColorComponent, BkTagsComponent, BkNotesComponent,
    IonToolbar, IonGrid, IonRow, IonCol, 
  ],
  template: `
  @if(vm(); as vm) {
  <form scVestForm
    [formShape]="shape"
    [formValue]="formValue()"
    [suite]="suite" 
    (formValueChange)="formValue.set($event)">
 
  <ion-grid>
      @switch(vm.resourceType) {
        <!---------------------------------------------------
        ROWING BOAT 
        --------------------------------------------------->
        @case(RT.RowingBoat) {
          <ion-row>
            <ion-col size="12">                                                                     <!-- boatName -->
              <bk-text-input name="boatName" [value]="vm.name!" (changed)="updateField('name', $event)" [maxLength]=20 [showError]=true [readOnly]="readOnly()" />                                        
            </ion-col>
            <ion-col size="12" size-md="6">                                                         <!-- boatType / subType -->
              <bk-cat-input name="boatType" [value]="vm.boatType!" [categories]="boatTypes" (changed)="updateField('boatType', $event)" [readOnly]="readOnly()" />
            </ion-col>
            <ion-col size="12" size-md="6">                                                         <!-- boatUsage -->
              <bk-cat-input name="boatUsage" [value]="vm.boatUsage!" [categories]="boatUsages" (changed)="updateField('boatUsage', $event)" [readOnly]="readOnly()" />
            </ion-col>
            <ion-col size="12" size-md="6">                                                         <!-- load -->
              <bk-text-input name="load" [value]="vm.load!" (changed)="updateField('load', $event)" [maxLength]=20 [showError]=true [readOnly]="readOnly()" />                                        
            </ion-col>
            <ion-col size="12" size-md="6">                                                         <!-- currentValue -->
              <bk-number-input name="currentValue" [value]="vm.currentValue!" (changed)="updateField('currentValue', $event)" [maxLength]=10 [showError]=true [showHelper]=true [readOnly]="false" />                                        
            </ion-col>
            <ion-col size="12" size-md="6">                                                         <!-- color -->  
              <bk-color [hexColor]="vm.hexColor" (colorChanged)="setColor($event)"/>
            </ion-col>
          </ion-row>
        }
      
        <!---------------------------------------------------
        MOTOR BOAT 
        --------------------------------------------------->
        @case(RT.MotorBoat) {
          <ion-row>
            <ion-col size="12">                                                                     <!-- boatName -->
              <bk-text-input name="boatName" [value]="vm.name!" (changed)="updateField('name', $event)" [maxLength]=20 [showError]=true [readOnly]="readOnly()" />                                        
            </ion-col>
            <ion-col size="12" size-md="6">                                                         <!-- load -->
              <bk-text-input name="load" [value]="vm.load!" (changed)="updateField('load', $event)" [maxLength]=20 [showError]=true [readOnly]="readOnly()" />                                        
            </ion-col>
            <ion-col size="12" size-md="6">                                                         <!-- currentValue -->
              <bk-number-input name="currentValue" [value]="vm.currentValue!" (changed)="updateField('currentValue', $event)" [maxLength]=10 [showError]=true [showHelper]=true [readOnly]="false" />                                        
            </ion-col>
          </ion-row>
        }

        <!---------------------------------------------------
        HOUSEKEY 
        --------------------------------------------------->
        @case(RT.HouseKey) {
          <ion-row>
            <ion-col size="12">                                                                       <!-- keyNr -->
              <bk-number-input name="keyNr" [value]="vm.keyNr!" (changed)="updateField('keyNr', $event)" [maxLength]=5 [showError]=true [readOnly]="true" />                                        
            </ion-col>        
          </ion-row>
        }

        <!---------------------------------------------------
        LOCKER 
        --------------------------------------------------->
        @case(RT.MaleLocker) {
          <ion-row>
            <ion-col size="12" size-md="6">                                                         <!-- lockerNr -->
              <bk-number-input name="lockerNr" [value]="vm.lockerNr!" (changed)="updateField('lockerNr', $event)" [maxLength]=3 [showError]=true [showHelper]=true [readOnly]="false" />                                        
            </ion-col>
    
            <ion-col size="12" size-md="6">                                                         <!-- keyNr -->
              <bk-number-input name="keyNr" [value]="vm.keyNr!" (changed)="updateField('keyNr', $event)" [maxLength]=5 [showError]=true [readOnly]="true" />                                        
            </ion-col> 
          </ion-row>    
        }
        @case(RT.FemaleLocker) {
          <ion-row>
            <ion-col size="12" size-md="6">                                                         <!-- lockerNr -->
              <bk-number-input name="lockerNr" [value]="vm.lockerNr!" (changed)="updateField('lockerNr', $event)" [maxLength]=3 [showError]=true [showHelper]=true [readOnly]="readOnly()" />                                        
            </ion-col>
    
            <ion-col size="12" size-md="6">                                                         <!-- keyNr -->
              <bk-number-input name="keyNr" [value]="vm.keyNr!" (changed)="updateField('keyNr', $event)" [maxLength]=5 [showError]=true [readOnly]="readOnly()" />                                        
            </ion-col> 
          </ion-row>    
        }

        <!---------------------------------------------------
        VEHICLE
        --------------------------------------------------->
        @case(RT.Vehicle) {
          <ion-row>
            <ion-col size="12">                                                                     <!-- name -->
              <bk-text-input name="name" [value]="vm.name!" (changed)="updateField('name', $event)" [maxLength]=30 [showError]=true [readOnly]="readOnly()" />                                        
            </ion-col>
            <ion-col size="12" size-md="6">                                                         <!-- load -->
              <bk-text-input name="load" [value]="vm.load!" (changed)="updateField('load', $event)" [maxLength]=20 [showError]=true [readOnly]="readOnly()" />                                        
            </ion-col>
            <ion-col size="12" size-md="6">                                                         <!-- currentValue -->
              <bk-number-input name="currentValue" [value]="vm.currentValue!" (changed)="updateField('currentValue', $event)" [maxLength]=10 [showError]=true [showHelper]=true [readOnly]="readOnly()" />                                        
            </ion-col>
            <ion-col size="12" size-md="6">                                                         <!-- color -->  
              <bk-color [hexColor]="vm.hexColor" (colorChanged)="setColor($event)"/>
            </ion-col>
          </ion-row>
        }

        <!---------------------------------------------------
        Real Estate
        --------------------------------------------------->
        @case(RT.RealEstate) {
          <ion-row>
            <ion-col size="12">                                                                     <!-- name -->
              <bk-text-input name="name" [value]="vm.name!" (changed)="updateField('name', $event)" [maxLength]=30 [showError]=true [readOnly]="readOnly()" />                                        
            </ion-col>
            <ion-col size="12" size-md="6">                                                         <!-- currentValue -->
              <bk-number-input name="currentValue" [value]="vm.currentValue!" (changed)="updateField('currentValue', $event)" [maxLength]=10 [showError]=true [showHelper]=true [readOnly]="readOnly()" />                                        
            </ion-col>
          </ion-row>
        }

        <!---------------------------------------------------
        OTHERS: MOTORBOAT, ETC.
        --------------------------------------------------->
        @default {
          <ion-row >
            <ion-col size="12">                                                                      <!-- name -->
              <bk-text-input name="name" [value]="vm.name!" (changed)="updateField('name', $event)" [maxLength]=30 [showError]=true [readOnly]="readOnly()" />                                        
            </ion-col>
    
            <ion-col size="12" size-md="6">                                                         <!-- resourceType -->
              <bk-cat-input name="resourceType" [value]="vm.resourceType!" [categories]="resourceTypes" (changed)="updateField('resourceType', $event)" [readOnly]="readOnly()" />
            </ion-col>
    
            <ion-col size="12" size-md="6">                                                         <!-- load -->
              <bk-text-input name="load" [value]="vm.load!" (changed)="updateField('load', $event)" [maxLength]=20 [showError]=true [readOnly]="readOnly()" />                                        
            </ion-col>
    
            <ion-col size="12" size-md="6">                                                         <!-- currentValue -->
              <bk-number-input name="currentValue" [value]="vm.currentValue!" (changed)="updateField('currentValue', $event)" [maxLength]=10 [showError]=true [showHelper]=true [readOnly]="readOnly()" />                                        
            </ion-col>
            <ion-col size="12" size-md="6">                                                         <!-- color -->  
              <bk-color [hexColor]="vm.hexColor" (colorChanged)="setColor($event)"/>
            </ion-col>

          </ion-row>    
        }
      }

    <!---------------------------------------------------
      TAG, NOTES 
      --------------------------------------------------->
    @if(authorizationService.isPrivileged()) {
      <ion-row>                                                                                      <!-- tags -->
        <ion-col>
          <bk-tags storedTags="{{vm.tags}}" [allTags]="resourceTags" (changedTags)="onTagsChanged($event)" [readOnly]="readOnly()" />
        </ion-col>
      </ion-row>
    }
  
    @if(authorizationService.isAdmin()) {
      <ion-row>                                                                                      <!-- notes -->
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
export class ResourceFormComponent extends AbstractFormComponent implements AfterViewInit {
  public vm = model.required<ResourceFormModel>();
  public override readOnly = input(!this.authorizationService.hasRole('resourceAdmin'));

  protected readonly suite = resourceFormValidations;
  protected readonly formValue = signal<ResourceFormModel>({});
  protected readonly shape = resourceFormShape;
  protected readonly errors = signal<Record<string, string>>({ });

  public RT = ResourceType;
  protected resourceTags = ResourceTags;
  protected boatTypes = BoatTypes;
  protected boatUsages = BoatUsages;
  protected resourceTypes = ResourceTypes;

  ngAfterViewInit() {
    this.resetForm();
  }

  protected setColor(hexColor: string): void {
    this.vm().hexColor = hexColor;
    this.updateField('hexColor', hexColor);
  }
}
