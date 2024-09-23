import { AfterViewInit, Component, input, model, signal } from '@angular/core';
import { GenderTypes } from '@bk/categories';
import { bexioIdMask, BkCatInputComponent, BkDateInputComponent, BkNotesComponent, BkTagsComponent, BkTextInputComponent, chSsnMask} from '@bk/ui';
import { FormsModule } from '@angular/forms';
import { PersonFormModel, personFormModelShape, personFormValidations } from '@bk/models';
import { AbstractFormComponent } from '@bk/base';
import { IonCol, IonGrid, IonRow } from '@ionic/angular/standalone';
import { PersonTags } from '@bk/util';
import { vestForms } from 'ngx-vest-forms';

@Component({
  selector: 'bk-person-form',
  standalone: true,
  imports: [
    vestForms,
    FormsModule,
    BkTextInputComponent, BkDateInputComponent, BkCatInputComponent, BkTagsComponent, BkNotesComponent,
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
        <!---------------------------------------------------
          PERSON 
          --------------------------------------------------->
          <ion-row>                                                         <!-- firstName -->
            <ion-col size="12" size-md="6">
              <bk-text-input name="firstName" [value]="vm.firstName!" (changed)="updateField('firstName', $event)" autocomplete="given-name" [autofocus]="true" [maxLength]=30 [showError]=true [readOnly]="readOnly()" />                                        
            </ion-col>

            <ion-col size="12" size-md="6">                                 <!-- lastName -->
              <bk-text-input name="lastName" [value]="vm.lastName!" (changed)="updateField('lastName', $event)" autocomplete="family-name" [maxLength]=30 [showError]=true [readOnly]="readOnly()" />                                        
            </ion-col>

            @if(authorizationService.hasRole(env.app.showDateOfBirth)) {
              <ion-col size="12" size-md="6">                                 <!-- dateOfBirth -->
                <bk-date-input name="dateOfBirth" [storeDate]="vm.dateOfBirth!" (changed)="updateField('dateOfBirth', $event)" autocomplete="bday" [showError]=true [showHelper]=true [readOnly]="readOnly()" />
              </ion-col>
            }

            @if(authorizationService.hasRole(env.app.showDateOfDeath)) {
              <ion-col size="12" size-md="6">                                 <!-- dateOfDeath -->
                <bk-date-input name="dateOfDeath" [storeDate]="vm.dateOfDeath!" (changed)="updateField('dateOfDeath', $event)" [showError]=true [readOnly]="readOnly()" />
              </ion-col>
            }

            @if(authorizationService.hasRole(env.app.showGender)) {
              <ion-col size="12" size-md="6">                                   <!-- gender -->
                <bk-cat-input name="gender" [value]="vm.gender!" [categories]="genderTypes" (changed)="updateField('gender', $event)" [readOnly]="readOnly()" />
              </ion-col>
            }
    
          <!---------------------------------------------------
            OTHER  
            --------------------------------------------------->
            @if(authorizationService.hasRole(env.app.showTaxId)) {
              <ion-col size="12" size-md="6">                                 <!-- SSN -->
                <bk-text-input name="ssn" [value]="vm.ssn!" (changed)="updateField('ssn', $event)" [maxLength]=16 [mask]="ssnMask" [showError]=true [showHelper]=true [copyable]=true [readOnly]="readOnly()" />                                        
              </ion-col>
            }
            @if(authorizationService.hasRole(env.app.showBexioId)) {
              <ion-col size="12" size-md="6">                                 <!-- bexioId -->
                <bk-text-input name="bexioId" [value]="vm.bexioId!" (changed)="updateField('bexioId', $event)" [maxLength]=6 [mask]="bexioMask" [showError]=true [readOnly]="readOnly()" />                                        
              </ion-col>
            }
          </ion-row>
    
          <!---------------------------------------------------
            TAG, NOTES 
          --------------------------------------------------->
          @if(authorizationService.hasRole(env.app.showTags)) {
            <ion-row>                                                       <!-- tags -->
              <ion-col>
                <bk-tags storedTags="{{vm.tags}}" [allTags]="personTags" (changedTags)="onTagsChanged($event)" [readOnly]="readOnly()" />
              </ion-col>
            </ion-row>
          }
    
          @if(authorizationService.hasRole(env.app.showNotes)) {
            <ion-row>                                                       <!-- notes -->
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
export class PersonFormComponent extends AbstractFormComponent implements AfterViewInit {  
  public vm = model.required<PersonFormModel>();
  public override readOnly = input(!this.authorizationService.hasRole('memberAdmin'));

  protected readonly suite = personFormValidations;
  protected readonly formValue = signal<PersonFormModel>({});
  protected readonly shape = personFormModelShape;
  protected readonly errors = signal<Record<string, string>>({ });

  protected genderTypes = GenderTypes;
  protected personTags = PersonTags;
  protected bexioMask = bexioIdMask;
  protected ssnMask = chSsnMask;

  ngAfterViewInit() {
    this.resetForm();
  }
}
