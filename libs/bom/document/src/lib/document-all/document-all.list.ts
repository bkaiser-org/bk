import { Component, OnInit, inject } from '@angular/core';
import { DocumentModel } from '@bk/models';
import { DocumentTypes, ListType } from '@bk/categories';
import { CollectionNames, DocumentTags } from '@bk/util';
import { Browser } from '@capacitor/browser';
import { BkCatComponent, BkSearchbarComponent, BkSingleTagComponent, BkSpinnerComponent } from '@bk/ui';
import { CategoryAbbreviationPipe, FileLogoPipe, IsSortedPipe, SortDirectionPipe, SvgIconPipe, TranslatePipe } from '@bk/pipes';
import { BaseModelListComponent } from '@bk/base';
import { IonBackdrop, IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonLabel, IonMenuButton, IonProgressBar, IonRow, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { AsyncPipe } from '@angular/common';
import { DocumentAllService } from './document-all.service';

@Component({
  selector: 'bk-document-all-list',
  standalone: true,
  imports: [
    TranslatePipe, AsyncPipe, SvgIconPipe,
    BkSearchbarComponent, BkSingleTagComponent, BkCatComponent, BkSpinnerComponent,
    FileLogoPipe, CategoryAbbreviationPipe, IsSortedPipe, SortDirectionPipe,
    IonToolbar, IonGrid, IonRow, IonCol, IonButton, IonIcon, IonLabel, IonHeader, IonButtons, 
    IonTitle, IonMenuButton, IonContent, IonItem, IonBackdrop, IonProgressBar
  ],
  template: `
  <ion-header>
  <ion-toolbar color="secondary" id="bkheader">
    <ion-buttons slot="start"><ion-menu-button /></ion-buttons>
    <ion-title>{{ baseService.filteredItems().length }} {{ '@document.plural' | translate | async }}</ion-title>
    <ion-buttons slot="end">
      @if(authorizationService.isPrivilegedOr('contentAdmin')) {
        <ion-button (click)="export()">
          <ion-icon slot="icon-only" src="{{'download-outline' | svgIcon }}" />
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
          <bk-single-tag (selectedTag)="onTagSelected($event)" [tags]="documentTags" />
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
        <ion-col size="12" size-sm="8">
          <ion-button (click)="baseService.sort(SF.Name)" fill="clear">
            @if(baseService.currentSortCriteria() | isSorted:SF.Name) {
              <ion-icon color="light" slot="end" src="{{ baseService.currentSortCriteria().direction | sortDirection }}" />
            }
            <ion-label color="light"><strong>{{ '@document.list.header.name' | translate | async }}</strong></ion-label>
          </ion-button>
        </ion-col>
        <ion-col size="2" class="ion-hide-sm-down">
          <ion-button (click)="baseService.sort(SF.Category)" fill="clear">
            @if(baseService.currentSortCriteria() | isSorted:SF.Category) {
              <ion-icon color="light" slot="end" src="{{ baseService.currentSortCriteria().direction | sortDirection }}" />
            }
            <ion-label color="light"><strong>{{ '@document.list.header.type' | translate | async }}</strong></ion-label>
          </ion-button>
        </ion-col>
        <ion-col size="2" class="ion-hide-sm-down">
          <ion-button (click)="baseService.sort(SF.Extension)" fill="clear">
            @if(baseService.currentSortCriteria() | isSorted:SF.Extension) {
              <ion-icon color="light" slot="end" src="{{ baseService.currentSortCriteria().direction | sortDirection }}" />
            }
            <ion-label color="light"><strong>{{ '@document.list.header.extension' | translate | async }}</strong></ion-label>
          </ion-button>
        </ion-col>
      </ion-row>
    </ion-grid>
  </ion-toolbar>
</ion-header>
<ion-content #content>
  @if(getDocuments(); as documents) {
    <ion-grid>
      // don't use 'document' here as it leads to confusions with HTML document
      @for(doc of documents; track doc.bkey) {
        <ion-row (click)="showDocument(doc.url)">
          <ion-col size="12" size-sm="8">
            <ion-item lines="none">
              <ion-icon src="{{ doc.extension | fileLogo }}" />&nbsp;
              <ion-label>{{ doc.name }}</ion-label>
            </ion-item>
          </ion-col>
          <ion-col size="2" class="ion-hide-sm-down">
            <ion-item lines="none">
              <ion-label>{{ doc.category | categoryAbbreviation:DTS }}</ion-label>
            </ion-item>
          </ion-col>
          <ion-col size="2" class="ion-hide-sm-down">
            <ion-item lines="none">
              <ion-label>{{ doc.extension }}</ion-label>
            </ion-item>
          </ion-col>
        </ion-row>
      }
    </ion-grid>
  } @else {
    <bk-spinner />
    <ion-backdrop />
  }
</ion-content>

  `
})
export class DocumentAllListComponent extends BaseModelListComponent implements OnInit {
  public baseService = inject(DocumentAllService);

  public DTS = DocumentTypes;
  protected documentTags = DocumentTags;

  protected listType = ListType.DocumentAll;
  protected collectionName = CollectionNames.Document;
  protected listRoute = '/document/all';

  ngOnInit(): void {
    this.prepareData(this.listType);
  }

  protected getDocuments(): DocumentModel[] {
    return this.baseService.filteredItems() as DocumentModel[];
  }

  public async showDocument(url: string): Promise<void> {
    await Browser.open({ url: url, windowName: '_blank' });
  }

  public async export(): Promise<void> {
    //await this.baseService.export2excel(bkTranslate('@document.plural'), ALL_DOCUMENT_FIELDS);
    console.log('export ist not yet implemented');
  }
}



