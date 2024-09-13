import { Component, computed, inject, input } from '@angular/core';
import { CollectionNames, confirm } from '@bk/util';
import { ModelType, RelationshipType } from '@bk/categories';
import { AuthorizationService, BkCommentsAccordionComponent, DataService, saveComment } from '@bk/base';
import { BkChangeConfirmationComponent, BkHeaderComponent, BkSpinnerComponent } from '@bk/ui';
import { getFullRelationshipDescription, setRelationshipTitle } from '@bk/relationship';
import { RelationshipModel, ReservationFormModel } from '@bk/models';
import { AlertController, IonAccordionGroup, IonContent, IonItem, IonLabel, ModalController } from '@ionic/angular/standalone';
import { TranslatePipe } from '@bk/pipes';
import { AsyncPipe } from '@angular/common';
import { ReservationFormComponent } from './reservation-form';
import { convertFormToReservation, convertReservationToForm } from './reservation-form.util';
import { BkDocumentsAccordionComponent } from '@bk/document';

@Component({
  selector: 'bk-reservation-edit-modal',
  standalone: true,
  imports: [
    TranslatePipe, AsyncPipe,
    BkSpinnerComponent, BkCommentsAccordionComponent, BkHeaderComponent,
    BkChangeConfirmationComponent, ReservationFormComponent, BkDocumentsAccordionComponent,
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
            <bk-reservation-form [vm]="vm" (changedData)="onDataChange($event)" (changedFormState)="onFormStateChange($event)" />
            @if(authorizationService.isPrivileged()) {
              <ion-accordion-group value="comments">
                <bk-documents-accordion [modelType]="MT.Relationship" [relationshipType]="RT.Reservation" [parentKey]="vm.bkey!" />
                <bk-comments-accordion [collectionName]="collectionName" [parentKey]="vm.bkey!" />
              </ion-accordion-group>
            }
          } @else {
            <bk-spinner />
          }
        </ion-content>
  `
})
export class ReservationEditModalComponent {
  private modalController = inject(ModalController);
  private dataService = inject(DataService);
  public authorizationService = inject(AuthorizationService);
  private alertController = inject(AlertController);

  public reservation = input.required<RelationshipModel>(); 
  protected vm = computed(() => convertReservationToForm(this.reservation())); // current view model for editing
  protected title = computed(() => setRelationshipTitle(this.reservation(),
    this.authorizationService.checkAuthorization(['resourceAdmin', 'admin']) === true ? 'update' : 'view'));
  protected relationshipLabel = computed(() => getFullRelationshipDescription(this.reservation()));

  protected formCanBeSaved = false;
  public collectionName = CollectionNames.Reservation;
  public currentForm: ReservationFormModel | undefined;
  public MT = ModelType;
  public RT = RelationshipType;

  public onDataChange(form: ReservationFormModel): void {
    this.currentForm = form;
  }

  public onFormStateChange(formCanBeSaved: boolean): void {
    this.formCanBeSaved = formCanBeSaved;
  }

  public async save(): Promise<boolean> {
    if (!this.currentForm) this.cancel();

    const _reservation = convertFormToReservation(this.reservation(), this.currentForm);
    let _key = _reservation.bkey;
    if (_reservation.bkey && _reservation.bkey.length > 0) {  // update
      await this.dataService.updateModel(CollectionNames.Reservation, _reservation, '@reservation.operation.update');

    } else {  // create                             // create
      _key = await this.dataService.createModel(CollectionNames.Reservation, _reservation, '@reservation.operation.create');
      await saveComment(this.dataService, this.authorizationService.currentUser(), CollectionNames.Reservation, _key, '@comment.operation.initial.conf');
      confirm(this.alertController, '@event.type.reservation.bh.confirmation', false);  
    }

    return this.modalController.dismiss(_reservation, 'confirm');
  }

  public async cancel(): Promise<void> {
    this.modalController.dismiss(null, 'cancel');
  }
}
