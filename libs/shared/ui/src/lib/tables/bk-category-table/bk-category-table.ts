import { Component, input } from '@angular/core';
import { CategoryRow } from './category-row';
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonGrid, IonRow } from '@ionic/angular/standalone';
import { TranslatePipe } from '@bk/pipes';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'bk-category-table',
    standalone: true,
    imports: [
      TranslatePipe, AsyncPipe,
      IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonGrid, IonRow, IonCol
    ],
    styles: [`
      ion-grid { 
        --ion-grid-column-padding: 10px; border-collapse: collapse; border-style: hidden;
        ion-row:first-child { background-color:  var(--ion-color-light); font-weight: bold; }
        ion-col { border: 1px solid black; border-bottom: 0; border-right: 0; }
        ion-col:last-child { border-right: 1px solid black; }
        ion-row:last-child { border-bottom: 1px solid black; font-weight: bold; }
      }
    `],
    template: `
      <ion-card>
        <ion-card-header>
          <ion-card-subtitle>{{ subTitle() | translate | async }}</ion-card-subtitle>
          <ion-card-title>{{ title() | translate | async }}</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          @defer {
            <ion-grid>
              <ion-row>
                <ion-col size='2'>{{ label() | translate | async }}</ion-col>
                <ion-col>Total</ion-col>
                <ion-col>A</ion-col>
                <ion-col>F</ion-col>
                <ion-col>E</ion-col>
                <ion-col>J</ion-col>
                <ion-col>K</ion-col>
                <ion-col>P</ion-col>
              </ion-row>
              @for(a of tableData(); track a) {
                <ion-row>
                  <ion-col size='2'>{{ a.rowTitle }}</ion-col>
                  <ion-col>{{ a.total }}</ion-col>
                  <ion-col>{{ a.a }}</ion-col>
                  <ion-col>{{ a.f }}</ion-col>
                  <ion-col>{{ a.e }}</ion-col>
                  <ion-col>{{ a.j }}</ion-col>
                  <ion-col>{{ a.k }}</ion-col>
                  <ion-col>{{ a.p }}</ion-col>
                </ion-row>
            }
            </ion-grid>
          }
          @placeholder {
            <p>Table Date</p>
          }
        </ion-card-content>
      </ion-card>
    `
})
export class BkCategoryTableComponent {
  public title = input('');
  public subTitle = input('');
  public label = input('');
  public tableData = input.required<CategoryRow[]>();
}