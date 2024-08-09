import { AfterViewInit, Component, input, model, signal } from '@angular/core';
import { BoatTypes, BoatUsages, ResourceType, ResourceTypes } from '@bk/categories';
import { BkCatInputComponent, BkColorComponent, BkNotesComponent, BkNumberInputComponent, BkTagsComponent, BkTextInputComponent } from '@bk/ui';
import { ResourceNewFormModel, resourceNewFormModelShape, resourceNewValidations } from '@bk/models';
import { AbstractFormComponent } from '@bk/base';
import { PrettyjsonPipe, TranslatePipe } from '@bk/pipes';
import { IonButton, IonCol, IonGrid, IonRow } from '@ionic/angular/standalone';
import { ResourceTags } from '@bk/util';
import { vestForms } from 'ngx-vest-forms';

@Component({
  selector: 'bk-resource-new-form',
  standalone: true,
  imports: [
    TranslatePipe, PrettyjsonPipe, vestForms,
    BkCatInputComponent, BkTextInputComponent, BkNumberInputComponent, BkColorComponent, BkTagsComponent, BkNotesComponent,
    IonGrid, IonRow, IonCol, IonButton
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
      <ion-col size="12" size-md="6">                                               <!-- resourceType -->
        <bk-cat-input name="resourceType" [value]="vm.category!" [categories]="resourceTypes" (changed)="updateField('category', $event)" [readOnly]="!isTypeSelectable()" />
        </ion-col>
      <ion-col size="12" size-md="6">                                                     <!-- name -->
        <bk-text-input name="name" [value]="vm.name!" (changed)="updateField('name', $event)" [maxLength]=20 [showError]=true [readOnly]="readOnly()" />                                        
      </ion-col>
    </ion-row>

      <!--------------------------------------------------
        ROWING BOAT  
        --------------------------------------------------->
    @if(vm.category === RT.RowingBoat) {
      <ion-row>
        <ion-col size="12" size-md="6">                                          <!-- boatType -->
          <bk-cat-input name="boatType" [value]="vm.boatType!" [categories]="boatTypes" (changed)="updateField('boatType', $event)" [readOnly]="readOnly()" />
        </ion-col>
  
        <ion-col size="12" size-md="6">                                          <!-- usage -->
          <bk-cat-input name="boatUsage" [value]="vm.boatUsage!" [categories]="boatUsages" (changed)="updateField('boatUsage', $event)" [readOnly]="readOnly()" />
        </ion-col>
  
        <ion-col size="12" size-md="6">                                         <!-- load -->
          <bk-text-input name="load" [value]="vm.load!" (changed)="updateField('load', $event)" [maxLength]=20 [showError]=true [readOnly]="readOnly()" />                                        
        </ion-col>
  
        <ion-col size="12" size-md="6">                                         <!-- currentValue -->
          <bk-number-input name="currentValue" [value]="vm.currentValue!" (changed)="updateField('currentValue', $event)" [maxLength]=10 [showError]=true [showHelper]=true [readOnly]="readOnly()" />                                        
        </ion-col>

        <ion-col size="12" size-md="6">                                                         <!-- color -->  
          <bk-color [hexColor]="vm.hexColor" (colorChanged)="setColor($event)"/>
        </ion-col>
      </ion-row>  
    }

    <!---------------------------------------------------
       LOCKER 
      --------------------------------------------------->
    @if(vm.category === RT.MaleLocker || vm.category === RT.FemaleLocker) {
      <ion-row>
        <ion-col size="12" size-md="6">                                          <!-- lockerNr -->
          <bk-number-input name="lockerNr" [value]="vm.lockerNr!" (changed)="updateField('lockerNr', $event)" [maxLength]=3 [showError]=true [showHelper]=true [readOnly]="readOnly()" />                                        
        </ion-col>
  
        <ion-col size="12" size-md="6">                                          <!-- keyNr-->
          <bk-number-input name="keyNr" [value]="vm.keyNr!" (changed)="updateField('keyNr', $event)" [maxLength]=5 [showError]=true [readOnly]="readOnly()" />                                        
        </ion-col>
      </ion-row>
    }

    <!---------------------------------------------------
        OTHER RESOURCES 
      --------------------------------------------------->
    @if(vm.category === RT.MotorBoat || vm.category === RT.Other || vm.category === RT.Vehicle) {
      <ion-row>
        <ion-col size="12" size-md="6">                                          <!-- currentValue-->
          <bk-number-input name="currentValue" [value]="vm.currentValue!" (changed)="updateField('currentValue', $event)" [maxLength]=10 [showError]=true [showHelper]=true [readOnly]="readOnly()" />                                        
        </ion-col>
  
        <ion-col size="12" size-md="6">                                         <!-- load-->
          <bk-text-input name="load" [value]="vm.load!" (changed)="updateField('load', $event)" [maxLength]=20 [showError]=true [readOnly]="readOnly()" />                                        
        </ion-col>
        
        <ion-col size="12" size-md="6">                                         <!-- weight-->
        <bk-number-input name="weight" [value]="vm.weight!" (changed)="updateField('weight', $event)" [maxLength]=10 [showError]=true [readOnly]="readOnly()" />                                        
        </ion-col>
  
        <ion-col size="12" size-md="6">                                                         <!-- color -->  
          <bk-color [hexColor]="vm.hexColor" (colorChanged)="setColor($event)"/>
        </ion-col>
      </ion-row>
    }

    <!---------------------------------------------------
      TAG, NOTES 
      --------------------------------------------------->
    @if(authorizationService.isPrivileged()) {
      <ion-row>                                                             <!-- tags -->
        <ion-col>
          <bk-tags storedTags="{{vm.tags}}" [allTags]="resourceTags" (changedTags)="onTagsChanged($event)" [readOnly]="readOnly()" />
        </ion-col>
      </ion-row>
    }
    @if(authorizationService.isAdmin()) {
      <ion-row>                                                             <!-- notes -->
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
export class ResourceNewFormComponent extends AbstractFormComponent implements AfterViewInit {
  public vm = model.required<ResourceNewFormModel>();
  public override readOnly = input(!this.authorizationService.hasRole('resourceAdmin'));
  public isTypeSelectable = input(true);

  protected readonly suite = resourceNewValidations;
  protected readonly formValue = signal<ResourceNewFormModel>({});
  protected readonly shape = resourceNewFormModelShape;
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
