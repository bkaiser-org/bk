import { Component, OnInit, inject } from '@angular/core';
import { CollectionNames, die, error } from '@bk/util';
import { Observable, map } from 'rxjs';
import { BkAddressesAccordionComponent } from '@bk/address';
import { BaseModel, BkFormModel, ProfileFormModel, SubjectModel, isSubject } from '@bk/models';
import { AvatarService, BkAvatarToolbarComponent, BkChangeConfirmationComponent, BkHeaderComponent, BkSpinnerComponent } from '@bk/ui';
import { PrettyjsonPipe, TranslatePipe } from '@bk/pipes';
import { ProfileFormComponent } from './profile-form';
import { AsyncPipe } from '@angular/common';
import { IonAccordionGroup, IonContent, IonItem } from '@ionic/angular/standalone';
import { AuthorizationService, DataService } from '@bk/base';
import { convertProfileFormToSubject, convertProfileFormToUser, convertSubjectAndUserToProfileForm } from './profile-form.util';
import { Photo } from '@capacitor/camera';
import { ModelType } from '@bk/categories';

@Component({
  selector: 'bk-profile-page',
  standalone: true,
  imports: [
    TranslatePipe, AsyncPipe, PrettyjsonPipe,
    BkAvatarToolbarComponent, ProfileFormComponent, BkAddressesAccordionComponent, BkSpinnerComponent, BkHeaderComponent,
    BkChangeConfirmationComponent, 
    IonContent, IonAccordionGroup, IonItem
  ],
  template: `
    <bk-header title="{{ '@subject.person.operation.update.profile' | translate | async }}" />
    @if(formCanBeSaved) {
      <bk-change-confirmation (okClicked)="save()" />
    }
    <ion-content>
      @if((vm$ | async); as vm) {
          <bk-avatar-toolbar [key]="'0.' + vm.bkey" (imageSelected)="onImageSelected($event)" [isEditable]="true"
            title="{{ vm.firstName }} {{vm.lastName}}" subTitle="{{ vm.email }}"/>

          <bk-profile-form [vm]="vm" (changedData)="onDataChange($event)" (changedFormState)="onFormStateChange($event)"/>
          
          <ion-accordion-group value="addresses">
             <bk-addresses-accordion [parentKey]="vm.bkey!" [readOnly]="false" [parentType]="MT.Person"/>
          </ion-accordion-group>

          @if(authorizationService.currentUser()?.showDebugInfo === true) {
            <ion-item lines="none">
              <small>View Model (vm) on page level:</small>
            </ion-item>
            <ion-item lines="none">
              <small><div [innerHTML]="vm | prettyjson"></div></small>
            </ion-item>
          }
      } @else {
        <bk-spinner />
      }
    </ion-content>
  `
})
export class ProfilePageComponent implements OnInit {
  public authorizationService = inject(AuthorizationService);
  private avatarService = inject(AvatarService);
  // we directly use DataService instead of SubjectService in order to not change the state of the list of subjects
  public dataService = inject(DataService);

  private profilePerson: SubjectModel | undefined;
  public vm$!: Observable<ProfileFormModel | undefined>;
  public formCanBeSaved = false;
  public currentForm: ProfileFormModel | undefined;
  public MT = ModelType;

  async ngOnInit(): Promise<void> {
    // read the person data of the currently loggedin user
    const _profilePerson$ = this.dataService.readModel(CollectionNames.Subject, this.authorizationService.currentUser()?.personKey);
    this.vm$ = _profilePerson$.pipe(map(_subject => this.convertToForm(_subject)));
  }

  private convertToForm(subject: BaseModel | undefined): ProfileFormModel {
    if (!subject) die('ProfilePage.convertToForm: subject is mandatory.');
    if (isSubject(subject) && this.authorizationService.currentUser()) {
      this.profilePerson = subject; // save it for later use
      return convertSubjectAndUserToProfileForm(subject, this.authorizationService.currentUser());  
    } else {
      die('ProfilePage.convertToForm: subject must be a SubjectModel and currentUser is mandatory.');
    }
  }

  public onDataChange(form: BkFormModel): void {
    this.currentForm = form as ProfileFormModel;
  }

  public onFormStateChange(formCanBeSaved: boolean): void {
    this.formCanBeSaved = formCanBeSaved;
  }

  public async onImageSelected(photo: Photo): Promise<void> {
    if (!this.profilePerson?.bkey) die('ProfilePage.onImageSelected: profilePerson with a key is mandatory.');
    await this.avatarService.uploadPhoto(photo, ModelType.Person, this.profilePerson?.bkey);
  }

  public async save(): Promise<void> {
    if (!this.profilePerson) die('ProfilePage.save: profilePerson is mandatory.');
    if (!this.currentForm) return;
    this.formCanBeSaved = false;
    try {
      await this.dataService.updateModel(CollectionNames.Subject, convertProfileFormToSubject(this.profilePerson, this.currentForm), `@subject.person.operation.update`);
    }
    catch (_ex) {
      error(undefined, 'ProfilePage.save: updating subject -> error = ' + JSON.stringify(_ex));
    }
    try {
      await this.dataService.updateModel(CollectionNames.User, convertProfileFormToUser(this.authorizationService.currentUser(), this.currentForm));
    }
    catch (_ex) {
      error(undefined, 'ProfilePage.save: updating user -> error = ' + JSON.stringify(_ex));
    }
  }
}
