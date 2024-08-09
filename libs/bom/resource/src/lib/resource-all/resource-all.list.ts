import { Component, OnInit, inject } from '@angular/core';
import { BoatTypes, ListType } from '@bk/categories';
import { CollectionNames, ResourceTags, bkTranslate } from '@bk/util';
import { ALL_RESOURCE_FIELDS, ResourceModel } from '@bk/models';
import { BkAvatarLabelComponent, BkCatComponent, BkSearchbarComponent, BkSingleTagComponent, BkSpinnerComponent } from '@bk/ui';
import { CategoryNamePipe, IsSortedPipe, SortDirectionPipe, TranslatePipe } from '@bk/pipes';
import { ResourceLogoPipe } from '../resource-logo.pipe';
import { IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonLabel, IonMenuButton, IonRow, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { AsyncPipe } from '@angular/common';
import { BaseModelListComponent } from '@bk/base';
import { ResourceAllService } from './resource-all.service';

@Component({
  selector: 'bk-resource-all-list',
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
          <bk-single-tag (selectedTag)="onTagSelected($event)" [tags]="resourceTags" />
        </ion-col>
        <ion-col size="6" size-md="3">
          <bk-cat [config]="baseService.categoryConfig()!" (ionChange)="onCategoryChange($event)" />
        </ion-col>
      </ion-row>
    </ion-grid>
  </ion-toolbar>
  <ion-toolbar color="primary">
    <ion-item color="primary" lines="none">
      <ion-label><strong>{{ '@input.name.label' | translate | async }}</strong></ion-label>
      <ion-label><strong>{{ '@input.value.label' | translate | async }}</strong></ion-label>
      <ion-label class="ion-hide-md-down"><strong>{{ '@general.util.description' | translate | async }}</strong></ion-label>
    </ion-item>
  </ion-toolbar>
</ion-header>
<ion-content #content>
  @if(getResources(); as resources) {
    @for(resource of resources; track resource.bkey) {
      <ion-item class="ion-text-wrap" (click)="edit(resource.bkey!)">
        <ion-icon name="{{ resource?.category! | resourceLogo }}" slot="start" />
        <ion-label>{{ resource?.name }}</ion-label>
        <ion-label>{{ resource?.currentValue }}</ion-label>
        <ion-label>{{ resource?.description }}</ion-label>
      </ion-item>
    }
  } @else {
    <bk-spinner />
  }
</ion-content>
  `
})
export class ResourceAllListComponent extends BaseModelListComponent implements OnInit {
  protected baseService = inject(ResourceAllService);

  public BT = BoatTypes;
  protected listType = ListType.ResourceAll;
  protected collectionName = CollectionNames.Resource;
  protected listRoute = '/resource/all';
  protected resourceTags = ResourceTags;

  ngOnInit(): void {
    this.prepareData(this.listType);
  }

  public getResources(): ResourceModel[] {
    return this.baseService.filteredItems() as ResourceModel[];
  }

  public async export(): Promise<void> {
    await this.baseService.export2excel(bkTranslate('@resource.plural'), ALL_RESOURCE_FIELDS);
  }
}

