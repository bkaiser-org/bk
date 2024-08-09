import { Component, input } from "@angular/core";
import { LegendPosition, NgxChartsModule } from '@swimlane/ngx-charts';
import { GraphDataSeries } from "./graph-data";
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle } from "@ionic/angular/standalone";

@Component({
    selector: 'bk-line-chart',
    standalone: true,
    animations: [],
    imports: [
      NgxChartsModule, 
      IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent
    ],
    template: `
      <ion-card style="height: 550px">
        <ion-card-header>
          <ion-card-subtitle>{{ title() }}</ion-card-subtitle>
          <ion-card-title>{{ subTitle() }}</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          @defer {
            <div #containerRef>
            <ngx-charts-line-chart 
              [results]="graphData()"
              [customColors]="colorScheme"
              [gradient]="gradient"
              [xAxis]="showXAxis" [yAxis]="showYAxis"
              [view]="[containerRef.offsetWidth, 400]"
              [legend]="showLegend"
              [legendTitle]="''"
              [legendPosition]=legendPosition
              [showXAxisLabel]="showXAxisLabel" [showYAxisLabel]="showYAxisLabel"
              [xAxisLabel]="xAxisLabel()" [yAxisLabel]="yAxisLabel()"
              [autoScale]="autoScale" 
              (select)="onSelect($event)">
            </ngx-charts-line-chart>
          </div>
          }
          @placeholder (minimum 300ms) {
            <p>Line Chart</p>
          }
        </ion-card-content>
      </ion-card>
    `
})
export class BkLineChartComponent {
  public title = input('');
  public subTitle = input('');
  public graphData = input<GraphDataSeries[]>([]);
  public xLabel = input('');
  public yLabel = input('');
  public xAxisLabel = input('');
  public yAxisLabel = input('');

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  showYAxisLabel = true;
  autoScale = true;
  legendPosition = LegendPosition.Below;

  colorScheme = [
    { name: 'Aktive', value: '#009D53' },
    { name: 'Jugendliche', value: '#014da2' },
    { name: 'Total', value: '#00A2FF' }
  ];
  //    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']

  onSelect(event: unknown) {
    console.log(event);
  }
}