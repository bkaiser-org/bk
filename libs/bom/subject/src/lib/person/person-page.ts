import { Component, computed, effect, inject, input } from '@angular/core';
import { AppNavigationService, CollectionNames, die } from '@bk/util';
import { Observable, asapScheduler, firstValueFrom, map } from 'rxjs';
import { AuthorizationService, BkCommentsAccordionComponent } from '@bk/base';
import { AvatarService, BkAvatarToolbarComponent, BkChangeConfirmationComponent, BkHeaderComponent, BkSpinnerComponent } from '@bk/ui';
import { BkAddressesAccordionComponent } from '@bk/address';
import { BkMembershipsAccordionComponent } from '@bk/membership';
import { TranslatePipe } from '@bk/pipes';
import { PersonFormModel } from '@bk/models';
import { PersonFormComponent } from './person-form';
import { IonAccordionGroup, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { AsyncPipe } from '@angular/common';
import { SubjectService } from '../subject.service';
import { getSubjectTitle } from '../subject.util';
import { convertPersonFormToSubject, convertSubjectToPersonForm } from './person-form.util';
import { BkOwnershipsComponent } from '@bk/ownership';
import { Photo } from '@capacitor/camera';
import { ModelType } from '@bk/categories';
import { BkDocumentsAccordionComponent } from '@bk/document';

@Component({
  selector: 'bk-person-page',
  standalone: true,
  imports: [
    TranslatePipe, AsyncPipe,
    BkSpinnerComponent, BkHeaderComponent,
    BkAvatarToolbarComponent, PersonFormComponent, BkChangeConfirmationComponent, BkDocumentsAccordionComponent,
    BkAddressesAccordionComponent, BkOwnershipsComponent, BkCommentsAccordionComponent, BkMembershipsAccordionComponent, 
    IonHeader, IonToolbar, IonTitle, IonContent, IonAccordionGroup, IonButtons, IonButton, IonIcon
  ],
  template: `
    <bk-header title="{{  (title() | async) | translate | async }}" />
    @if(formCanBeSaved) {
      <bk-change-confirmation (okClicked)="save()" />
    } 
    <ion-content>
      @if(vm$() | async; as vm) {
        <bk-avatar-toolbar [key]="vm.modelType + '.'+vm.bkey" (imageSelected)="onImageSelected($event)" [isEditable]="authorizationService.hasRole('memberAdmin')"
        title="{{ vm.firstName + ' ' + vm.lastName }}" />
        <bk-person-form [vm]="vm" (changedData)="onDataChange($event)" (changedFormState)="onFormStateChange($event)" />

        <ion-accordion-group value="addresses">
          <bk-addresses-accordion [parentKey]="vm.bkey!" [readOnly]="!authorizationService.hasRole('memberAdmin')" [parentType]="MT.Person" />
          <bk-memberships-accordion [subjectKey]="vm.bkey!" />
          <bk-ownerships-accordion [subjectKey]="vm.bkey!" />
          @if(authorizationService.isPrivilegedOr('memberAdmin')) {
            <bk-comments-accordion [collectionName]="CNS.Subject" [parentKey]="vm.bkey!" />
            <bk-documents-accordion [modelType]="MT.Person" [parentKey]="vm.bkey!" />
          }
        </ion-accordion-group>
      } @else {
          <bk-spinner />
      }
    </ion-content>
  `
})
export class PersonPageComponent {
  public authorizationService = inject(AuthorizationService);
  public subjectService = inject(SubjectService);
  private appNavigationService = inject(AppNavigationService);
  private avatarService = inject(AvatarService);

  public id = input.required<string>();
  protected currentPerson$ = computed(() => this.subjectService.readSubject(this.id()));
  protected vm$ = computed(() => this.currentPerson$().pipe(map(_person => convertSubjectToPersonForm(_person))));
  protected title = computed(async () => await this.getTitle(this.vm$()));

  protected formCanBeSaved = false;
  public currentForm: PersonFormModel | undefined;

  public CNS = CollectionNames;
  public MT = ModelType;

  constructor() {
    effect(() => {
      asapScheduler.schedule(() => this.subjectService.currentKey$.next(this.id()));
    });
  }

  private async getTitle(vm$: Observable<PersonFormModel>): Promise<string> {
    const vm = await firstValueFrom(vm$);
    const _operation = this.authorizationService.hasRole('memberAdmin') ? 'update' : 'view';
    return getSubjectTitle(vm, _operation);
  }

  /**
   * Update the form data.
   * @param form 
   */
  public onDataChange(form: PersonFormModel): void {
    this.currentForm = form;
  }

  /**
   * Update the form state.
   * @param formCanBeSaved 
   */
  public onFormStateChange(formCanBeSaved: boolean): void {
    this.formCanBeSaved = formCanBeSaved;
  }

  /**
   * Upload the photo that the user selected to the server.
   * @param photo 
   */
  public async onImageSelected(photo: Photo): Promise<void> {
    if (!this.currentForm?.bkey) die('PersonPage.onImageSelected: currentForm with a key is mandatory.');
    await this.avatarService.uploadPhoto(photo, ModelType.Person, this.currentForm.bkey);
  }

  /**
   * Save the changes to the person into the database.
   */
  public async save(): Promise<void> {
    const _currentPerson = await firstValueFrom(this.currentPerson$());
    if (this.currentForm && _currentPerson) {
      await this.subjectService.updateSubject(convertPersonFormToSubject(_currentPerson, this.currentForm));
      this.formCanBeSaved = false;
    }
    this.appNavigationService.back();
  }
}
