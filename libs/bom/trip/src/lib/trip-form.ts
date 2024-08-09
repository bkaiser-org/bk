import { AfterViewInit, Component, inject, model, signal } from '@angular/core';
import { IonCol, IonGrid, IonInput, IonRow, ModalController } from '@ionic/angular/standalone';
import { AbstractFormComponent } from '@bk/base';
import { BkNotesComponent, BkSpinnerComponent, BkTagsComponent, BkTextInputComponent } from '@bk/ui';
import { TripFormModel, tripFormModelShape, tripFormValidations } from '@bk/models';
import { TripTags } from '@bk/util';
import { vestForms } from 'ngx-vest-forms';

@Component({
  selector: 'bk-trip-form',
  standalone: true,
  imports: [
    vestForms,
    BkTextInputComponent, BkTagsComponent, BkNotesComponent, BkSpinnerComponent,
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
          <bk-text-input name="name" [value]="vm.name!" (changed)="updateField('name', $event)" [autofocus]="true" [maxLength]=30 [showError]=true [readOnly]="readOnly()" />                                        
        </ion-col>
      </ion-row>

      <!---------------------------------------------------
        TAG, NOTES 
        --------------------------------------------------->
      @if(authorizationService.isPrivileged()) {
        <ion-row>                                                                        <!-- tags -->
          <ion-col>
            <bk-tags storedTags="{{vm.tags}}" [allTags]="tripTags" (changedTags)="onTagsChanged($event)" [readOnly]="readOnly()" />
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
export class TripFormComponent extends AbstractFormComponent implements AfterViewInit {
  protected modalController = inject(ModalController);
  public vm = model.required<TripFormModel>();
  protected readonly suite = tripFormValidations;
  protected readonly formValue = signal<TripFormModel>({});
  protected readonly shape = tripFormModelShape;
  protected readonly errors = signal<Record<string, string>>({ });

  protected tripTags = TripTags;
  
  ngAfterViewInit() {
    //this.suite.reset();
    this.resetForm();
  }
}