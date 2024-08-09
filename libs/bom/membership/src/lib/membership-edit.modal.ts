import { Component, computed, inject, input } from '@angular/core';
import { CollectionNames, error } from '@bk/util';
import { ModelType, RelationshipType } from '@bk/categories';
import { AuthorizationService, BkCommentsAccordionComponent } from '@bk/base';
import { BkChangeConfirmationComponent, BkHeaderComponent, BkSpinnerComponent } from '@bk/ui';
import { getFullRelationshipDescription, setRelationshipTitle } from '@bk/relationship';
import { MembershipFormModel, RelationshipModel } from '@bk/models';
import { MembershipFormComponent } from './membership-form';
import { IonAccordionGroup, IonContent, IonItem, IonLabel, ModalController, ToastController } from '@ionic/angular/standalone';
import { MembershipService } from './membership.service';
import { convertFormToMembership, convertMembershipToForm } from './membership-form.util';
import { TranslatePipe } from '@bk/pipes';
import { AsyncPipe } from '@angular/common';
import { BkDocumentsAccordionComponent } from '@bk/document';

@Component({
  selector: 'bk-membership-edit-modal',
  standalone: true,
  imports: [
    TranslatePipe, AsyncPipe,
    BkSpinnerComponent, BkCommentsAccordionComponent, MembershipFormComponent, BkHeaderComponent,
    BkChangeConfirmationComponent, BkDocumentsAccordionComponent,
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
            <bk-membership-form [vm]="vm" (changedData)="onDataChange($event)" (changedFormState)="onFormStateChange($event)" />
            @if(authorizationService.isPrivilegedOr('memberAdmin')) {
              <ion-accordion-group value="comments">
                <bk-documents-accordion [modelType]="MT.Relationship" [relationshipType]="RT.Membership" [parentKey]="vm.bkey!" />
                <bk-comments-accordion [collectionName]="collectionName" [parentKey]="vm.memberKey!" />
              </ion-accordion-group>
            }
          } @else {
            <bk-spinner />
          }
        </ion-content>
  `
})
export class MembershipEditModalComponent {
  private modalController = inject(ModalController);
  private membershipService = inject(MembershipService);
  public authorizationService = inject(AuthorizationService);
  private toastController = inject(ToastController);

  public membership = input.required<RelationshipModel>();
  protected vm = computed(() => convertMembershipToForm(this.membership()));
  protected title = computed(() => this.getMembershipEditTitle());
  protected relationshipLabel = computed(() => getFullRelationshipDescription(this.membership()));

  protected formCanBeSaved = false;
  public collectionName = CollectionNames.Membership;
  public currentForm: MembershipFormModel | undefined;

  public MT = ModelType;
  public RT = RelationshipType;

  private getMembershipEditTitle(): string {
    return setRelationshipTitle(this.membership(),
      this.authorizationService.checkAuthorization(['resourceAdmin', 'admin']) === true ? 'update' : 'view');
  }

  public onDataChange(form: MembershipFormModel): void {
      this.currentForm = form;
  }

  public onFormStateChange(formCanBeSaved: boolean): void {
    this.formCanBeSaved = formCanBeSaved;
  }

  public async save(): Promise<boolean> {
    if (!this.currentForm) return this.modalController.dismiss(null, 'cancel');

    // check whether an existing validTo/dateOfExit was cleared
    if (this.membership().validTo.length > 0 && this.currentForm?.dateOfExit && this.currentForm.dateOfExit.length === 0) {
      error(this.toastController, 'Cannot clear an existing exit date');
      return this.modalController.dismiss(null, 'cancel');
    }
    const _membership = convertFormToMembership(this.membership(), this.currentForm, true);
    await this.membershipService.updateMembership(_membership);
    return this.modalController.dismiss(_membership, 'confirm');
  }
}
