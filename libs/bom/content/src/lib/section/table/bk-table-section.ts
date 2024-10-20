import { AsyncPipe, NgStyle } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { SectionModel } from '@bk/models';
import { TranslatePipe } from '@bk/pipes';
import { BkOptionalCardHeaderComponent, BkSpinnerComponent } from '@bk/ui';
import { IonCard, IonCardContent, IonCol, IonGrid, IonItem, IonLabel, IonRow } from '@ionic/angular/standalone';

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
    NgStyle,
    TranslatePipe, AsyncPipe,
    IonCard, IonCardContent, IonGrid, IonRow, IonCol, IonLabel, IonItem
    ],
  styles: [`
  ion-card-content { padding: 0px; }
  ion-card { padding: 0px; margin: 0px; border: 0px; box-shadow: none !important;}
`],
  template: `
  @if(section(); as section) {
    <ion-card>
      <ion-card-content>
        @if(header()?.length === 0 && content()?.length === 0) {
          <ion-item lines="none">
            <ion-label>{{'@content.section.error.emptyTable' | translate | async}}</ion-label>
          </ion-item>
        } @else {
          <div [ngStyle]="gridStyle()">
            @for(header of header(); track header) {
              <div [ngStyle]="headerStyle()">{{header}}</div>
            }
            @for(cell of content(); track cell) {
              <div [ngStyle]="cellStyle()" [innerHTML]="cell"></div>
            }
          </div>
        }
      </ion-card-content>
    </ion-card>
  } @else {
    <bk-spinner />
  }
`
})
export class TableSectionComponent {
  public section = input<SectionModel>();
  protected config = computed(() => this.section()?.properties.table?.config);
  protected header = computed(() => this.section()?.properties.table?.header);
  protected content = computed(() => this.section()?.properties.table?.content);

  protected gridStyle = computed(() => {
    return {
      'display': 'grid',
      'grid-template-columns': this.config()?.gridTemplate ?? 'auto auto',
      'gap': this.config()?.gridGap ?? '1px',
      'background-color': this.config()?.gridBackgroundColor ?? 'grey',
      'padding': this.config()?.gridPadding ?? '1px',
      'margin': '10px'
    };
  });

  protected headerStyle = computed(() => {
    return {
      'background-color': this.config()?.headerBackgroundColor ?? 'lightgrey',
      'text-align': this.config()?.headerTextAlign ?? 'center',
      'font-size': this.config()?.headerFontSize ?? '1rem',
      'font-weight': this.config()?.headerFontWeight ?? 'bold',
      'padding': this.config()?.headerPadding ?? '5px',
    };
  });

  protected cellStyle = computed(() => {
    return {
      'background-color': this.config()?.cellBackgroundColor ?? 'white',
      'text-align': this.config()?.cellTextAlign ?? 'left',
      'font-size': this.config()?.cellFontSize ?? '0.8rem',
      'font-weight': this.config()?.cellFontWeight ?? 'normal',
      'padding': this.config()?.cellPadding ?? '5px',
      '-webkit-user-select': 'text',
      '-moz-user-select': 'text',
      '-ms-user-select': 'text',
      'user-select': 'text'
    };
  });
}
