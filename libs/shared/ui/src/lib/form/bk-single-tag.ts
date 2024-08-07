import { Component, inject, input, output } from '@angular/core';
import { IonButton, IonIcon, IonItem, IonLabel, ModalController } from '@ionic/angular/standalone';
import { TranslatePipe } from '@bk/pipes';
import { AsyncPipe } from '@angular/common';
import { BkTagSelectModalComponent } from '../modals/tag-select.modal';
import { string2stringArray } from '@bk/util';

@Component({
  selector: 'bk-single-tag',
  standalone: true,
  imports: [
    TranslatePipe, AsyncPipe, 
    BkTagSelectModalComponent,
    IonButton, IonIcon, IonLabel, IonItem
  ],
  template: `
  <ion-item lines="none">
  @if (tag) {
    <ion-button color="light" (click)="remove()">
      <ion-icon name="close-circle-outline"></ion-icon>
      <ion-label>{{ '@tag.' + tag | translate | async }}</ion-label>
    </ion-button>
  } @else {
    <ion-button color="light" (click)="addTag()">
      <ion-icon name="search-outline"></ion-icon>
      <ion-label>{{ searchLabel() | translate | async }}</ion-label>
    </ion-button>
  }
  </ion-item>
  `
})
export class BkSingleTagComponent {
  protected modalController = inject(ModalController);
  public tags = input.required<string>(); // the list of available tag names, separated by comma
  public searchLabel = input('@general.operation.search.byTag');
  public selectedTag = output<string>(); // the selected tag name

  public tag = '';   // the model, ie the currently selected tag value

  public remove(): void {
    this.tag = '';
    this.selectedTag.emit('');
  }

  public async addTag() {
    const _modal = await this.modalController.create({
      component: BkTagSelectModalComponent,
      cssClass: 'tag-modal',
      componentProps: {
        tags: string2stringArray(this.tags())
      }
    });
    _modal.present();
    const { data, role } = await _modal.onDidDismiss();
    if (role === 'confirm') {
      this.tag = data as string;
      this.selectedTag.emit(this.tag);
    }
  }
}
