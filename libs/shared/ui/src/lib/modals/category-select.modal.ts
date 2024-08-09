import { AsyncPipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { TranslatePipe } from '@bk/pipes';
import { IonContent, IonItem, IonLabel, ModalController } from '@ionic/angular/standalone';
import { BkHeaderComponent } from '../structural/bk-header';
import { CategoryConfig } from '@bk/categories';

@Component({
  selector: 'bk-category-select-modal',
  standalone: true,
  imports: [
    TranslatePipe, AsyncPipe, 
    BkHeaderComponent,
    IonContent, IonLabel, IonItem
  ],
  template: `
    <bk-header title="{{ '@general.operation.select.category' | translate | async }}" [isModal]="true" />
    <ion-content class="ion-padding">
      @for (cat of config().categories; track cat; let i = $index) {
        <ion-item lines="none" (click)="select(i)">
          <ion-label>{{ '@' + cat.i18nBase + '.label' | translate | async }}</ion-label>
        </ion-item>
      }
    </ion-content>
  `,
})
export class BkCategorySelectModalComponent {
  private modalController = inject(ModalController);
  public config = input.required<CategoryConfig>();
  
  public async select(index: number): Promise<boolean> {
    return await this.modalController.dismiss(index, 'confirm');
  }
}
