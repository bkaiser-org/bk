import { Component, computed, inject, input } from '@angular/core';
import { BkChangeConfirmationComponent, BkHeaderComponent, BkSpinnerComponent } from '@bk/ui';
import { IonButton, IonContent, IonModal, ModalController } from '@ionic/angular/standalone';
import { AsyncPipe } from '@angular/common';
import { TranslatePipe } from '@bk/pipes';
import { AuthorizationService } from '@bk/base';
import { MenuItemFormModel, MenuItemModel } from '@bk/models';
import { convertFormToMenuItem, convertMenuItemToForm, getMenuItemTitle } from './menu.util';
import { MenuItemFormComponent } from './menu-item.form';

@Component({
  selector: 'bk-menu-item-modal',
  standalone: true,
  imports: [
    BkSpinnerComponent, BkHeaderComponent, BkChangeConfirmationComponent,
    MenuItemFormComponent,
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
        <bk-menu-item-form [vm]="vm" (changedData)="onDataChange($event)" (changedFormState)="onFormStateChange($event)" />
      } @else {
        <bk-spinner />
      }
    </ion-content>
  `
})
export class MenuItemModalComponent {
  private modalController = inject(ModalController);
  protected authorizationService = inject(AuthorizationService);

  public menuItem = input.required<MenuItemModel>();
  protected vm = computed(() => convertMenuItemToForm(this.menuItem()));
  protected title = computed(() => getMenuItemTitle(this.menuItem().bkey));

  protected formCanBeSaved = false;
  public currentForm: MenuItemFormModel | undefined;

  public onDataChange(form: MenuItemFormModel): void {
    this.currentForm = form;
  }

  public onFormStateChange(formCanBeSaved: boolean): void {
    this.formCanBeSaved = formCanBeSaved;
  }

  public save(): Promise<boolean> {
    if (this.currentForm) {
      return this.modalController.dismiss(convertFormToMenuItem(this.currentForm), 'confirm');
    }
    return this.modalController.dismiss(null, 'cancel');
  }
}
