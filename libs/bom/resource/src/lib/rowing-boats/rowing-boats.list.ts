import { Component, OnInit, inject } from '@angular/core';
import { BoatTypes, ListType } from '@bk/categories';
import { BoatTags, CollectionNames, bkTranslate } from '@bk/util';
import { ResourceModel } from '@bk/models';
import { BkAvatarLabelComponent, BkCatComponent, BkSearchbarComponent, BkSingleTagComponent, BkSpinnerComponent } from '@bk/ui';
import { CategoryNamePipe, IsSortedPipe, SortDirectionPipe, TranslatePipe } from '@bk/pipes';
import { ResourceLogoPipe } from '../resource-logo.pipe';
import { IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonLabel, IonMenuButton, IonRow, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { AsyncPipe } from '@angular/common';
import { BaseModelListComponent } from '@bk/base';
import { RowingBoatsService } from './rowing-boats.service';
import { addIcons } from "ionicons";
import { addCircleOutline, downloadOutline, arrowUpOutline, arrowDownOutline } from "ionicons/icons";

@Component({
  selector: 'bk-resource-list',
  standalone: true,
  imports: [
    BkAvatarLabelComponent, BkSearchbarComponent, BkSpinnerComponent, BkSingleTagComponent, BkCatComponent,
    TranslatePipe, IsSortedPipe, SortDirectionPipe, CategoryNamePipe, ResourceLogoPipe, AsyncPipe, 
    IonHeader, IonToolbar, IonButtons, IonTitle, IonButton, IonMenuButton,
    IonGrid, IonRow, IonCol, IonIcon, IonItem, IonLabel, IonContent
  ],
  template: `
  <ion-header>
  <ion-toolbar color="secondary" id="bkheader">
    <ion-buttons slot="start"><ion-menu-button></ion-menu-button></ion-buttons>
    <ion-title>{{baseService.filteredItems().length }} {{ baseService.title() | translate | async}}</ion-title>
    <ion-buttons slot="end">
      @if(authorizationService.hasRole('resourceAdmin')) {
        <ion-button (click)="add()"><ion-icon slot="icon-only" name="add-circle-outline" /></ion-button>
      }
      @if(authorizationService.isPrivilegedOr('resourceAdmin')) {
        <ion-button (click)="export()"><ion-icon slot="icon-only" name="download-outline" /></ion-button>
      }
    </ion-buttons>
  </ion-toolbar>
  <ion-toolbar>
    <ion-grid>
      <ion-row>
        <ion-col size="12" size-md="6">
          <bk-searchbar placeholder="{{ '@general.operation.search.placeholder' | translate | async }}" (ionInput)="baseService.onSearchtermChange($event)" />
        </ion-col>
        <ion-col size="6" size-md="3">
          <bk-single-tag (selectedTag)="onTagSelected($event)" [tags]="boatTags" />
        </ion-col>
        <ion-col size="6" size-md="3">
          <bk-cat [config]="baseService.categoryConfig()!" (ionChange)="onCategoryChange($event)" />
        </ion-col>
      </ion-row>
    </ion-grid>
  </ion-toolbar>
  <ion-toolbar color="primary">
    <ion-grid>
      <ion-row>
        <ion-col size="9" size-md="6">
          <ion-button (click)="baseService.sort(SF.Name)" fill="clear">
            @if(baseService.currentSortCriteria() | isSorted:SF.Name) {
              <ion-icon color="light" slot="end" name="{{ baseService.currentSortCriteria().direction | sortDirection }}" />
            }
            <ion-label color="light"><strong>{{ '@input.boatName.label' | translate | async }}</strong></ion-label>
          </ion-button>    
        </ion-col>
        <ion-col size="3">
          <ion-button (click)="baseService.sort(SF.SubType)" fill="clear">
            @if(baseService.currentSortCriteria() | isSorted:SF.SubType) {
              <ion-icon color="light" slot="end" name="{{ baseService.currentSortCriteria().direction | sortDirection }}" />
            }
            <ion-label color="light"><strong>{{ '@input.boatType.label' | translate | async }}</strong></ion-label>
          </ion-button>    
        </ion-col>
        <ion-col size="3" class="ion-hide-md-down">
          <ion-button (click)="baseService.sort(SF.Load)" fill="clear">
            @if(baseService.currentSortCriteria() | isSorted:SF.Load) {
              <ion-icon color="light" slot="end" name="{{ baseService.currentSortCriteria().direction | sortDirection }}" />
            }
            <ion-label color="light" class="ion-hide-md-down"><strong>{{ '@input.load.label' | translate | async }}</strong></ion-label>
          </ion-button>    
        </ion-col>
      </ion-row>
    </ion-grid>
  </ion-toolbar>
</ion-header>
<ion-content #content>
  @if(getResources(); as resources) {
    <ion-grid>
      @for(resource of resources; track resource.bkey) {
        <ion-row (click)="edit(resource.bkey!)">
          <ion-col size="9" size-md="6">
            <bk-avatar-label key="{{'4.'+resource.bkey}}" label="{{resource.name}}" />
          </ion-col>
          <ion-col size="3">
            <ion-item lines="none">
            <ion-label>{{ resource.subType | categoryName:BT }}</ion-label>
            </ion-item>
          </ion-col>
          <ion-col size="3" class="ion-hide-md-down">
            <ion-item lines="none">
            <ion-label class="ion-hide-md-down">{{ resource?.load }}</ion-label>
            </ion-item>
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
export class ResourceRowingBoatsListComponent extends BaseModelListComponent implements OnInit {
  protected baseService = inject(RowingBoatsService);

  public BT = BoatTypes;

  protected listType = ListType.ResourceRowingBoats;
  protected collectionName = CollectionNames.Boat;
  protected listRoute = '/resource/rowingBoats';
  protected boatTags = BoatTags;

  constructor() {
    super();
    addIcons({addCircleOutline, downloadOutline, arrowUpOutline, arrowDownOutline});
  }

  ngOnInit(): void {
    this.prepareData(this.listType);
  }

  public getResources(): ResourceModel[] {
    return this.baseService.filteredItems() as ResourceModel[];
  }

  public async export(): Promise<void> {
    // await this.baseService.export2excel(bkTranslate('@resource.plural'), ALL_RESOURCE_FIELDS);
    console.log('export is not implemented yet');
  }
}

