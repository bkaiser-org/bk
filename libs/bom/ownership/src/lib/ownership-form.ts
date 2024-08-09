import { AfterViewInit, Component, input, model, signal } from '@angular/core';
import { BkDateInputComponent, BkNotesComponent, BkNumberInputComponent, BkTagsComponent, BkTextInputComponent } from '@bk/ui';
import { AbstractFormComponent } from '@bk/base';
import { IonCol, IonGrid, IonRow } from '@ionic/angular/standalone';
import { OwnershipFormModel, ownershipFormModelShape, ownershipFormValidations } from '@bk/models';
import { ModelType } from '@bk/categories';
import { OwnershipTags } from '@bk/util';
import { vestForms } from 'ngx-vest-forms';

@Component({
  selector: 'bk-ownership-form',
  standalone: true,
  imports: [
    vestForms,
    BkTagsComponent, BkNotesComponent, BkDateInputComponent, BkTextInputComponent, BkNumberInputComponent,
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
          @if(vm.subjectType === MT.Person) {
            <ion-col size="12" size-md="6">                                                         <!-- firstName -->
              <bk-text-input name="firstName" [value]="vm.firstName!" [readOnly]="true" />                                        
            </ion-col>
      
            <ion-col size="12" size-md="6">                                                         <!-- name (lastName)-->
              <bk-text-input name="lastName" [value]="vm.lastName!" [readOnly]="true" />                                        
            </ion-col>
          } @else {
            <ion-col size="12" size-md="6">                                                         <!-- name (org, group)-->
              <bk-text-input name="name" [value]="vm.name!" [readOnly]="true" />                                        
            </ion-col>
          }
        </ion-row>

        <!---------------------------------------------------
        OWNERSHIP
        --------------------------------------------------->
        <ion-row>
          <ion-col size="12" size-md="6">                                                         <!-- validFrom -->
            <bk-date-input name="validFrom" [storeDate]="vm.validFrom!" (changed)="updateField('validFrom', $event)" [showError]=true [showHelper]=true [readOnly]="readOnly()" />
          </ion-col>
    
          <ion-col size="12" size-md="6">                                                         <!-- validTo -->
            <bk-date-input name="validTo" [storeDate]="vm.validTo!" (changed)="updateField('validTo', $event)" [showError]=true [showHelper]=true [readOnly]="readOnly()" />
          </ion-col>

          <ion-col size="12" size-md="6">                                                         <!-- price (member fee), number -->
            <bk-number-input name="price" [value]="vm.price!" (changed)="updateField('price', $event)" [maxLength]=10 [showError]=true [readOnly]="readOnly()" />                                        
          </ion-col>
        </ion-row>

      <!---------------------------------------------------
        TAG, NOTES 
        --------------------------------------------------->
        @if(authorizationService.isPrivileged()) {
          <ion-row>
            <ion-col>                                                                               <!-- tags -->
              <bk-tags storedTags="{{vm.tags}}" [allTags]="ownershipTags" (changedTags)="onTagsChanged($event)" [readOnly]="readOnly()" />
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
export class OwnershipFormComponent extends AbstractFormComponent implements AfterViewInit {
  public vm = model.required<OwnershipFormModel>();
  public override readOnly = input(!this.authorizationService.hasRole('resourceAdmin'));

  protected readonly suite = ownershipFormValidations;
  protected readonly formValue = signal<OwnershipFormModel>({});
  protected readonly shape = ownershipFormModelShape;
  protected readonly errors = signal<Record<string, string>>({ });

  protected MT = ModelType;
  protected ownershipTags = OwnershipTags;

  ngAfterViewInit() {
    this.resetForm();
  }
}
