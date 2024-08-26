import { Component, OnInit, inject } from '@angular/core';
import { ALL_COMPETITION_LEVEL_FIELDS, CompetitionLevelModel } from '@bk/models';
import { CompetitionLevels, ListType } from '@bk/categories';
import { BkAvatarLabelComponent, BkCatComponent, BkSearchbarComponent, BkSpinnerComponent } from '@bk/ui';
import { CollectionNames, bkTranslate } from '@bk/util';
import { CategoryAbbreviationPipe, FullNamePipe, IsSortedPipe, PrettyDatePipe, SortDirectionPipe, TranslatePipe } from '@bk/pipes';
import { BkCompetitionLevelTableComponent } from '../bk-competition-level-table';
import { IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonLabel, IonMenuButton, IonRow, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { BaseModelListComponent } from '@bk/base';
import { AsyncPipe } from '@angular/common';
import { CompetitionLevelAllService } from './competition-level-all.service';
import { addIcons } from "ionicons";
import { downloadOutline, arrowUpOutline, arrowDownOutline } from "ionicons/icons";

@Component({
  selector: 'bk-competition-level-all-list',
  standalone: true,
  imports: [ 
    TranslatePipe, AsyncPipe, PrettyDatePipe,
    BkAvatarLabelComponent, BkSpinnerComponent, BkSearchbarComponent, 
    BkCompetitionLevelTableComponent, BkCatComponent,
    FullNamePipe, CategoryAbbreviationPipe, IsSortedPipe, SortDirectionPipe,
    IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonGrid, IonRow, IonCol, IonIcon, IonLabel, IonContent, IonMenuButton, IonItem  
  ],
  template: `
  <ion-header>
  <ion-toolbar color="secondary" id="bkheader">
    <ion-buttons slot="start"><ion-menu-button /></ion-buttons>
    <ion-title>{{ baseService.filteredItems().length }} {{ '@competitionLevel.plural' | translate | async }}</ion-title>
    <ion-buttons slot="end">
      @if(authorizationService.isPrivilegedOr('memberAdmin')) {
        <ion-button (click)="export()">
          <ion-icon slot="icon-only" name="download-outline" />
        </ion-button>
      }
    </ion-buttons>
  </ion-toolbar>
  <bk-competition-level-table></bk-competition-level-table>
  <ion-toolbar>
    <ion-grid>
      <ion-row>
        <ion-col size="6" size-md="8">
          <bk-searchbar placeholder="{{ '@general.operation.search.placeholder' | translate | async  }}"  (ionInput)="baseService.onSearchtermChange($event)"></bk-searchbar>
        </ion-col>
        <ion-col size="6" size-md="4">
          <bk-cat [config]="baseService.categoryConfig()!" (ionChange)="onCategoryChange($event)" />
        </ion-col>
      </ion-row>
    </ion-grid>
  </ion-toolbar>
  <ion-toolbar color="primary">
    <ion-grid>
      <ion-row>
        <ion-col size="6">
          <ion-button (click)="baseService.sort(SF.Name)" fill="clear">
            @if(baseService.currentSortCriteria() | isSorted:SF.Name) {
              <ion-icon color="light" slot="end" name="{{ baseService.currentSortCriteria().direction | sortDirection }}" />
            }
            <ion-label color="light"><strong>{{ '@competitionLevel.list.header.name' | translate | async }}</strong></ion-label>
          </ion-button>
        </ion-col>
        <ion-col size="6" size-md="3">
          <ion-button (click)="baseService.sort(SF.Category)" fill="clear">
            @if(baseService.currentSortCriteria() | isSorted:SF.Category) {
              <ion-icon color="light" slot="end" name="{{ baseService.currentSortCriteria().direction | sortDirection }}" />
            }
            <ion-label color="light"><strong>{{ '@competitionLevel.list.header.competitionLevel' | translate | async }}</strong></ion-label>
          </ion-button>
        </ion-col>
        <ion-col size-md="3" class="ion-hide-md-down">
          <ion-button (click)="baseService.sort(SF.DateOfBirth)" fill="clear">
            @if(baseService.currentSortCriteria() | isSorted:SF.DateOfBirth) {
              <ion-icon color="light" slot="end" name="{{ baseService.currentSortCriteria().direction | sortDirection }}" />
            }
            <ion-label color="light"><strong>{{ '@competitionLevel.list.header.birthDate' | translate | async }}</strong></ion-label>
          </ion-button>
        </ion-col>
      </ion-row>
    </ion-grid>
  </ion-toolbar>
</ion-header>
<ion-content #content>
    @if(getCompetitionLevels(); as filteredItems) {
      <ion-grid>
        @for(item of filteredItems; track item.bkey) {
          <ion-row>
            <ion-col size="6">
              <bk-avatar-label key="{{ '0.' + item.personKey}}" label="{{item['firstName'] | fullName:item.name}}" />
            </ion-col>
            <ion-col size="6" size-md="3">
              <ion-item lines="none">{{ item.competitionLevel | categoryAbbreviation:CLS }}</ion-item>
            </ion-col>
            <ion-col size-md="3" class="ion-hide-md-down">
              <ion-item lines="none">{{ item.dateOfBirth | prettyDate }}</ion-item>
            </ion-col>
          </ion-row>
        }
      </ion-grid>
    } @else {
      <bk-spinner />
    }
</ion-content>

  `
})
export class CompetitionLevelAllListComponent extends BaseModelListComponent implements OnInit {
  protected baseService = inject(CompetitionLevelAllService);

  public CLS = CompetitionLevels;
  protected listType = ListType.CompetitionLevelAll;
  protected collectionName = CollectionNames.CompetitionLevel;
  protected listRoute = '/competitionLevel/all';

  constructor() {
    super();
    addIcons({downloadOutline, arrowUpOutline, arrowDownOutline});
  }

  ngOnInit(): void {
    this.prepareData(this.listType);
  }

  protected getCompetitionLevels(): CompetitionLevelModel[] {
    return this.baseService.filteredItems() as CompetitionLevelModel[];
  }

  public export(): void {
    this.baseService.export2excel(bkTranslate(`@competitionLevel.plural`), ALL_COMPETITION_LEVEL_FIELDS);
  }
}
