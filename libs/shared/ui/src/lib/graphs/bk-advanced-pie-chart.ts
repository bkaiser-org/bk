import { Component, input } from "@angular/core";
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { GraphDataRow } from "./graph-data";
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle } from "@ionic/angular/standalone";

@Component({
    selector: 'bk-advanced-pie-chart',
    standalone: true,
    imports: [
      NgxChartsModule, 
      IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent
    ],
    template: `
      <ion-card style="height: 550px">
        <ion-card-header>
            <ion-card-subtitle>{{ subTitle() }}</ion-card-subtitle>
            <ion-card-title>{{ title() }}</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          @defer {
            <ngx-charts-advanced-pie-chart
              [results]="graphData()"
              [gradient]="gradient"
              (select)="onSelect($event)"
              (activate)="onActivate($event)"
              [scheme]="colorScheme"
              (deactivate)="onDeactivate($event)">
          </ngx-charts-advanced-pie-chart>
          }
          @placeholder (minimum 300ms) {
            <p>Pie Chart</p>
          }
        </ion-card-content>
      </ion-card>
    `
})
export class BkAdvancedPieChartComponent {
  public title = input('');
  public subTitle = input('');
  public graphData = input<GraphDataRow[]>([]);
  public xLabel = input('');
  public yLabel = input('');

  // options
  public gradient = false;
  public colorScheme = 'vivid';
  
  public onSelect(event: unknown): void {
      console.log(event);
  }

  public onActivate(event: unknown): void {
      console.log(event);
  }

  public onDeactivate(event: unknown): void {
      console.log(event);
  }
}