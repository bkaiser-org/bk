import { AsyncPipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { SvgIconPipe, TranslatePipe } from '@bk/pipes';
import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonModal, IonTitle, IonToolbar, ModalController } from '@ionic/angular/standalone';
import { BkHeaderComponent } from '../structural/bk-header';

@Component({
  selector: 'bk-label-select',
  standalone: true,
  imports: [
    TranslatePipe, AsyncPipe, SvgIconPipe,
    BkHeaderComponent,
    IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonContent, IonItem, IonLabel
  ],
  template: `
      <bk-header title="{{ title() | translate | async }}" [isModal]="true" />
      <ion-content>
        @for (label of labels(); track label; let i = $index) {
          <ion-item lines="none" (click)="select(i)">
            @if(icons.length > 0) {
              <ion-icon src="{{icons()[i] | svgIcon}}" slot="start" />
            }
            <ion-label>{{ label | translate | async }}</ion-label>
          </ion-item>
        }
      </ion-content>
  `
})
export class BkLabelSelectModalComponent {
  private modalController = inject(ModalController);

  public labels = input<string[]>([]);
  public icons = input<string[]>([]);
  public title = input('');

  public async select(index: number): Promise<boolean> {
    return await this.modalController.dismiss(index, 'confirm');
  }
}



