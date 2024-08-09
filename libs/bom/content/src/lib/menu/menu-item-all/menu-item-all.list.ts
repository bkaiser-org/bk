import { Component, OnInit, inject } from '@angular/core';
import { MenuItemModel, isMenuItem } from '@bk/models';
import { CollectionNames } from '@bk/util';
import { BkCatComponent, BkSearchbarComponent, BkSpinnerComponent } from '@bk/ui';
import { CategoryNamePipe, IsSortedPipe, SortDirectionPipe, TranslatePipe } from '@bk/pipes';
import { IonBackdrop, IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonMenuButton, IonRow, IonTitle, IonToolbar, ModalController   } from '@ionic/angular/standalone';
import { AsyncPipe } from '@angular/common';
import { BaseModelListComponent } from '@bk/base';
import { MenuItemAllService } from './menu-item-all.service';
import { newMenuItem } from '../menu.util';
import { MenuItemModalComponent } from '../menu-item.modal';
import { ListType, MenuAction, MenuActions } from '@bk/categories';

@Component({
  selector: 'bk-menu-item-all-list',
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
      <ion-title>{{ '@content.menuItem.plural' | translate | async }}</ion-title>
      <ion-buttons slot="end">
        @if(authorizationService.isPrivilegedOr('contentAdmin')) {
          <ion-button (click)="editMenuItem()"><ion-icon slot="icon-only" name="add-circle-outline" /></ion-button>
        }
      </ion-buttons>
    </ion-toolbar>

    <!-- description -->
    <ion-toolbar class="ion-hide-md-down">
      <ion-item lines="none">
        <ion-label>{{ '@content.menuItem.field.description' | translate | async }}</ion-label>
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
            <ion-col size="6" size-md="4">
              <ion-label><strong>{{ '@content.menuItem.list.header.name' | translate | async }}</strong></ion-label>  
            </ion-col>
            <ion-col size="6" size-md="4" class="ion-hide-md-down">
                <ion-label><strong>{{ '@content.menuItem.list.header.link' | translate | async }}</strong></ion-label>
            </ion-col>
            <ion-col size="6" size-md="4">
                <ion-label><strong>{{ '@content.menuItem.list.header.action' | translate | async }}</strong></ion-label>
            </ion-col>
          </ion-row>
        </ion-grid>
      </ion-item>
    </ion-toolbar>
  </ion-header>

  <!-- Data -->
<ion-content #content>
  @if(getMenuItems(); as menuItems) {
    @if (menuItems.length === 0) {
      <ion-toolbar>
      <ion-item>
        <ion-label>{{ '@content.menuItem.field.empty' | translate | async }}</ion-label>
      </ion-item>
    </ion-toolbar>
    } @else {
      @for(menuItem of menuItems; track menuItem.bkey) {
        <ion-item-sliding #slidingItem>
          <ion-item (click)="editMenuItem(slidingItem, menuItem)">
            <ion-label>{{ menuItem.name }}</ion-label>
            @if(menuItem.category === MA.SubMenu) {
              <ion-label class="ion-hide-md-down">{{ menuItem.menuItems }}</ion-label>
            }
            @else {
              <ion-label class="ion-hide-md-down">{{ menuItem.url }}</ion-label>
            }
            <ion-label>{{ menuItem.category | categoryName:menuActions }}</ion-label>
          </ion-item>
          <ion-item-options side="end">
            <ion-item-option color="danger" (click)="deleteMenuItem(slidingItem, menuItem)"><ion-icon slot="icon-only" name="trash" /></ion-item-option>
            <ion-item-option color="primary" (click)="editMenuItem(slidingItem, menuItem)"><ion-icon slot="icon-only" name="create-outline" /></ion-item-option>
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
export class MenuItemAllListComponent extends BaseModelListComponent implements OnInit {
  protected baseService = inject(MenuItemAllService);
  protected listType = ListType.MenuItemAll;
  protected collectionName = CollectionNames.MenuItems;
  protected listRoute = '/menu/all';
  protected modalController = inject(ModalController);

  public menuActions = MenuActions;
  public MA = MenuAction;

  ngOnInit(): void {
    this.prepareData(this.listType);
  }

  public getMenuItems(): MenuItemModel[] {
    return this.baseService.filteredItems() as MenuItemModel[];
  }

  public async editMenuItem(slidingItem?: IonItemSliding, menuItem?: MenuItemModel): Promise<void> {
    if (slidingItem) slidingItem.close();
    let _menuItem = menuItem;
    if (!_menuItem) {
      _menuItem = newMenuItem('', '');
    }
    const _modal = await this.modalController.create({
      component: MenuItemModalComponent,
      componentProps: {
        menuItem: _menuItem
      }
    });
    _modal.present();
    const { data, role } = await _modal.onDidDismiss();
    if (role === 'confirm') {
      if (isMenuItem(data)) {
        await (!menuItem) ? this.baseService.saveNewMenuItem(data) : this.baseService.updateMenuItem(data);
      }
    }
  }
  
  public async deleteMenuItem(slidingItem: IonItemSliding, menuItem: MenuItemModel): Promise<void> {
    slidingItem.close();
    await this.baseService.deleteMenuItem(menuItem);
  }
}



