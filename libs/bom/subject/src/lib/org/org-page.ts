import { Component, computed, effect, inject, input } from '@angular/core';
import { AppNavigationService, CollectionNames, die, error } from '@bk/util';
import { asapScheduler, firstValueFrom, map } from 'rxjs';
import { ModelType, OrgType } from '@bk/categories';
import { AuthorizationService, BkCommentsAccordionComponent } from '@bk/base';
import { AvatarService, BkAvatarToolbarComponent, BkChangeConfirmationComponent, BkHeaderComponent, BkSpinnerComponent } from '@bk/ui';
import { BkAddressesAccordionComponent } from '@bk/address';
import { BkMembershipsAccordionComponent } from '@bk/membership';
import { TranslatePipe } from '@bk/pipes';
import { OrgFormModel } from '@bk/models';
import { OrgFormComponent } from './org-form';
import { IonAccordionGroup, IonContent } from '@ionic/angular/standalone';
import { SubjectService } from '../subject.service';
import { getSubjectTitle } from '../subject.util';
import { convertOrgFormToSubject, convertSubjectToOrgForm } from './org-form.util';
import { AsyncPipe } from '@angular/common';
import { BkOwnershipsComponent } from '@bk/ownership';
import { Photo } from '@capacitor/camera';
import { BkDocumentsAccordionComponent } from '@bk/document';

@Component({
  selector: 'bk-org-page',
  standalone: true,
  imports: [
    AsyncPipe, TranslatePipe,
    BkSpinnerComponent, BkMembershipsAccordionComponent, BkOwnershipsComponent,
    BkAvatarToolbarComponent, OrgFormComponent, BkAddressesAccordionComponent, BkDocumentsAccordionComponent,
    BkCommentsAccordionComponent, BkHeaderComponent, BkChangeConfirmationComponent,
    IonContent, IonAccordionGroup
  ],
  template: `
    @if(vm$() | async; as vm) {
      <bk-header title="{{ getSubjectTitle(vm) | translate | async }}" />
      @if(formCanBeSaved) {
        <bk-change-confirmation (okClicked)="save()" />
      } 
      <ion-content>
        <bk-avatar-toolbar [key]="vm.modelType + '.' + vm.bkey" (imageSelected)="onImageSelected($event)" [isEditable]="authorizationService.hasRole('memberAdmin')"
            title="{{ vm.orgName }}"/>

        <bk-org-form [vm]="vm" (changedData)="onDataChange($event)" (changedFormState)="onFormStateChange($event)" />

        <ion-accordion-group [multiple]="true" value="{{ vm.orgType === OT.Group ? 'members' : 'addresses' }}">
          @if(vm.orgType !== OT.Group) {
            <bk-addresses-accordion [parentKey]="vm.bkey!" [readOnly]="!authorizationService.hasRole('memberAdmin')" [parentType]="MT.Org" />
          }
          @if(authorizationService.hasRole('memberAdmin')) {
            <bk-memberships-accordion [subjectKey]="vm.bkey!" />
          }
          @if(authorizationService.isPrivilegedOr('resourceAdmin') && vm.orgType !== OT.Group) {
            <bk-ownerships-accordion [subjectKey]="vm.bkey!" />
          }
          @if(authorizationService.hasRole('memberAdmin')) {
            <bk-comments-accordion [collectionName]="CNS.Subject" [parentKey]="vm.bkey!" />
          }
          @if(authorizationService.isPrivilegedOr('memberAdmin')) {
            <bk-documents-accordion [modelType]="getModelType(vm.orgType!)" [parentKey]="vm.bkey!" />
          }
        </ion-accordion-group>
      </ion-content>
    } @else {
      <bk-header title="" />
      <ion-content>
        <bk-spinner />
      </ion-content>
    }
  `
})
export class OrgPageComponent {
  public authorizationService = inject(AuthorizationService);
  public subjectService = inject(SubjectService);
  private avatarService = inject(AvatarService);
  private appNavigationService = inject(AppNavigationService);

  public id = input.required<string>();
  protected currentOrg$ = computed(() => this.subjectService.readSubject(this.id()));
  protected vm$ = computed(() => this.currentOrg$().pipe(map(_subject => convertSubjectToOrgForm(_subject))));

  protected formCanBeSaved = false;
  public currentForm: OrgFormModel | undefined;
  public modelType: ModelType | undefined;

  public OT = OrgType;
  public CNS = CollectionNames;
  public MT = ModelType;

  constructor() {
    effect(() => {
      asapScheduler.schedule(() => this.subjectService.currentKey$.next(this.id()));
    });
  }

  public getModelType(orgType: OrgType): ModelType {
    return orgType === OrgType.Group ? ModelType.Group : ModelType.Org;
  }

  public onDataChange(form: OrgFormModel): void {
    this.currentForm = form;
  }

  public onFormStateChange(formCanBeSaved: boolean): void {
    this.formCanBeSaved = formCanBeSaved;
  }

  public async onImageSelected(photo: Photo): Promise<void> {
    if (!this.currentForm?.bkey) die('OrgPage.onImageSelected: currentForm with a key is mandatory.');
    if (this.currentForm.modelType === undefined) die('OrgPage.onImageSelected:  modelType is mandatory.');
    await this.avatarService.uploadPhoto(photo, this.currentForm.modelType, this.currentForm.bkey);
  }

  public async save(): Promise<void> {
    if (!this.currentForm) return;
    const _currentOrg = await firstValueFrom(this.currentOrg$());
    if (!_currentOrg) die('OrgPage.save: currentOrg is mandatory.');
    this.formCanBeSaved = false;

    try {
      await this.subjectService.updateSubject(convertOrgFormToSubject(_currentOrg, this.currentForm));
      this.appNavigationService.back();
    }
    catch (_ex) {
      error(undefined, 'OrgPage.save: updating subject -> error = ' + JSON.stringify(_ex));
    }
  }

  public loadSubject(nextKey: string) {
    this.subjectService.currentKey$.next(nextKey);
  }

  public getSubjectTitle(vm: OrgFormModel): string {
    const _operation = this.authorizationService.hasRole('memberAdmin') ? 'update' : 'view';
    return getSubjectTitle(vm, _operation);
  }
}
