import { Component, OnInit, inject } from '@angular/core';
import { CollectionNames } from '@bk/util';
import { BkCatComponent, BkSearchbarComponent, BkSpinnerComponent } from '@bk/ui';
import { CategoryNamePipe, IsSortedPipe, SortDirectionPipe, TranslatePipe } from '@bk/pipes';
import { IonBackdrop, IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonMenuButton, IonRow, IonTitle, IonToolbar, ModalController   } from '@ionic/angular/standalone';
import { AsyncPipe } from '@angular/common';
import { BaseModelListComponent } from '@bk/base';
import { ListType, LocationTypes } from '@bk/categories';
import { LocationAllService } from './location-all.service';
import { LocationModel, isLocation } from '@bk/models';
import { LocationModalComponent } from '../location.modal';

@Component({
  selector: 'bk-location-all-list',
  standalone: true,
  imports: [
    TranslatePipe, AsyncPipe, CategoryNamePipe, IsSortedPipe, SortDirectionPipe,
    BkSearchbarComponent, BkCatComponent, BkSpinnerComponent,
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
      <ion-title>{{ '@location.plural' | translate | async }}</ion-title>
      <ion-buttons slot="end">
        @if(authorizationService.isPrivilegedOr('admin')) {
          <ion-button (click)="editLocation()"><ion-icon slot="icon-only" name="add-circle-outline" /></ion-button>
        }
      </ion-buttons>
    </ion-toolbar>

    <!-- description -->
    <ion-toolbar class="ion-hide-md-down">
      <ion-item lines="none">
        <ion-label>{{ '@location.description' | translate | async }}</ion-label>
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
            <bk-cat [config]="baseService.categoryConfig()!" (ionChange)="onCategoryChange($event)" />
         </ion-col>
        </ion-row>
      </ion-grid>
    </ion-toolbar>

    <!-- list header -->
    <ion-toolbar color="primary">
      <ion-item color="primary" lines="none">
        <ion-grid>
          <ion-row>
            <ion-col size="8">
              <ion-label><strong>{{ '@location.list.header.name' | translate | async }}</strong></ion-label>  
            </ion-col>
            <ion-col size="4">
                <ion-label><strong>{{ '@location.list.header.locationType' | translate | async }}</strong></ion-label>
            </ion-col>
          </ion-row>
        </ion-grid>
      </ion-item>
    </ion-toolbar>
  </ion-header>

  <!-- Data -->
<ion-content #content>
  @if(getLocations(); as locations) {
    @if (locations.length === 0) {
      <ion-toolbar>
      <ion-item>
        <ion-label>{{ '@location.field.empty' | translate | async }}</ion-label>
      </ion-item>
    </ion-toolbar>
    } @else {
      @for(location of locations; track location.bkey) {
        <ion-item-sliding #slidingItem>
          <ion-item (click)="editLocation(slidingItem, location)">
            <ion-label>{{ location.name }}</ion-label>
            <ion-label>{{ location.category | categoryName:locationTypes }}</ion-label>
          </ion-item>
          <ion-item-options side="end">
            <ion-item-option color="danger" (click)="deleteLocation(slidingItem, location)"><ion-icon slot="icon-only" name="trash" /></ion-item-option>
            <ion-item-option color="primary" (click)="editLocation(slidingItem, location)"><ion-icon slot="icon-only" name="create-outline" /></ion-item-option>
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
export class LocationAllListComponent extends BaseModelListComponent implements OnInit {
  protected baseService = inject(LocationAllService);
  protected listType = ListType.LocationAll;
  protected collectionName = CollectionNames.Location;
  protected listRoute = '/location/all';
  protected modalController = inject(ModalController);

  protected locationTypes = LocationTypes;

  ngOnInit(): void {
    this.prepareData(this.listType);
  }

  public getLocations(): LocationModel[] {
    return this.baseService.filteredItems() as LocationModel[];
  }

  public async editLocation(slidingItem?: IonItemSliding, location?: LocationModel): Promise<void> {
    if (slidingItem) slidingItem.close();
    let _location = location;
    if (!_location) {
      _location = new LocationModel();
    }
    const _modal = await this.modalController.create({
      component: LocationModalComponent,
      componentProps: {
        location: _location
      }
    });
    _modal.present();
    const { data, role } = await _modal.onDidDismiss();
    if (role === 'confirm') {
      if (isLocation(data)) {
        await (!location) ? this.baseService.createLocation(data) : this.baseService.updateLocation(data);
      }
    }
  }
  
  public async deleteLocation(slidingItem: IonItemSliding, location: LocationModel): Promise<void> {
    slidingItem.close();
    await this.baseService.deleteLocation(location);
  }
}



