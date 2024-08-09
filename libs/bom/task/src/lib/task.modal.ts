import { Component, computed, inject, input } from '@angular/core';
import { BkChangeConfirmationComponent, BkHeaderComponent, BkSpinnerComponent } from '@bk/ui';
import { IonButton, IonContent, IonModal, ModalController } from '@ionic/angular/standalone';
import { AsyncPipe } from '@angular/common';
import { TranslatePipe } from '@bk/pipes';
import { AuthorizationService } from '@bk/base';
import { TaskFormModel, TaskModel } from '@bk/models';
import { TaskFormComponent } from './task-form';
import { convertFormToTask, convertTaskToForm, getTaskTitle } from './task.util';

@Component({
  selector: 'bk-task-modal',
  standalone: true,
  imports: [
    BkSpinnerComponent, BkHeaderComponent, BkChangeConfirmationComponent, TaskFormComponent,
    TranslatePipe, AsyncPipe,
    IonModal, IonContent, IonButton
  ],
  template: `
    <bk-header title="{{ title() | translate | async }}" [isModal]="true" />
    @if(formCanBeSaved) {
        <bk-change-confirmation (okClicked)="save()" />
      } 
    <ion-content>
      @if (vm(); as vm) {
        <bk-task-form [vm]="vm" (changedData)="onDataChange($event)" (changedFormState)="onFormStateChange($event)" />
      } @else {
        <bk-spinner />
      }
    </ion-content>
  `
})
export class TaskModalComponent{
  private modalController = inject(ModalController);
  protected authorizationService = inject(AuthorizationService);

  public task = input.required<TaskModel>();
  protected vm = computed(() => convertTaskToForm(this.task(), this.authorizationService.currentUser?.bkey));
  protected title = computed(() => getTaskTitle(this.task().bkey));
  protected formCanBeSaved = false;
  public currentForm: TaskFormModel | undefined;

  public onDataChange(form: TaskFormModel): void {
    this.currentForm = form;
  }

  public onFormStateChange(formCanBeSaved: boolean): void {
    this.formCanBeSaved = formCanBeSaved;
  }

  public save(): Promise<boolean> {
    if (this.currentForm) {
      return this.modalController.dismiss(convertFormToTask(this.task(), this.currentForm), 'confirm');
    }
    return this.modalController.dismiss(null, 'cancel');
  }
}
