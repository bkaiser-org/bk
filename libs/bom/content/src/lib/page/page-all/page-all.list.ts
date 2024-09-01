import { Component, OnInit, inject } from '@angular/core';
import { PageModel } from '@bk/models';
import { CollectionNames, bkPrompt } from '@bk/util';
import { BkCatComponent, BkSearchbarComponent, BkSpinnerComponent } from '@bk/ui';
import { TranslatePipe } from '@bk/pipes';
import { AlertController, IonBackdrop, IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonMenuButton, IonRow, IonTitle, IonToolbar   } from '@ionic/angular/standalone';
import { AsyncPipe } from '@angular/common';
import { ListType, ModelType } from '@bk/categories';
import { BaseModelListComponent } from '@bk/base';
import { PageAllService } from './page-all.service';
import { addIcons } from "ionicons";
import { addCircleOutline, createOutline, trash } from "ionicons/icons";

@Component({
  selector: 'bk-page-all-list',
  standalone: true,
  imports: [
    TranslatePipe, AsyncPipe, 
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
      <ion-title>{{ '@content.page.plural' | translate | async }}</ion-title>
      <ion-buttons slot="end">
        @if(authorizationService.isPrivilegedOr('contentAdmin')) {
          <ion-button (click)="addPage()"><ion-icon slot="icon-only" name="add-circle-outline" /></ion-button>
        }
      </ion-buttons>
    </ion-toolbar>

    <!-- description -->
    <ion-toolbar class="ion-hide-md-down">
      <ion-item lines="none">
        <ion-label>{{ '@content.page.field.description' | translate | async }}</ion-label>
      </ion-item>
    </ion-toolbar>

   <!-- search and category -->
    <ion-toolbar>
      <ion-grid>
        <ion-row>
          <ion-col size="12">
            <bk-searchbar placeholder="{{ '@general.operation.search.placeholder' | translate | async }}" (ionInput)="baseService.onSearchtermChange($event)" />
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-toolbar>

    <!-- list header -->
    <ion-toolbar color="primary">
      <ion-item color="primary" lines="none">
        <ion-grid>
          <ion-row>
            <ion-col size="4" class="ion-hide-md-down">
              <ion-label><strong>{{ '@content.page.list.header.key' | translate | async }}</strong></ion-label>  
            </ion-col>
            <ion-col size="6" size-md="4">
              <ion-label><strong>{{ '@content.page.list.header.name' | translate | async }}</strong></ion-label>  
            </ion-col>
            <ion-col size="6" size-md="4">
                <ion-label><strong>{{ '@content.page.list.header.sections' | translate | async }}</strong></ion-label>
            </ion-col>
          </ion-row>
        </ion-grid>
      </ion-item>
    </ion-toolbar>
  </ion-header>
<ion-content #content>
  @if(getPages(); as pages) {
    @if (pages.length === 0) {
      <ion-toolbar>
      <ion-item>
        <ion-label>{{ '@content.page.field.empty' | translate | async }}</ion-label>
      </ion-item>
    </ion-toolbar>
    } @else {
      @for(page of pages; track page.bkey) {
        <ion-item-sliding #slidingItem>
          <ion-item (click)="openPage(slidingItem, page.bkey)">
            <ion-label class="ion-hide-md-down">{{ page.bkey }}</ion-label>
            <ion-label>{{ page.name }}</ion-label>
            <ion-label>{{ page.sections.length }}</ion-label>
          </ion-item>
          <ion-item-options side="end">
            <ion-item-option color="danger" (click)="deletePage(slidingItem, page)"><ion-icon slot="icon-only" name="trash" /></ion-item-option>
            <ion-item-option color="primary" (click)="openPage(slidingItem, page.bkey)"><ion-icon slot="icon-only" name="create-outline" /></ion-item-option>
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
export class PageAllListComponent extends BaseModelListComponent implements OnInit {
  public baseService = inject(PageAllService);
  protected listType = ListType.PageAll;
  protected collectionName = CollectionNames.Page;
  protected listRoute = '/page/all';
  private alertController = inject(AlertController);

  constructor() {
    super();
    addIcons({ addCircleOutline, createOutline, trash});
  }

  ngOnInit(): void {
    this.prepareData(this.listType);
  }

  public getPages(): PageModel[] {
    return this.baseService.filteredItems() as PageModel[];
  }

  public async addPage(): Promise<void> {
    const _pageName = await bkPrompt(this.alertController, '@content.page.operation.add.label', '@content.page.field.name');
    if (_pageName) {
      const _page = new PageModel();
      _page.name = _pageName;
      _page.modelType = ModelType.Page;
      _page.index = this.baseService.getSearchIndex(_page);
      await this.baseService.createPage(_page);
    }
  }
  
  public async deletePage(slidingItem: IonItemSliding, page: PageModel): Promise<void> {
    slidingItem.close();
    await this.baseService.deletePage(page);
  }

  public async openPage(slidingItem?: IonItemSliding, key?: string): Promise<void> {
    if (slidingItem) slidingItem.close();
    if (!key) return;
    this.appNavigationService.pushLink(this.listRoute);
    await this.baseService.navigateToUrl(`/private/${key}`);
  }
}



