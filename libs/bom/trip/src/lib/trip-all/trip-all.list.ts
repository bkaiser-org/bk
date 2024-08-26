import { Component, OnInit, inject } from '@angular/core';
import { TripModel, isTrip } from '@bk/models';
import { CollectionNames } from '@bk/util';
import { BkSearchbarComponent, BkSpinnerComponent, BkYearSelectComponent } from '@bk/ui';
import { CategoryNamePipe, IsSortedPipe, SortDirectionPipe, TranslatePipe } from '@bk/pipes';
import { IonBackdrop, IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonMenuButton, IonRow, IonTitle, IonToolbar, ModalController   } from '@ionic/angular/standalone';
import { AsyncPipe } from '@angular/common';
import { BaseModelListComponent } from '@bk/base';
import { ListType } from '@bk/categories';
import { TripAllService } from './trip-all.service';
import { TripModalComponent } from '../trip.modal';
import { addIcons } from "ionicons";
import { addCircleOutline, createOutline, trash } from "ionicons/icons";

@Component({
  selector: 'bk-trip-all-list',
  standalone: true,
  imports: [
    TranslatePipe, AsyncPipe, CategoryNamePipe, IsSortedPipe, SortDirectionPipe,
    BkSearchbarComponent, BkYearSelectComponent, BkSpinnerComponent,
    IonToolbar, IonButton, IonIcon, IonLabel, IonHeader, IonButtons, 
    IonTitle, IonMenuButton, IonContent, IonItem, IonBackdrop,
    IonItemSliding, IonItemOptions, IonItemOption,
    IonGrid, IonRow, IonCol
  ],
  template: `
  <ion-header>
      <!-- page header -->
    <ion-toolbar color="secondary" id="bkheader">
      <ion-buttons slot="start"><ion-menu-button></ion-menu-button></ion-buttons>
      <ion-title>{{ '@trip.plural' | translate | async }}</ion-title>
      <ion-buttons slot="end">
        @if(authorizationService.isPrivilegedOr('admin')) {
          <ion-button (click)="editTrip()">
            <ion-icon slot="icon-only" name="add-circle-outline" />
          </ion-button>
        }
      </ion-buttons>
    </ion-toolbar>

    <!-- description -->
    <ion-toolbar class="ion-hide-md-down">
      <ion-item lines="none">
        <ion-label>{{ '@trip.description' | translate | async }}</ion-label>
      </ion-item>
    </ion-toolbar>

    <!-- search and category -->
    <ion-toolbar>
      <ion-grid>
        <ion-row>
          <ion-col size="6">
            <bk-searchbar placeholder="{{ '@general.operation.search.placeholder' | translate | async }}" (ionInput)="baseService.onSearchtermChange($event)" />
          </ion-col>
          <ion-col size="6">
          <bk-year-select [config]="baseService.yearConfig()!" (ionChange)="onYearChange($event)" />     
         </ion-col>
        </ion-row>
      </ion-grid>
    </ion-toolbar>

    <!-- list header -->
    <ion-toolbar color="primary">
      <ion-item color="primary" lines="none">
        <ion-grid>
          <ion-row>
            <ion-col size="4">
              <ion-label><strong>{{ '@trip.list.header.startDateTime' | translate | async }}</strong></ion-label>  
            </ion-col>
            <ion-col size="6">
                <ion-label><strong>{{ '@trip.list.header.name' | translate | async }}</strong></ion-label>
            </ion-col>
            <ion-col size="2">
                <ion-label><strong>{{ '@trip.list.header.resource' | translate | async }}</strong></ion-label>
            </ion-col>
          </ion-row>
        </ion-grid>
      </ion-item>
    </ion-toolbar>
  </ion-header>

  <!-- Data -->
<ion-content #content>
  @if(getTrips(); as trips) {
    @if (trips.length === 0) {
      <ion-toolbar>
      <ion-item>
        <ion-label>{{ '@trip.field.empty' | translate | async }}</ion-label>
      </ion-item>
    </ion-toolbar>
    } @else {
      @for(trip of trips; track trip.bkey) {
        <ion-item-sliding #slidingItem>
          <ion-item (click)="editTrip(slidingItem, trip)">
            <ion-label>{{ trip.startDateTime }}</ion-label>
            <ion-label>{{ trip.name }}</ion-label>
            <ion-label>{{ trip.resourceKey }}</ion-label>
          </ion-item>
          <ion-item-options side="end">
            <ion-item-option color="danger" (click)="deleteTrip(slidingItem, trip)">
              <ion-icon slot="icon-only" name="trash" />
            </ion-item-option>
            <ion-item-option color="primary" (click)="editTrip(slidingItem, trip)">
              <ion-icon slot="icon-only" name="create-outline" />
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
export class TripAllListComponent extends BaseModelListComponent implements OnInit {
  protected baseService = inject(TripAllService);
  protected listType = ListType.TripAll;
  protected collectionName = CollectionNames.Trip;
  protected listRoute = '/trip/all';
  protected modalController = inject(ModalController);

  constructor() {
    super();
    addIcons({addCircleOutline, createOutline, trash});
  }

  ngOnInit(): void {
    this.prepareData(this.listType);
  }

  public getTrips(): TripModel[] {
    return this.baseService.filteredItems() as TripModel[];
  }

  public async editTrip(slidingItem?: IonItemSliding, trip?: TripModel): Promise<void> {
    if (slidingItem) slidingItem.close();
    let _trip = trip;
    if (!_trip) {
      _trip = new TripModel();
    }
    const _modal = await this.modalController.create({
      component: TripModalComponent,
      componentProps: {
        trip: _trip
      }
    });
    _modal.present();
    const { data, role } = await _modal.onDidDismiss();
    if (role === 'confirm') {
      if (isTrip(data)) {
        await (!trip) ? this.baseService.createTrip(data) : this.baseService.updateTrip(data);
      }
    }
  }
  
  public async deleteTrip(slidingItem: IonItemSliding, trip: TripModel): Promise<void> {
    slidingItem.close();
    await this.baseService.deleteTrip(trip);
  }
}



