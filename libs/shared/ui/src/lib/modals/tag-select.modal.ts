import { AsyncPipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { TranslatePipe } from '@bk/pipes';
import { IonChip, IonContent, IonLabel, ModalController } from '@ionic/angular/standalone';
import { BkHeaderComponent } from '../structural/bk-header';

@Component({
  selector: 'bk-tag-select-modal',
  standalone: true,
  imports: [
    TranslatePipe, AsyncPipe, 
    BkHeaderComponent,
    IonContent, IonChip, IonLabel
  ],
  template: `
    <bk-header title="{{ '@general.operation.select.tag' | translate | async }}" [isModal]="true" />
    <ion-content class="ion-padding">
      @for (tag of tags(); track tag) {
        <ion-chip color="primary" (click)="select(tag)">
          <ion-label>{{ '@tag.' + tag | translate | async }} </ion-label>
        </ion-chip>  
      }
    </ion-content>
  `,
})
export class BkTagSelectModalComponent {
  private modalController = inject(ModalController);
  public tags = input<string[]>([]);

  public async select(tag: string): Promise<boolean> {
    return await this.modalController.dismiss(tag, 'confirm');
  }
}
