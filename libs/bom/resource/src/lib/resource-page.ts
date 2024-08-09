import { Component, computed, effect, inject, input } from '@angular/core';
import { AuthorizationService, BkCommentsAccordionComponent } from '@bk/base';
import { AppNavigationService, CollectionNames, die } from '@bk/util';
import { ModelType } from '@bk/categories';
import { AvatarService, BkAvatarToolbarComponent, BkChangeConfirmationComponent, BkHeaderComponent, BkSpinnerComponent } from '@bk/ui';
import { ResourceFormModel } from '@bk/models';
import { ResourceFormComponent } from './resource-form';
import { BkOwnersComponent } from './bk-owners';
import { IonAccordionGroup, IonContent } from '@ionic/angular/standalone';
import { AsyncPipe } from '@angular/common';
import { ResourceService } from './resource.service';
import { getResourceTitle } from './resource.util';
import { convertFormToResource, convertResourceToForm } from './resource-form.util';
import { firstValueFrom, map } from 'rxjs';
import { TranslatePipe } from '@bk/pipes';
import { Photo } from '@capacitor/camera';
import { BkDocumentsAccordionComponent } from '@bk/document';

@Component({
    selector: 'bk-resource-page',
    standalone: true,
    imports: [
      TranslatePipe, AsyncPipe,
      BkAvatarToolbarComponent, ResourceFormComponent, BkHeaderComponent, BkChangeConfirmationComponent,
      BkSpinnerComponent, BkOwnersComponent, BkCommentsAccordionComponent, ResourceFormComponent, BkDocumentsAccordionComponent,
      IonContent, IonAccordionGroup
    ],
    template: `
      <bk-header title="{{ (title$() | async) | translate | async}}" />
      @if(formCanBeSaved) {
        <bk-change-confirmation (okClicked)="save()" />
      } 
      <ion-content>
        @if(vm$() | async; as vm) {
          <bk-avatar-toolbar [key]="vm.modelType + '.'+vm.bkey"  (imageSelected)="onImageSelected($event)" [isEditable]="authorizationService.hasRole('resourceAdmin')"
            title="{{vm.name}}"/>
          <bk-resource-form [vm]="vm" (changedData)="onDataChange($event)" (changedFormState)="onFormStateChange($event)" />

          <ion-accordion-group value="owners">
            @if(authorizationService.isPrivilegedOr('resourceAdmin')) {
              <bk-owners [resourceKey]="resourceService.currentKey()!" />
              <bk-documents-accordion [modelType]="vm.modelType!" [parentKey]="vm.bkey!" />
              <bk-comments-accordion [collectionName]="collectionName" [parentKey]="vm.bkey!" />
            }
          </ion-accordion-group>
        } @else {
          <bk-spinner />
        }
      </ion-content>
  `
})
export class ResourcePageComponent {
  public authorizationService = inject(AuthorizationService);
  public resourceService = inject(ResourceService);
  private appNavigationService = inject(AppNavigationService);
  private avatarService = inject(AvatarService);

  public id = input.required<string>();
  private currentResource$ = computed(() => this.resourceService.readResource(this.id()));
  // view model, must not be identical with the model saved in the database
  protected vm$ = computed(() => this.currentResource$().pipe(map(_resource => convertResourceToForm(_resource))));
  protected title$ = computed(() => this.vm$().pipe(map(_vm => this.getTitle(_vm))));

  protected formCanBeSaved = false;
  public currentForm: ResourceFormModel | undefined;

  public MT = ModelType;
  public collectionName = CollectionNames.Resource;

  constructor() {
    effect(() => this.resourceService.currentKey$.next(this.id()));
  }

  private getTitle(vm: ResourceFormModel): string {
    if (!vm.resourceType) return '';
    return getResourceTitle(vm.resourceType, undefined, this.authorizationService.hasRole('resourceAdmin'));
  }

  /**
   * Update the form data.
   * @param form 
   */
  public onDataChange(form: ResourceFormModel): void {
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
    if (!this.currentForm?.bkey) die('ResourcePage.onImageSelected: currentForm with a key is mandatory.');
    await this.avatarService.uploadPhoto(photo, ModelType.Resource, this.currentForm.bkey);
    window.location.reload();
  }

  /**
   * Save the changes to the resource into the database.
   */
  public async save(): Promise<void> {
    const _currentResource = await firstValueFrom(this.currentResource$());
    if (this.currentForm && _currentResource) {
      await this.resourceService.updateResource(convertFormToResource(_currentResource, this.currentForm));
      this.formCanBeSaved = false;
    }
    this.appNavigationService.back();
  }
}
