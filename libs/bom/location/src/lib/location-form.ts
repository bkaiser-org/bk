import { AfterViewInit, Component, inject, model, signal } from '@angular/core';
import { IonCol, IonGrid, IonInput, IonRow, ModalController } from '@ionic/angular/standalone';
import { AbstractFormComponent } from '@bk/base';
import { BkCatInputComponent, BkNotesComponent, BkNumberInputComponent, BkSpinnerComponent, BkTagsComponent, BkTextInputComponent, caseInsensitiveWordMask, coordinateMask, what3WordMask } from '@bk/ui';
import { BkFormModel, LocationFormModel, locationFormModelShape, locationFormValidations } from '@bk/models';
import { LocationTags } from '@bk/util';
import { LocationTypes } from '@bk/categories';
import { vestForms } from 'ngx-vest-forms';

@Component({
  selector: 'bk-location-form',
  standalone: true,
  imports: [
    vestForms,
    BkCatInputComponent, BkTextInputComponent, BkNumberInputComponent, BkTagsComponent, BkNotesComponent, BkSpinnerComponent,
    IonGrid, IonRow, IonCol, IonInput
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
        Latitude, Longitude, PlaceId, What3Words, Height, Speed, Direction 
        --------------------------------------------------->
      <ion-row>
        <ion-col size="12" size-md="6">                                               <!-- name -->
          <bk-text-input name="name" [value]="vm.name!" (changed)="updateField('name', $event)" [maxLength]=30 [showError]=true [readOnly]="readOnly()" />                                        
        </ion-col>
        <ion-col size="12" size-md="6">                                               <!-- locationType -->
          <bk-cat-input name="locationType" [value]="vm.locationType!" [categories]="locationTypes" (changed)="updateField('locationType', $event)" />                                                   
        </ion-col>
        <ion-col size="12" size-md="6">                                               <!-- coordinates: latitude,longitude,zoom -->
          <bk-text-input name="coordinates" [value]="vm.url!" (changed)="updateField('url', $event)" [maxLength]=30 [mask]="coordMask" [showError]=true [readOnly]="readOnly()" />                                        
        </ion-col>
        <ion-col size="12" size-md="6">                                               <!-- placeId -->
          <bk-text-input name="placeId" [value]="vm.placeId!" (changed)="updateField('placeId', $event)" [maxLength]=30 [mask]="caseInsensitiveWordMask" [showHelper]=true [showError]=true [readOnly]="readOnly()" />                                        
        </ion-col>
        <ion-col size="12" size-md="6">                                               <!-- what3words -->
        <bk-text-input name="what3words" [value]="vm.what3words!" (changed)="updateField('what3words', $event)" [maxLength]=30 [mask]="what3wordMask" [showHelper]=true [showError]=true [readOnly]="readOnly()" />                                        
        </ion-col>
        <ion-col size="12" size-md="6">                                               <!-- height -->
          <bk-number-input name="sealevel" [value]="vm.height!" (changed)="updateField('height', $event)" [maxLength]=10 [showHelper]=true [showError]=true [readOnly]="readOnly()" />                                        
        </ion-col>
        <ion-col size="12" size-md="6">                                               <!-- speed -->
          <bk-number-input name="speed" [value]="vm.speed!" (changed)="updateField('speed', $event)" [maxLength]=5 [showHelper]=true [showError]=true [readOnly]="readOnly()" />                                        
        </ion-col>
        <ion-col size="12" size-md="6">                                               <!-- direction -->
          <bk-number-input name="direction" [value]="vm.direction!" (changed)="updateField('direction', $event)" [maxLength]=4 [showHelper]=true [showError]=true [readOnly]="readOnly()" />                                        
        </ion-col>
      </ion-row>

      <!---------------------------------------------------
        TAG, NOTES 
        --------------------------------------------------->
      @if(authorizationService.isPrivileged()) {
        <ion-row>                                                                        <!-- tags -->
          <ion-col>
            <bk-tags storedTags="{{vm.tags}}" [allTags]="locationTags" (changedTags)="onTagsChanged($event)" [readOnly]="readOnly()" />
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
export class LocationFormComponent extends AbstractFormComponent implements AfterViewInit {
  protected modalController = inject(ModalController);
  public vm = model.required<LocationFormModel>();

  protected readonly suite = locationFormValidations;
  protected readonly formValue = signal<LocationFormModel>({});
  protected shape = locationFormModelShape;
  protected readonly errors = signal<Record<string, string>>({ });

  protected locationTags = LocationTags;
  protected what3wordMask = what3WordMask;
  protected coordMask = coordinateMask;
  protected caseInsensitiveWordMask = caseInsensitiveWordMask;
  protected locationTypes = LocationTypes;

  ngAfterViewInit() {
    this.resetForm();
  }

  public onWordChanged(fieldName: keyof BkFormModel, newWord: string) {
    this.updateField(fieldName, newWord ?? '');
  }

  protected onChange(): void {
    this.formDirty.set(true);
    this.notifyState();
  }
}