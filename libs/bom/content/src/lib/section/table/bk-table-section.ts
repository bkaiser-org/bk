import { Component, input } from '@angular/core';
import { SectionModel } from '@bk/models';
import { BkOptionalCardHeaderComponent, BkSpinnerComponent } from '@bk/ui';
import { IonCard, IonCardContent, IonCol, IonGrid, IonLabel, IonRow } from '@ionic/angular/standalone';
import { GuiGridModule } from '@generic-ui/ngx-grid';

/**
 * Data grid based on open source (Generic UI Data Grid)[https://generic-ui.com/].
 * features virtual scrolling, editing, multi sorting, searching, automatic summaries calculations
 * themes
 * See Documentation: https://generic-ui.com/guide/nx-angular-cli
 */
@Component({
  selector: 'bk-table-section',
  standalone: true,
  imports: [
    BkSpinnerComponent, BkOptionalCardHeaderComponent,
    IonCard, IonCardContent, IonGrid, IonRow, IonCol, IonLabel,
    GuiGridModule
    ],
  styles: [`
  ion-card-content { padding: 0px; }
  ion-card { padding: 0px; margin: 0px; border: 0px; box-shadow: none !important;}
`],
  template: `
  @if(section(); as section) {
    <ion-card>
      <ion-card-content>
        <gui-grid 
          [columns]="section.properties.table?.columns ?? []" 
          [source]="section.properties.table?.source ?? []">
      </gui-grid>
      </ion-card-content>
    </ion-card>
  } @else {
    <bk-spinner />
  }
`
})
export class BkTableSectionComponent {
  public section = input<SectionModel>();
}
