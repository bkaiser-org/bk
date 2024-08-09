import { Injectable } from '@angular/core';
import { ModelType, getModelSlug } from '@bk/categories';
import { Observable } from 'rxjs';
import { CollectionNames, warn } from '@bk/util';
import { BaseService, checkKey } from '@bk/base';
import { BaseModel, ResourceModel } from '@bk/models';
import { getResourceIndex, getResourceIndexInfo, getResourceSlug } from './resource.util';

@Injectable({
    providedIn: 'root'
})
export class ResourceService extends BaseService {

  /*-------------------------- CRUD operations --------------------------------*/
  /**
   * Create a new resources
   * @param resource 
   */
  public async createResource(resource: ResourceModel | undefined): Promise<string | undefined> {
    if (resource) {
      resource.index = getResourceIndex(resource);
      const _key = await this.dataService.createModel(CollectionNames.Resource, resource, `@resource.${getResourceSlug(resource.category)}.operation.create`);
      resource = checkKey(resource, _key) as ResourceModel; // make sure the key is set
      await this.saveComment(CollectionNames.Resource, _key, '@comment.operation.initial.conf');
      return _key;
    }
    return undefined;
  }

  /**
   * Read a resource from the database 
   * @param key the document id of the Resource
   * @returns the ResourceModel that has the given key
   */
  public readResource(key: string): Observable<ResourceModel> {
    this.currentKey$.next(key);
    return this.dataService.readModel(CollectionNames.Resource, key) as unknown as Observable<ResourceModel>;
  }

  /**
   * Update the values of an existing ResourceModel in the database.
   * @param resource the new values. Must contain a key in field bkey so that we are able to find the existing ResourceModel.
   */
  public async updateResource(resource: ResourceModel): Promise<void> {
    if (resource) {
      resource.index = getResourceIndex(resource);
      await this.dataService.updateModel(CollectionNames.Resource, resource, `@resource.${getResourceSlug(resource.category)}.operation.update`)
    }
  }

  /*-------------------------- LISTS --------------------------------*/

  public listAllLockers(): Observable<ResourceModel[]> {
    return this.dataService.listModelsBySingleQuery(CollectionNames.Resource, 'category', [5, 6], 'in') as Observable<ResourceModel[]>;
  }

  /**
   * 
   * @param ownerKey 
   * @param modelType 
   * @param resourceKey 
   * @returns 
   */
  public async editOwner(ownerKey: string | undefined, modelType: ModelType, resourceKey: string | undefined): Promise<void> {
    if (!ownerKey || ownerKey.length === 0 || !resourceKey || resourceKey.length === 0) {
        warn('ResourceService.editOwner: ownerKey and resourceKey are mandatory.');
        return;
    }
    await this.navigateToUrl(`/${getModelSlug(modelType)}/${ownerKey}`);
  }

  /*-------------------------- search index --------------------------------*/
  public getSearchIndex(item: BaseModel): string {
    return getResourceIndex(item);
  }

  public getSearchIndexInfo(): string {
    return getResourceIndexInfo();
  }
}