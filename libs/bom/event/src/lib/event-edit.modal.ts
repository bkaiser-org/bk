import { Component, computed, inject, input } from '@angular/core';
import { BkChangeConfirmationComponent, BkErrorToolbarComponent, BkHeaderComponent, BkSpinnerComponent } from '@bk/ui';
import { EventFormModel, EventModel } from '@bk/models';
import { IonContent, ModalController } from '@ionic/angular/standalone';
import { AsyncPipe } from '@angular/common';
import { TranslatePipe } from '@bk/pipes';
import { convertEventToForm, convertFormToEvent } from './event-form.util';
import { EventFormComponent } from './event-form';

@Component({
  selector: 'bk-event-edit-modal',
  standalone: true,
  imports: [
    BkSpinnerComponent, BkHeaderComponent, BkChangeConfirmationComponent, EventFormComponent, BkErrorToolbarComponent,
    TranslatePipe, AsyncPipe,
    IonContent
  ],
  template: `
    <bk-header title="{{ '@event.operation.update.label' | translate | async }}" [isModal]="true" />
    @if(formCanBeSaved) {
      <bk-change-confirmation (okClicked)="save()" />
    }
    <bk-error-toolbar [errorMessage]="errorMessage" />
    <ion-content>
      @if (vm(); as vm) {
        <bk-event-form [vm]="vm" [readOnly]="readOnly()" (changedData)="onDataChange($event)" (changedFormState)="onFormStateChange($event)" (errorMessage)="onError($event)" />
      } @else {
        <bk-spinner />
      }
    </ion-content>
  `
})
export class EventEditModalComponent {
  private readonly modalController = inject(ModalController);

  public event = input.required<EventModel>();
  public readOnly = input(false);
  public vm = computed(() => convertEventToForm(this.event()));

  protected formCanBeSaved = false;
  protected errorMessage = '';
  public currentForm: EventFormModel | undefined;

  public onDataChange(form: EventFormModel): void {
    this.currentForm = form;
  }

  public onFormStateChange(formCanBeSaved: boolean): void {
    this.formCanBeSaved = formCanBeSaved;
  }

  protected onError(errorMessage: string): void {
    this.errorMessage = errorMessage;
  }

  public save(): Promise<boolean> {
    if (this.currentForm) {
      return this.modalController.dismiss(convertFormToEvent(this.currentForm), 'confirm');
    }
    return this.modalController.dismiss(null, 'cancel');
  }
}
