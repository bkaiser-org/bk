import { Injectable } from '@angular/core';
import { BaseService } from '@bk/base';
import { Observable } from 'rxjs';
import { CollectionNames, die } from '@bk/util';
import { TripModel } from '@bk/models';
import { getTripSearchIndex, getTripSearchIndexInfo } from './trip.util';

@Injectable({
  providedIn: 'root'
})
export class TripService extends BaseService {

  constructor() {
    super();
  }

  /*-------------------------- CRUD operations --------------------------------*/
  /**
   * Save a new trip into the database.
   * @param trip the new trip to be saved
   * @returns the document id of the new TripModel in the database
   */
  public async createTrip(trip: TripModel): Promise<string> {
    trip.index = getTripSearchIndex(trip);
    const _key = await this.dataService.createModel(CollectionNames.Trip, trip, '@trip.operation.create');
    await this.saveComment(CollectionNames.Trip, _key, '@comment.operation.initial.conf');
    return _key;
  }

  /**
   * Read a trip from the database by returning an Observable of a TripModel by uid.
   * @param firestore a handle to the Firestore database
   * @param uid the key of the trip to be read
   */
  public readTrip(key: string): Observable<TripModel> {
    return this.dataService.readModel(CollectionNames.Trip, key) as Observable<TripModel>;
  }

  public async loadTrips(keys: string[]): Promise<TripModel[]> {
    return await this.dataService.readModels(CollectionNames.Trip, keys) as TripModel[];
  }


  /**
   * Update an existing trip with new values.
   * @param trip the TripModel with the new values
   */
  public async updateTrip(trip: TripModel): Promise<void> {
    if (!trip?.bkey?.length) die('TripService.updateTrip: bkey is mandatory.' );
    trip.index = this.getSearchIndex(trip);
    await this.dataService.updateModel(CollectionNames.Trip, trip, '@trip.operation.update');
  }

  /**
   * Delete an existing trip in the database by archiving it.
   * @param trip the TripModel to be deleted.
   */
  public async deleteTrip(trip: TripModel): Promise<void> {
    trip.isArchived = true;
    await this.dataService.updateModel(CollectionNames.Trip, trip, '@trip.operation.delete');
  }

  /*-------------------------- LIST operations --------------------------------*/
 /**
   * List all trips.
   * @param orderBy 
   * @param sortOrder 
   * @returns 
   */
  public listAllTrips(orderBy = 'name', sortOrder = 'asc'): Observable<TripModel[]> {
    return this.dataService.listAllModels(CollectionNames.Trip, orderBy, sortOrder) as Observable<TripModel[]>;
  }

  /*-------------------------- search index --------------------------------*/
  public getSearchIndex(trip: TripModel): string {
    return getTripSearchIndex(trip);
  }

  public getSearchIndexInfo(): string {
    return getTripSearchIndexInfo();
  }
}

