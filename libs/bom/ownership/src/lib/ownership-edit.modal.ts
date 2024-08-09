import { Component, computed, inject, input } from '@angular/core';
import { CollectionNames } from '@bk/util';
import { ModelType, RelationshipType } from '@bk/categories';
import { AuthorizationService, BkCommentsAccordionComponent, getModelAdmin } from '@bk/base';
import { BkChangeConfirmationComponent, BkHeaderComponent, BkSpinnerComponent } from '@bk/ui';
import { getFullRelationshipDescription, setRelationshipTitle } from '@bk/relationship';
import { OwnershipFormModel, RelationshipModel } from '@bk/models';
import { IonAccordionGroup, IonContent, IonItem, IonLabel, ModalController } from '@ionic/angular/standalone';
import { TranslatePipe } from '@bk/pipes';
import { AsyncPipe } from '@angular/common';
import { OwnershipFormComponent } from './ownership-form';
import { OwnershipService } from './ownership.service';
import { convertFormToOwnership, convertOwnershipToForm } from './ownership-form.util';
import { BkDocumentsAccordionComponent } from '@bk/document';

@Component({
  selector: 'bk-ownership-edit-modal',
  standalone: true,
  imports: [
    TranslatePipe, AsyncPipe,
    BkSpinnerComponent, BkCommentsAccordionComponent, BkHeaderComponent,
    BkChangeConfirmationComponent, OwnershipFormComponent, BkDocumentsAccordionComponent,
    IonContent, IonItem, IonLabel, IonAccordionGroup
  ],
  template: `
        <bk-header title="{{ title() }}" [isModal]="true" />
        @if(formCanBeSaved) {
          <bk-change-confirmation (okClicked)="save()" />
        } 
        <ion-content>
          @if(vm(); as vm) {
            <ion-item lines="none">
              <ion-label>{{ relationshipLabel() }}</ion-label>
            </ion-item>
            <bk-ownership-form [vm]="vm" (changedData)="onDataChange($event)" (changedFormState)="onFormStateChange($event)" />
            @if(authorizationService.isPrivilegedOr('resourceAdmin')) {
              <bk-documents-accordion [modelType]="MT.Relationship" [relationshipType]="RT.Ownership" [parentKey]="vm.bkey!" />
            }
            @if(authorizationService.isPrivileged()) {
              <ion-accordion-group value="comments">
                <bk-comments-accordion [collectionName]="collectionName" [parentKey]="vm.bkey!" />
              </ion-accordion-group>
            }
          } @else {
            <bk-spinner />
          }
        </ion-content>
  `
})
export class OwnershipEditModalComponent {
  private modalController = inject(ModalController);
  private ownershipService = inject(OwnershipService);
  public authorizationService = inject(AuthorizationService);

  public ownership = input.required<RelationshipModel>();
  protected vm = computed(() => convertOwnershipToForm(this.ownership())); // current view model for editing
  protected title = computed(() => this.getOwnershipEditTitle(this.ownership()));
  public relationshipLabel = computed(() => getFullRelationshipDescription(this.ownership()));

  protected formCanBeSaved = false;
  public collectionName = CollectionNames.Ownership;
  public currentForm: OwnershipFormModel | undefined;
  public MT = ModelType;
  public RT = RelationshipType;

  private getOwnershipEditTitle(ownership: RelationshipModel): string {
    return setRelationshipTitle(ownership,
      this.authorizationService.checkAuthorization(getModelAdmin(ModelType.Relationship)) === true ? 'update' : 'view');
  }

  public onDataChange(form: OwnershipFormModel): void {
    this.currentForm = form;
  }

  public onFormStateChange(formCanBeSaved: boolean): void {
    this.formCanBeSaved = formCanBeSaved;
  }

  public async save(): Promise<boolean> {
    let _ownership = this.ownership();  // save the existing membership, update this later with the new data from currentForm

    // check whether an exitDate was inserted (end Membership)
    if (this.ownership().validTo !== this.currentForm?.validTo) {
      this.ownershipService.saveComment(CollectionNames.Ownership, this.ownership().bkey, '@comment.message.ownership.deleted');
    }
    _ownership = convertFormToOwnership(this.ownership(), this.currentForm);
    await this.ownershipService.updateOwnership(_ownership);
    return this.modalController.dismiss(_ownership, 'confirm');
  }
}
