import { Component, inject, model, viewChild } from '@angular/core';
import { AddressFormModel, OrgNewFormModel, PersonNewFormModel } from '@bk/models';
import { IonCol, IonContent, IonGrid, IonRow, IonSearchbar, ModalController } from '@ionic/angular/standalone';
import { Observable } from 'rxjs';
import { SwissCityService } from './swiss-cities.service';
import { SwissCity } from './swiss-cites.util';
import { AsyncPipe } from '@angular/common';
import { BkHeaderComponent } from '@bk/ui';
import { TranslatePipe } from '@bk/pipes';

@Component({
  selector: 'bk-swiss-city-select',
  standalone: true,
  imports: [
    TranslatePipe, AsyncPipe, 
    BkHeaderComponent,
    IonContent, IonSearchbar, IonGrid, IonRow, IonCol
  ],
  template: `
      <bk-header title="{{ '@subject.address.operation.search.label' | translate | async }}" [isModal]="true" />
      <ion-content>
        <ion-grid>
          <ion-row>
            <ion-col size="6">
              <ion-searchbar #zipField [debounce]="500" placeholder="{{ '@input.zipCode.placeholder' | translate | async }}" (ionInput)="filterCitiesByZipCode($event.target.value)" />
            </ion-col>
            <ion-col size="6">
              <ion-searchbar [debounce]="500" placeholder="{{ '@input.city.placeholder' | translate | async }}" (ionInput)="filterCitiesByName($event.target.value)" />
            </ion-col>
          </ion-row>
          @for(city of (swissCities$ | async); track city) {
            <ion-row (click)="select(city)">
              <ion-col size="2">{{ city.countryCode }}</ion-col>
              <ion-col size="2">{{ city.zipCode }}</ion-col>
              <ion-col size="6">{{ city.name }}</ion-col>
              <ion-col size="2">{{ city.stateCode }}</ion-col>
            </ion-row>
          }
        </ion-grid>
      </ion-content>
  `
})
export class SwissCitySelectComponent {
  private swissCityService = inject(SwissCityService);
  private modalController = inject(ModalController);

  public vm = model.required<OrgNewFormModel | PersonNewFormModel | AddressFormModel>(); // current view model for editing
  protected zipField = viewChild<IonSearchbar>('zipField');
  public swissCities$!: Observable<SwissCity[]>;   // result of the zipcode search

  ionViewDidEnter(): void {
    this.zipField()?.setFocus();
  }

  public async filterCitiesByZipCode(searchTerm: string | undefined | null): Promise<void> {
    if (!searchTerm ||searchTerm.length === 0) {
      return;
    } else {
        this.swissCities$ = this.swissCityService.filterCitiesByZipCode(parseInt(searchTerm));
    }
  }

  public filterCitiesByName(searchTerm: string | undefined | null): void {
    if (!searchTerm ||searchTerm.length === 0) {
      return;
    } else {
      this.swissCities$ = this.swissCityService.filterCitiesByName(searchTerm);
    }
  }

  private updateAddressFields(city: SwissCity | undefined): void {
    if (this.vm() && city) {
      this.vm().zipCode = (city.zipCode + '');
      this.vm().countryCode = city.countryCode;
      this.vm().city = city.name;  
    }
  }

  public async select(city: SwissCity | undefined): Promise<boolean> {
    this.updateAddressFields(city);
    return await this.modalController.dismiss(city, 'confirm');
  }

  public async cancelModal(): Promise<boolean> {
    return await this.modalController.dismiss(null, 'cancel');
  }
}