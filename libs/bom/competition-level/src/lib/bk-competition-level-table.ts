import { Component, OnInit, inject, input } from '@angular/core';
import { CollectionNames } from '@bk/util';
import { Observable, map } from 'rxjs';
import { DataService } from '@bk/base';
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonGrid, IonRow } from '@ionic/angular/standalone';
import { CompetitionLevelStatistics, CompetitionLevelStatisticsEntry } from './bk-competition-level-table.util';
import { AsyncPipe } from '@angular/common';
import { TranslatePipe } from '@bk/pipes';

@Component({
    selector: 'bk-competition-level-table',
    standalone: true,
    imports: [
      TranslatePipe, AsyncPipe,
      IonCard, IonCardSubtitle, IonCardTitle, IonCardHeader, IonCardContent,
      IonGrid, IonRow, IonCol
    ],
    styles: [`
      ion-grid { 
        --ion-grid-column-padding: 10px; border-collapse: collapse; border-style: hidden;
        ion-row:first-child { background-color:  var(--ion-color-light); font-weight: bold; }
        ion-col { border: 1px solid black; border-bottom: 0; border-right: 0; }
        ion-col:last-child { border-right: 1px solid black; }
        ion-row:last-child { border-bottom: 1px solid black; font-weight: bold; }
      }
`   ],
    template: `
      <ion-card>
        <ion-card-header>
          <ion-card-subtitle>{{ subTitle() | translate | async }}</ion-card-subtitle>
          <ion-card-title>{{ title() | translate | async }}</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-grid>
            <ion-row>
              <ion-col size="2">{{ label() | translate | async }}</ion-col>
              <ion-col>M</ion-col>
              <ion-col>F</ion-col>
              <ion-col>Total</ion-col>
            </ion-row>
            @for(a of (tableData$ | async); track a) {
              <ion-row>
                <ion-col size="2">{{ a.rowTitle }}</ion-col>
                <ion-col>{{ a.m }}</ion-col>
                <ion-col>{{ a.f }}</ion-col>
                <ion-col>{{ a.total }}</ion-col>
              </ion-row>
            }
          </ion-grid>
        </ion-card-content>
      </ion-card>
    `
})
export class BkCompetitionLevelTableComponent implements OnInit {
  private dataService = inject(DataService);
  public title = input('@competitionLevel.statistics.table.title');
  public subTitle = input('@competitionLevel.statistics.table.subTitle');
  public label = input('@competitionLevel.statistics.table.label');

  public tableData$!: Observable<CompetitionLevelStatisticsEntry[]>;

  async ngOnInit(): Promise<void> {
    this.tableData$ = this.dataService.readObject(CollectionNames.Statistics, 'competitionLevels').pipe(map((_data) => (_data  as CompetitionLevelStatistics).entries));
  }
}
