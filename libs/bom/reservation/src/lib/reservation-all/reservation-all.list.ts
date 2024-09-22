import { Component, OnInit, inject } from '@angular/core';
import { RelationshipModel } from '@bk/models';
import { FilterType, ListType, RelationshipStates } from '@bk/categories';
import { CollectionNames, ReservationTags } from '@bk/util';
import { AvatarPipe, BkCatComponent, BkSearchbarComponent, BkSingleTagComponent, BkSpinnerComponent, BkYearSelectComponent } from '@bk/ui';
import { CategoryNamePipe, FullNamePipe, IsSortedPipe, PrettyDatePipe, SortDirectionPipe, SvgIconPipe, TranslatePipe } from '@bk/pipes';
import { BaseModelListComponent } from '@bk/base';
import { IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonLabel, IonMenuButton, IonRow, IonTitle, IonToolbar ,IonBackdrop, IonItemSliding, IonItemOptions, IonItemOption, IonAvatar, IonImg } from '@ionic/angular/standalone';
import { AsyncPipe } from '@angular/common';
import { ReservationAllService } from './reservation-all.service';

@Component({
  selector: 'bk-reservation-all-list',
  styles: `
    ion-backdrop {
    opacity: 0.5;
    background: var(--ion-color-dark);
  }
  .center {
    position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  }
  #processingSpinner {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  `,
  standalone: true,
  imports: [ 
    BkSearchbarComponent, BkSpinnerComponent, BkYearSelectComponent,
    BkSingleTagComponent, BkCatComponent,
    TranslatePipe, CategoryNamePipe, FullNamePipe, IsSortedPipe, SortDirectionPipe, AsyncPipe, PrettyDatePipe, AvatarPipe, SvgIconPipe,
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
        <ion-button (click)="addReservation()">
          <ion-icon slot="icon-only" src="{{'add-circle-outline' | svgIcon }}" />
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
          <bk-single-tag (selectedTag)="onTagSelected($event)" [tags]="reservationTags" />
        </ion-col>
        <ion-col size="6" size="3">
          @if(baseService.filterType() === FT.Category) {
            <bk-cat [config]="baseService.categoryConfig()!" (ionChange)="onCategoryChange($event)" />
          }
          @if(baseService.filterType() === FT.Year) {
            <bk-year-select [config]="baseService.yearConfig()!" (ionChange)="onYearChange($event)" />
          }
        </ion-col>
      </ion-row>
    </ion-grid>
  </ion-toolbar>

    <!-- List Header -->
    <ion-toolbar color="primary">
      <ion-item color="primary">
        <ion-button (click)="baseService.sort(SF.SubjectName)" fill="clear" slot="start">
          @if(baseService.currentSortCriteria() | isSorted:SF.SubjectName) {
            <ion-icon color="light" slot="end" src="{{ baseService.currentSortCriteria().direction | sortDirection }}" />
          }
          <ion-label color="light"><strong>{{ '@reservation.list.header.name' | translate | async }}</strong></ion-label>
        </ion-button>
        <ion-button (click)="baseService.sort(SF.ObjectName)" fill="clear" class="center ion-hide-md-down">
          @if(baseService.currentSortCriteria() | isSorted:SF.ObjectName) {
            <ion-icon color="light" slot="end" src="{{ baseService.currentSortCriteria().direction | sortDirection }}" />
          }
          <ion-label color="light"><strong>{{ '@reservation.list.header.resource' | translate | async }}</strong></ion-label>
        </ion-button>
        <ion-button (click)="baseService.sort(SF.ValidFrom)" fill="clear" slot="end">
          @if(baseService.currentSortCriteria() | isSorted:SF.ObjectName) {
            <ion-icon color="light" slot="end" src="{{ baseService.currentSortCriteria().direction | sortDirection }}" />
          }
          <ion-label color="light"><strong>{{ '@reservation.list.header.validFrom' | translate | async }}</strong></ion-label>
        </ion-button>
      </ion-item>
    </ion-toolbar>
  </ion-header>

  <!-- List Data -->
  <ion-content #content>
  @if(getReservations(); as reservations) {
    @if(reservations.length === 0) {
      <ion-item>
        <ion-label>No Data</ion-label>
      </ion-item>
    } @else {
      @for(_reservation of reservations; track _reservation.bkey) {
        <ion-item-sliding #slidingItem>
          <ion-item>
            <ion-avatar slot="start" (click)="edit(_reservation.subjectKey, _reservation.subjectType)">
              <ion-img src="{{_reservation.subjectType + '.' + _reservation.subjectKey | avatar | async}}" alt="Avatar Logo" />
            </ion-avatar>
            <ion-label (click)="edit(_reservation.subjectKey, _reservation.subjectType)">{{_reservation.subjectName | fullName:_reservation.subjectName2}}</ion-label>
            <ion-label class="ion-hide-md-down ion-text-center" (click)="edit(_reservation.objectKey, MT.Resource)">{{ _reservation.objectName }}</ion-label>
            <ion-label class="ion-text-right">{{ _reservation.validFrom | prettyDate }}</ion-label>
          </ion-item>
          <ion-item-options side="end">
            <ion-item-option color="danger" (click)="endReservation(slidingItem, _reservation)">
              <ion-icon slot="icon-only" src="{{'trash-outline' | svgIcon }}" />
            </ion-item-option>
            <ion-item-option color="primary" (click)="editReservation(slidingItem, _reservation)">
              <ion-icon slot="icon-only" src="{{'create-outline' | svgIcon }}" />
            </ion-item-option>
          </ion-item-options>
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
export class ReservationAllListComponent extends BaseModelListComponent implements OnInit {
  public baseService = inject(ReservationAllService);

  public RS = RelationshipStates;
  public FT = FilterType;
  protected reservationTags = ReservationTags;

  protected listType = ListType.ReservationAll;
  protected collectionName = CollectionNames.Reservation;
  protected listRoute = '/reservation/all';

  ngOnInit(): void {
    this.prepareData(this.listType);
  }

  public getReservations(): RelationshipModel[] {
    return this.baseService.filteredItems() as RelationshipModel[];
  }

  public async addReservation(): Promise<void> {
    await this.baseService.createNewReservation();
  }

  public async editReservation(slidingItem: IonItemSliding, reservation: RelationshipModel): Promise<void> {
    if (slidingItem) slidingItem.close();
    await this.baseService.editReservation(reservation);
  }

  public async endReservation(slidingItem: IonItemSliding, reservation: RelationshipModel): Promise<void> {
    if (slidingItem) slidingItem.close();
    await this.baseService.endReservation(reservation);
  }
}



