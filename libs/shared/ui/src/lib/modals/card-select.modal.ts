import { AsyncPipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { TranslatePipe } from '@bk/pipes';
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonContent, IonGrid, IonImg, IonItem, IonLabel, IonRow, ModalController } from '@ionic/angular/standalone';
import { BkHeaderComponent } from '../structural/bk-header';
import { Category } from '@bk/categories';

@Component({
  selector: 'bk-card-select-modal',
  standalone: true,
  imports: [
    TranslatePipe, AsyncPipe, 
    BkHeaderComponent,
    IonContent, IonLabel, IonItem, IonGrid, IonRow, IonCol, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCardSubtitle, IonImg
  ],
  styles: [`
    ion-card-content { padding: 0px; }
    ion-card { padding: 0px; margin: 0px; }
  `],
  template: `
    @if(slug()) {
      <bk-header title="{{ '@general.operation.select.' + slug() | translate | async }}" [isModal]="true" />
      <ion-content>
        <ion-grid>
          <ion-row>
            @for(cat of categories(); track cat; let i = $index) {
              <ion-col size="6" size-md="3">
                <ion-card (click)="select(i)">
                  <ion-card-header>
                    <ion-card-title>{{ '@' + cat.i18nBase + '.label' | translate | async }}</ion-card-title>
                    <ion-card-subtitle>{{ cat.name }}</ion-card-subtitle>
                  </ion-card-header>
                  <ion-card-content>
                    <ion-img src="{{ 'assets/' + slug() + '/' + cat.name + '.png'}}" alt="{{ cat.name }}" />
                  </ion-card-content>
                </ion-card>
              </ion-col>
            }
          </ion-row>
        </ion-grid>
      </ion-content>
    }
  `,
})
export class BkCardSelectModalComponent {
  private modalController = inject(ModalController);

  public categories = input.required<Category[]>();
  public slug = input.required<string>();
  
  public async select(index: number): Promise<boolean> {
    return await this.modalController.dismiss(index, 'confirm');
  }
}
