import { Component, input } from '@angular/core';
import { GenderRow } from './gender-row';
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonGrid, IonRow } from '@ionic/angular/standalone';

@Component({
    selector: 'bk-gender-table',
    standalone: true,
    imports: [
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
          <ion-card-subtitle>{{ subTitle() }}</ion-card-subtitle>
          <ion-card-title>{{ title() }}</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          @defer () {
            <ion-grid>
            <ion-row>
              <ion-col size="3">{{ label() }}</ion-col>
              <ion-col size="3">Total</ion-col>
              <ion-col size="3">M</ion-col>
              <ion-col size="3">F</ion-col>
            </ion-row>
            @for(a of tableData(); track a) {
              <ion-row>
                <ion-col size="3">{{ a.rowTitle }}</ion-col>
                <ion-col size="3">{{ a.total }}</ion-col>
                <ion-col size="3">{{ a.m }}</ion-col>
                <ion-col size="3">{{ a.f }}</ion-col>
              </ion-row>
            }
          </ion-grid>
          }
          @placeholder {
            <p>Table Data</p>
          }
        </ion-card-content>
      </ion-card>
    `
})
export class BkGenderTableComponent {
  public title = input(''); // title of the table
  public subTitle = input(''); // subtitle of the table
  public label = input(''); // label of the table
  public tableData = input<GenderRow[]>(); // table data
}