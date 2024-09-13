import { AfterViewInit, Component, inject, model, signal } from '@angular/core';
import { BkCatInputComponent, BkCheckComponent, BkDateInputComponent, BkTextInputComponent, chSsnMask } from '@bk/ui';
import { GenderTypes } from '@bk/categories';
import { ProfileFormModel, profileFormModelShape, profileFormValidations } from '@bk/models';
import { AbstractFormComponent } from '@bk/base';
import { TranslatePipe } from '@bk/pipes';
import { IonCol, IonGrid, IonItem, IonLabel, IonRow, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { AsyncPipe } from '@angular/common';
import { I18nService } from '@bk/util';
import { vestForms } from 'ngx-vest-forms';

@Component({
  selector: 'bk-profile-form',
  standalone: true,
  imports: [
    TranslatePipe, AsyncPipe, 
    vestForms,
    BkDateInputComponent, BkTextInputComponent, BkCatInputComponent, BkCheckComponent,
    IonGrid, IonRow, IonCol, IonItem, IonSelect, IonSelectOption, IonLabel
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
        <ion-col>
          <ion-item lines="none">
            {{'@subject.person.profile.intro' | translate | async }} &nbsp;
            <a [href]="adminEmail"> Website Admin</a>.
          </ion-item>
        </ion-col>
      </ion-row>
      <ion-row>                                                         <!-- dateOfBirth -->
        <ion-col size="12" size-md="6">                                                              
          <bk-date-input name="dateOfBirth" [storeDate]="vm.dateOfBirth!" (changed)="updateField('dateOfBirth', $event)" autocomplete="bday" [showError]=true [showHelper]=true [readOnly]="readOnly()" />
        </ion-col>

        <ion-col size="12" size-md="6">                                 <!-- gender -->
          <bk-cat-input name="gender" [value]="vm.gender!" [categories]="genderTypes" (changed)="updateField('gender', $event)" [readOnly]="true" />                                                  
        </ion-col>

        <ion-col size="12" size-md="6">                                <!-- ssn -->
          <bk-text-input name="ssn" [value]="vm.ssn!" (changed)="updateField('ssn', $event)" [maxLength]=16 [mask]="ssnMask" [showError]=true [showHelper]=true [copyable]=true [readOnly]="false" />                                                  
        </ion-col>

        @if(authorizationService.isAdmin()) {
          <ion-col size="12" size-md="6">                                 <!-- language -->                                                              
            <ion-item lines="none">
              <ion-select label="{{'@language.label' | translate | async }}" name="userLanguage" 
                [ngModel]="vm.userLanguage" (ionChange)="changeLanguage($event.detail.value)"
                placeholder="{{'@language.select' | translate | async }}">
                <ion-select-option value="de">{{'@language.de' | translate | async }}</ion-select-option>
                <ion-select-option value="en">{{'@language.en' | translate | async }}</ion-select-option>
                <ion-select-option value="fr">{{'@language.fr' | translate | async }}</ion-select-option>
                <ion-select-option value="es">{{'@language.es' | translate | async }}</ion-select-option>
                <ion-select-option value="it">{{'@language.it' | translate | async }}</ion-select-option>
              </ion-select>
            </ion-item>
          </ion-col>
          <ion-col size="12" size-md="6">
            <bk-check name="showDebugInfo" [isChecked]="vm.showDebugInfo!" (changed)="updateField('showDebugInfo', $event)" [showHelperText]="true" />
          </ion-col>
          <ion-col size="12" size-md="6">
            <bk-check name="showTestData" [isChecked]="vm.showTestData!" (changed)="updateField('showTestData', $event)" [showHelperText]="true" />
          </ion-col>
          <ion-col size="12" size-md="6">
            <bk-check name="showArchivedData" [isChecked]="vm.showArchivedData!" (changed)="updateField('showArchivedData', $event)" [showHelperText]="true" />
          </ion-col>
        }
      </ion-row>
    </ion-grid>
  </form>
}
  `
})
export class ProfileFormComponent extends AbstractFormComponent implements AfterViewInit {
  private i18nService = inject(I18nService);

  public vm = model.required<ProfileFormModel>();

  protected readonly suite = profileFormValidations;
  protected readonly formValue = signal<ProfileFormModel>({});
  protected readonly shape = profileFormModelShape;
  protected readonly errors = signal<Record<string, string>>({ });
  protected readonly adminEmail = `mailto:${this.configService.getConfigString('operator_email')}`;

  protected genderTypes = GenderTypes;
  protected ssnMask = chSsnMask;

  ngAfterViewInit() {
    this.resetForm();
  }

  public changeLanguage(language: string) {
    this.updateField('userLanguage', language);
    this.i18nService.setActiveLang(language);
  }
}
