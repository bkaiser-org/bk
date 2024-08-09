import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CollectionNames, die } from "@bk/util";
import { BaseService } from "@bk/base";
import { LocationModel } from "@bk/models";
import { getLocationSearchIndex, getLocationSearchIndexInfo } from "./location.util";

@Injectable({
    providedIn: 'root'
})
export class LocationService extends BaseService {

  /*-------------------------- CRUD operations --------------------------------*/
  /**
   * Create a new location in the database.
   * @param location the LocationModel to store in the database
   * @returns the document id of the newly created location
   */
  public async createLocation(location: LocationModel): Promise<string> {
    location.index = getLocationSearchIndex(location);
    const _key = await this.dataService.createModel(CollectionNames.Location, location, 'location.operation.create');
    await this.saveComment(CollectionNames.Location, _key, '@comment.operation.initial.conf');
    return _key;
  }

  /**
   * Lookup a location in the database by its document id and return it as an Observable.
   * @param key the document id of the location
   * @returns an Observable of the LocationModel
   */
  public readLocation(key: string): Observable<LocationModel> {
    return this.dataService.readModel(CollectionNames.Location, key) as Observable<LocationModel>;
  }

  public async loadLocations(keys: string[]): Promise<LocationModel[]> {
    return await this.dataService.readModels(CollectionNames.Location, keys) as LocationModel[];
  }

  /**
   * Update a location in the database with new values.
   * @param location the LocationModel with the new values. Its key must be valid (in order to find it in the database)
   */
  public async updateLocation(location: LocationModel): Promise<void> {
    if (!location?.bkey?.length) die('LocationService.updateLocation: bkey is mandatory.' );
    location.index = this.getSearchIndex(location);
    await this.dataService.updateModel(CollectionNames.Location, location, `@location.operation.update`);
  }

  /**
   * Delete a location.
   * We are not actually deleting a location. We are just archiving it.
   * @param key 
   */
  public async deleteLocation(location: LocationModel) {
    location.isArchived = true;
    await this.dataService.updateModel(CollectionNames.Location, location, '@location.operation.delete');
  }

  public listAllLocations(): Observable<LocationModel[]> {
    return this.dataService.listAllModels(CollectionNames.Location) as Observable<LocationModel[]>;
  }

    /*-------------------------- search index --------------------------------*/
    public getSearchIndex(location: LocationModel): string {
      return getLocationSearchIndex(location);
    }
  
    public getSearchIndexInfo(): string {
      return getLocationSearchIndexInfo();
    }
}