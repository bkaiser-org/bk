import { Component, OnInit, inject } from '@angular/core';
import { CollectionNames, InvoicePositionTags, bkTranslate } from '@bk/util';
import { CategoryNamePipe, FullNamePipe, IsSortedPipe, SortDirectionPipe, TranslatePipe } from '@bk/pipes';
import { BkAvatarLabelComponent, BkSearchbarComponent, BkSingleTagComponent, BkSpinnerComponent } from '@bk/ui';
import { InvoicePositionModel } from '@bk/models';
import { BaseModelListComponent } from '@bk/base';
import { IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonLabel, IonMenuButton, IonRow, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { AsyncPipe } from '@angular/common';
import { InvoicePositionTypes, ListType } from '@bk/categories';
import { InvoicePositionAllService } from './invoice-position-all.service';
import { addIcons } from "ionicons";
import { addCircleOutline, downloadOutline, arrowUpOutline, arrowDownOutline } from "ionicons/icons";

@Component({
  selector: 'bk-invoice-position-all-list',
  standalone: true,
  imports: [
    BkSearchbarComponent, BkSingleTagComponent, BkSpinnerComponent, BkAvatarLabelComponent,
    FullNamePipe, IsSortedPipe, SortDirectionPipe, TranslatePipe, AsyncPipe, CategoryNamePipe,
    IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonIcon, IonMenuButton,
    IonGrid, IonRow, IonCol, IonLabel, IonContent, IonItem
  ],
  template: `
  <ion-header>
    <ion-toolbar color="secondary" id="bkheader">
      <ion-buttons slot="start"><ion-menu-button></ion-menu-button></ion-buttons>
      <ion-title>{{baseService.filteredItems().length }} {{ '@finance.invoicePosition.plural' | translate | async }}</ion-title>
      <ion-buttons slot="end">
        @if(authorizationService.hasRole('treasurer')) {
          <ion-button (click)="add()">
            <ion-icon slot="icon-only" name="add-circle-outline" />
          </ion-button>
        }
        @if(authorizationService.isPrivilegedOr('treasurer')) {
          <ion-button (click)="export()">
            <ion-icon slot="icon-only" name="download-outline" />
          </ion-button>
        }
      </ion-buttons>
  </ion-toolbar>
    <ion-toolbar>
      <ion-grid>
        <ion-row class="ion-hide-md-down">
          <ion-col size="12" size-md="6">
            <bk-searchbar placeholder="{{ '@general.operation.search.placeholder' | translate | async }}"  (ionInput)="baseService.onSearchtermChange($event)" />
          </ion-col>
          <ion-col size="6" size-md="3">
            <bk-single-tag (selectedTag)="onTagSelected($event)" [tags]="invoicePositionTags" />
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
              <ion-label color="light"><strong>{{ '@finance.invoicePosition.list.header.name' | translate | async }}</strong></ion-label>
            </ion-button>
          </ion-col>
          <ion-col size="3">
            <ion-button (click)="baseService.sort(SF.Year)" fill="clear">
              @if(baseService.currentSortCriteria() | isSorted:SF.Year) {
                <ion-icon color="light" slot="end" name="{{ baseService.currentSortCriteria().direction | sortDirection }}" />
              }
              <ion-label color="light"><strong>{{'@finance.invoicePosition.list.header.year' | translate | async }}</strong></ion-label>
            </ion-button>
          </ion-col>
          <ion-col size="3">
            <ion-button (click)="baseService.sort(SF.Amount)" fill="clear">
              @if(baseService.currentSortCriteria() | isSorted:SF.Amount) {
                <ion-icon color="light" slot="end" name="{{ baseService.currentSortCriteria().direction | sortDirection }}" />
              }
              <ion-label color="light"><strong>{{'@finance.invoicePosition.list.header.amount' | translate | async }}</strong></ion-label>
            </ion-button>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-toolbar>
  </ion-header>
  <ion-content #content>
      @if(getInvoicePositions(); as invoicePositions) {
        <ion-grid>
          @for(invoicePosition of invoicePositions; track invoicePosition.bkey) {
            <ion-row>
              <ion-col size="6" (click)="edit(invoicePosition.bkey!)">
                <ion-item lines="none">
                  <bk-avatar-label key="{{'0.' + invoicePosition.personKey}}" label="{{invoicePosition.firstName | fullName:invoicePosition.name}}" />
                </ion-item>
              </ion-col>
              <ion-col size="3">
                <ion-item lines="none">
                  <ion-label>{{ invoicePosition.category | categoryName:invoicePositionTypes }}</ion-label>
                </ion-item>
              </ion-col>
              <ion-col size="3">
                  <ion-item lines="none">
                    <ion-label>{{ invoicePosition.amount }}</ion-label>
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
export class InvoicePositionAllListComponent extends BaseModelListComponent implements OnInit {
  protected baseService = inject(InvoicePositionAllService);

  protected listType = ListType.InvoicePositionAll;
  protected collectionName = CollectionNames.InvoicePosition;
  protected listRoute = '/invoicePosition/all';
  protected invoicePositionTags = InvoicePositionTags;
  protected invoicePositionTypes = InvoicePositionTypes;

  constructor() {
    super();
    addIcons({addCircleOutline, downloadOutline, arrowUpOutline, arrowDownOutline});
  }

  ngOnInit(): void {
    this.prepareData(this.listType);
  }

  protected getInvoicePositions(): InvoicePositionModel[] {
    return this.baseService.filteredItems() as InvoicePositionModel[];
  }

  public async export(): Promise<void> {
   // await this.baseService.export2excel(bkTranslate('@finance.invoicePosition.plural'), ALL_INVOICE_POSITION_FIELDS);
   console.log('export is not yet implemented');
  }
}



