import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CollectionNames, die, warn } from "@bk/util";
import { BaseService } from "@bk/base";
import { MenuItemModel } from "@bk/models";
import { getMenuItemSearchIndex, getMenuItemSearchIndexInfo } from "./menu.util";

@Injectable({
    providedIn: 'root'
})
export class MenuItemService extends BaseService {

  /*-------------------------- CRUD operations --------------------------------*/
  /**
   * Create a new menuitem in the database.
   * @param menuitem the MenuItemModel to store in the database
   * @returns the document id of the newly created menuitem
   */
  public async createMenuItem(menuItem: MenuItemModel): Promise<string> {
    menuItem.index = getMenuItemSearchIndex(menuItem);
    const _key = await this.dataService.createModel(CollectionNames.MenuItems, menuItem, '@content.menuItem.operation.create');
    await this.saveComment(CollectionNames.MenuItems, _key, '@comment.operation.initial.conf');
    return _key;
  }

  /**
   * Create and save a new menuItem into the database.
   * @param menuItem the MenuItem to store in the database
   */
    public async saveNewMenuItem(menuItem: MenuItemModel): Promise<void> {
      if (!menuItem) {
        warn('MenuItemService.saveNewMenuItem: menuItem is mandatory.');
        return;
      }
      menuItem.index = getMenuItemSearchIndex(menuItem);
      await this.dataService.createModel(`${CollectionNames.MenuItems}`, menuItem, '@content.menuItem.operation.create');
    }

  /**
   * Lookup a menuitem in the database by its document id and return it as an Observable.
   * @param key the document id of the menuitem
   * @returns an Observable of the MenuItemModel
   */
  public readMenuItem(key: string): Observable<MenuItemModel> {
    return this.dataService.readModel(CollectionNames.MenuItems, key) as Observable<MenuItemModel>;
  }

  public async loadMenuItems(keys: string[]): Promise<MenuItemModel[]> {
    return await this.dataService.readModels(CollectionNames.MenuItems, keys) as MenuItemModel[];
  }

  /**
   * Update a menuitem in the database with new values.
   * @param menuItem the MenuItemModel with the new values. Its key must be valid (in order to find it in the database)
   */
  public async updateMenuItem(menuItem: MenuItemModel): Promise<void> {
    if (!menuItem?.bkey?.length) die('MenuItemService.updateMenuItem: bkey is mandatory.' );
    menuItem.index = this.getSearchIndex(menuItem);
    await this.dataService.updateModel(CollectionNames.MenuItems, menuItem, `@content.menuItem.operation.update`);
  }

  /**
   * Delete a menuitem.
   * We are not actually deleting a menuitem. We are just archiving it.
   * @param key 
   */
  public async deleteMenuItem(menuItem: MenuItemModel) {
    menuItem.isArchived = true;
    await this.dataService.updateModel(CollectionNames.MenuItems, menuItem, `@content.menuItem.operation.delete`);
  }

  public listAllMenuItems(): Observable<MenuItemModel[]> {
    return this.dataService.listAllModels(CollectionNames.MenuItems) as Observable<MenuItemModel[]>;
  }

  /**
   * Remove the sub-menu-item itemId from the menu menuItem
   * @param menuItem 
   * @param itemId 
   */
  public async deleteItemFromMenu(menuItem: MenuItemModel, itemId: string): Promise<void> {
    if (menuItem.menuItems) {
      menuItem.menuItems.splice(menuItem.menuItems.indexOf(itemId), 1);
      await this.updateMenuItem(menuItem);  
    }
  }

    /*-------------------------- search index --------------------------------*/
    public getSearchIndex(menuItem: MenuItemModel): string {
      return getMenuItemSearchIndex(menuItem);
    }
  
    public getSearchIndexInfo(): string {
      return getMenuItemSearchIndexInfo();
    }
}