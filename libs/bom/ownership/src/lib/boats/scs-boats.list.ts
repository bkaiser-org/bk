import { Component, OnInit, inject } from '@angular/core';
import { ALL_RELATIONSHIP_FIELDS, RelationshipModel } from '@bk/models';
import { BoatTypes, FilterType, ListType, RelationshipStates } from '@bk/categories';
import { BoatTags, CollectionNames, bkTranslate } from '@bk/util';
import { export2excel } from '@bk/core';
import { AvatarPipe, BkAvatarLabelComponent, BkCatComponent, BkSearchbarComponent, BkSingleTagComponent, BkSpinnerComponent } from '@bk/ui';
import { CategoryNamePipe, FullNamePipe, IsSortedPipe, SortDirectionPipe, TranslatePipe } from '@bk/pipes';
import { BaseModelListComponent } from '@bk/base';
import { IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonLabel, IonMenuButton, IonRow, IonTitle, IonToolbar ,IonBackdrop, IonItemSliding, IonItemOptions, IonItemOption, IonAvatar, IonImg } from '@ionic/angular/standalone';
import { AsyncPipe } from '@angular/common';
import { ScsBoatsService } from './scs-boats.service';
import { addIcons } from "ionicons";
import { addCircleOutline, createOutline, downloadOutline, arrowUpOutline, arrowDownOutline, trashOutline } from "ionicons/icons";

@Component({
  selector: 'bk-ownership-list',
  standalone: true,
  imports: [ 
    BkSearchbarComponent, BkSpinnerComponent,
    BkSingleTagComponent, BkCatComponent, BkAvatarLabelComponent,
    TranslatePipe, CategoryNamePipe, FullNamePipe, IsSortedPipe, SortDirectionPipe, AsyncPipe, AvatarPipe,
    IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonButton,
    IonGrid, IonRow, IonCol, IonIcon, IonLabel, IonContent, IonItem, IonBackdrop,
    IonItemSliding, IonItemOptions, IonItemOption, IonAvatar, IonImg   
  ],
  template: `
  <ion-header>
    <ion-toolbar color="secondary" id="bkheader">
      <ion-buttons slot="start"><ion-menu-button /></ion-buttons>
      <ion-title>{{baseService.filteredItems().length }} {{ baseService.title() | translate | async }}</ion-title>
      <ion-buttons slot="end">
        @if(authorizationService.hasRole('resourceAdmin')) {
          <ion-button (click)="addOwnership()">
            <ion-icon slot="icon-only" name="add-circle-outline" />
          </ion-button>
        }
        @if(authorizationService.isPrivilegedOr('resourceAdmin')) {
          <ion-button (click)="export()">
            <ion-icon slot="icon-only" name="download-outline" />
          </ion-button>
        }
      </ion-buttons>
    </ion-toolbar>

    <ion-toolbar>
      <ion-grid>
        <ion-row>
          <ion-col size="12" size-md="6">
            <bk-searchbar placeholder="{{ '@general.operation.search.placeholder' | translate | async  }}"  (ionInput)="baseService.onSearchtermChange($event)" />
          </ion-col>
          <ion-col size="6" size-md="3">
            <bk-single-tag (selectedTag)="onTagSelected($event)" [tags]="boatTags" />
          </ion-col>
          <ion-col size="6" size="3">
          <bk-cat [config]="baseService.categoryConfig()!" (ionChange)="onCategoryChange($event)" />
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-toolbar>
  
    <ion-toolbar color="primary">
      <ion-grid>
        <ion-row>
          <ion-col size="6">
            <ion-button (click)="baseService.sort(SF.ObjectName)" fill="clear">
              @if(baseService.currentSortCriteria() | isSorted:SF.ObjectName) {
                <ion-icon color="light" slot="end" name="{{ baseService.currentSortCriteria().direction | sortDirection }}" />
              }
              <ion-label color="light"><strong>{{ '@input.boatName.label' | translate | async }}</strong></ion-label>
            </ion-button>
          </ion-col>
          <ion-col size="6">
            <ion-button (click)="baseService.sort(SF.ObjectCategory)" fill="clear">
              @if(baseService.currentSortCriteria() | isSorted:SF.ObjectCategory) {
                <ion-icon color="light" slot="end" name="{{ baseService.currentSortCriteria().direction | sortDirection }}" />
              }
              <ion-label color="light"><strong>{{ '@input.boatType.label' | translate | async }}</strong></ion-label>
            </ion-button>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-toolbar>  
  </ion-header>
  <ion-content #content>

  @if(getOwnerships(); as ownerships) {
    @if(ownerships.length === 0) {
      <ion-item><ion-label>No Data</ion-label></ion-item>
    } @else {
      @for(_ownership of ownerships; track _ownership.bkey) {
        <ion-item-sliding #slidingItem>
          <ion-item (click)="edit(_ownership.objectKey, MT.Boat)">
            <ion-avatar slot="start">
              <ion-img src="{{_ownership.objectType + '.' + _ownership.objectKey | avatar | async}}" alt="Avatar Logo" />
            </ion-avatar>
            <ion-label>{{_ownership.objectName}}</ion-label>
            <ion-label>{{_ownership.objectCategory | categoryName:BT}}</ion-label>
          </ion-item>
          @if(authorizationService.hasRole('resourceAdmin')) {
            <ion-item-options side="end">
              <ion-item-option color="danger" (click)="endOwnership(slidingItem, _ownership)">
                <ion-icon slot="icon-only" name="trash-outline" />
              </ion-item-option>
              <ion-item-option color="primary" (click)="editOwnership(slidingItem, _ownership)">
                <ion-icon slot="icon-only" name="create-outline" />
              </ion-item-option>
            </ion-item-options>
          }
        </ion-item-sliding>
      }
    }
  } @else {
    <bk-spinner />
    <ion-backdrop />
  }
  </ion-content>  
  `
})
export class OwnershipScsBoatsListComponent extends BaseModelListComponent implements OnInit {
  public baseService = inject(ScsBoatsService);

  public BT = BoatTypes;
  public RS = RelationshipStates;
  public FT = FilterType;
  protected boatTags = BoatTags;

  protected listType = ListType.OwnershipClubBoats;
  protected collectionName = CollectionNames.Ownership;
  protected listRoute = '/ownership/scsBoats';

  constructor() {
    super();
    addIcons({addCircleOutline, createOutline, downloadOutline, arrowUpOutline, arrowDownOutline, trashOutline});
  }

  ngOnInit(): void {
    this.prepareData(this.listType);
  }

  public getOwnerships(): RelationshipModel[] {
    return this.baseService.filteredItems() as RelationshipModel[];
  }

  public async addOwnership(): Promise<void> {
    this.appNavigationService.pushLink(this.listRoute);
    this.baseService.navigateToUrl('/ownership/new');
  }

  public async onSelectedIndex(index: number): Promise<void> {
    // export the data in the format selected by the user
    if (index === 0) await export2excel(this.baseService.filteredItems(), ALL_RELATIONSHIP_FIELDS, bkTranslate('@ownership.plural'));
  }

  public editOwnership(slidingItem: IonItemSliding, ownership: RelationshipModel): void {
    if (slidingItem) slidingItem.close();
    this.baseService.editOwnership(ownership);
  }

  public async endOwnership(slidingItem: IonItemSliding, ownership: RelationshipModel): Promise<void> {
    if (slidingItem) slidingItem.close();
      await this.baseService.endOwnership(ownership);
  }

  public async export() {
    this.baseService.export();
  }
}



