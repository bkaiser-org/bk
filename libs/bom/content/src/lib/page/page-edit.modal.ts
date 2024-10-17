import { Component, computed, inject, input } from '@angular/core';
import { AuthorizationService } from '@bk/base';
import { BkChangeConfirmationComponent, BkHeaderComponent, BkSpinnerComponent } from '@bk/ui';
import { PageFormModel, PageModel } from '@bk/models';
import { IonAccordionGroup, IonContent, IonItem, IonLabel, ModalController } from '@ionic/angular/standalone';
import { TranslatePipe } from '@bk/pipes';
import { AsyncPipe } from '@angular/common';
import { PageFormComponent } from './page.form';
import { convertFormToPage, convertPageToForm } from './page.form.util';

@Component({
  selector: 'bk-page-edit-modal',
  standalone: true,
  imports: [
    TranslatePipe, AsyncPipe,
    BkSpinnerComponent, BkHeaderComponent, 
    BkChangeConfirmationComponent, PageFormComponent,
    IonContent, IonItem, IonLabel, IonAccordionGroup
  ],
  template: `
        <bk-header title="Webseite ändern" [isModal]="true" />
        @if(formCanBeSaved) {
          <bk-change-confirmation (okClicked)="save()" />
        } 
        <ion-content>
          @if(vm(); as vm) {
            <bk-page-form [vm]="vm" (changedData)="onDataChange($event)" (changedFormState)="onFormStateChange($event)" />
          } @else {
            <bk-spinner />
          }
        </ion-content>
  `
})
export class PageEditModalComponent {
  private readonly modalController = inject(ModalController);
  public authorizationService = inject(AuthorizationService);

  public page = input.required<PageModel>();
  protected vm = computed(() => convertPageToForm(this.page()));

  protected formCanBeSaved = false;
  public currentForm: PageFormModel | undefined;

  public onDataChange(form: PageFormModel): void {
      this.currentForm = form;
  }

  public onFormStateChange(formCanBeSaved: boolean): void {
    this.formCanBeSaved = formCanBeSaved;
  }

  public save(): Promise<boolean> {
    if (this.currentForm) {
      return this.modalController.dismiss(convertFormToPage(this.page(), this.currentForm), 'confirm');
    }
    return this.modalController.dismiss(null, 'cancel');
  }
}
