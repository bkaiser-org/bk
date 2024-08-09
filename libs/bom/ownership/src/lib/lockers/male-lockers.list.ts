import { Component, OnInit, inject } from '@angular/core';
import { ALL_RELATIONSHIP_FIELDS, RelationshipModel } from '@bk/models';
import { BoatTypes, FilterType, ListType, RelationshipStates } from '@bk/categories';
import { CollectionNames, ResourceTags, bkTranslate } from '@bk/util';
import { export2excel } from '@bk/core';
import { AvatarPipe, BkAvatarLabelComponent, BkCatComponent, BkLabelSelectModalComponent, BkSearchbarComponent, BkSingleTagComponent, BkSpinnerComponent } from '@bk/ui';
import { CategoryNamePipe, FullNamePipe, IsSortedPipe, SortDirectionPipe, TranslatePipe } from '@bk/pipes';
import { BaseModelListComponent } from '@bk/base';
import { IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonLabel, IonMenuButton, IonRow, IonTitle, IonToolbar ,IonBackdrop, IonItemSliding, IonItemOptions, IonItemOption, IonAvatar, IonImg } from '@ionic/angular/standalone';
import { AsyncPipe } from '@angular/common';
import { MaleLockersService } from './male-lockers.service';

@Component({
  selector: 'bk-ownership-male-locker-list',
  standalone: true,
  imports: [ 
    BkSearchbarComponent, BkSpinnerComponent,BkLabelSelectModalComponent,
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
          <ion-button (click)="addOwnership()"><ion-icon slot="icon-only" name="add-circle-outline" /></ion-button>
        }
        @if(authorizationService.isPrivilegedOr('resourceAdmin')) {
          <ion-button (click)="export()"><ion-icon slot="icon-only" name="download-outline" /></ion-button>
        }
      </ion-buttons>
    </ion-toolbar>
    <ion-toolbar>
      <ion-grid>
        <ion-row>
          <ion-col size="6">
            <bk-searchbar placeholder="{{ '@general.operation.search.placeholder' | translate | async  }}"  (ionInput)="baseService.onSearchtermChange($event)" />
          </ion-col>
          <ion-col size="6">
            <bk-single-tag (selectedTag)="onTagSelected($event)" [tags]="resourceTags" />
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-toolbar>
      <ion-toolbar color="primary">
      <ion-grid>
        <ion-row>
          <ion-col size="6">
            <ion-button (click)="baseService.sort(SF.SubjectName)" fill="clear">
              @if(baseService.currentSortCriteria() | isSorted:SF.SubjectName) {
                <ion-icon color="light" slot="end" name="{{ baseService.currentSortCriteria().direction | sortDirection }}" />
              }
              <ion-label color="light"><strong>{{ '@subject.list.header.name' | translate | async }}</strong></ion-label>
            </ion-button>
          </ion-col>
          <ion-col size="6">
            <ion-button (click)="baseService.sort(SF.ObjectName)" fill="clear">
              @if(baseService.currentSortCriteria() | isSorted:SF.ObjectName) {
                <ion-icon color="light" slot="end" name="{{ baseService.currentSortCriteria().direction | sortDirection }}" />
              }
              <ion-label color="light"><strong>{{ '@input.lockerNr.label' | translate | async }}</strong></ion-label>
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
          <ion-item>
            <ion-avatar slot="start" (click)="edit(_ownership.subjectKey, _ownership.subjectType)">
              <ion-img src="{{_ownership.subjectType + '.' + _ownership.subjectKey | avatar | async}}" alt="Avatar Logo" />
            </ion-avatar>
            <ion-label (click)="edit(_ownership.subjectKey, _ownership.subjectType)">{{_ownership.subjectName | fullName:_ownership.subjectName2}}</ion-label>
            <ion-label (click)="edit(_ownership.objectKey, MT.Resource)">{{ _ownership.objectName }}</ion-label>
          </ion-item>
          @if(authorizationService.hasRole('resourceAdmin')) {
            <ion-item-options side="end">
              <ion-item-option color="danger" (click)="endOwnership(slidingItem, _ownership)"><ion-icon slot="icon-only" name="trash-outline" /></ion-item-option>
              <ion-item-option color="primary" (click)="editOwnership(slidingItem, _ownership)"><ion-icon slot="icon-only" name="create-outline" /></ion-item-option>
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
export class OwnershipMaleLockerListComponent extends BaseModelListComponent implements OnInit {
  public baseService = inject(MaleLockersService);

  public BT = BoatTypes;
  public RS = RelationshipStates;
  public FT = FilterType;
  protected resourceTags = ResourceTags;

  protected listType = ListType.OwnershipMaleLockers;
  protected collectionName = CollectionNames.Ownership;
  protected listRoute = '/ownership/maleLockers';

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
    if (index === 1) await this.baseService.exportLockers();
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



