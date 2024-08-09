import { Component, input } from '@angular/core';
import { BkSearchbarComponent } from '../bk-searchbar/bk-searchbar';
import { IonCol, IonGrid, IonRow, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'bk-search-toolbar',
  standalone: true,
  imports: [
    BkSearchbarComponent, 
    IonToolbar, IonGrid, IonRow, IonCol
  ],
  template: `
    <ion-toolbar>
      <ion-grid>
        <ion-row class="ion-align-items-center">
          <ion-col class="ion-no-padding" size="12">
            <bk-searchbar [searchTerm]="searchTerm()"></bk-searchbar>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-toolbar>
  `
})
export class BkSearchToolbarComponent {
  public searchTerm = input('');
}
