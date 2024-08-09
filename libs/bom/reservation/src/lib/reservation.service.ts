import { Injectable, inject } from '@angular/core';
import { ListType } from '@bk/categories';
import { Observable, firstValueFrom, of } from 'rxjs';
import { CollectionNames, DateFormat, convertDateFormatToString, getTodayStr, warn } from '@bk/util';
import { BaseService, BkModelSelectComponent } from '@bk/base';
import { BaseModel, RelationshipModel, ResourceModel, SubjectModel, isResource, isSubject } from '@bk/models';
import { getRelationshipIndex, getRelationshipIndexInfo } from '@bk/relationship';
import { BkDateSelectModalComponent, BkLabelSelectModalComponent } from '@bk/ui';
import { ModalController } from '@ionic/angular/standalone';
import { newReservation } from './reservation.util';
import { ReservationEditModalComponent } from './reservation-edit.modal';

@Injectable({
    providedIn: 'root'
})
export class ReservationService extends BaseService {
  private modalController = inject(ModalController);

  /*-------------------------- CRUD operations on reservation --------------------------------*/
  /**
   * Create a new RelationshipModel and save it to the database.
   * @param reservation the new RelationshipModel
   * @returns the document id of the stored model in the database
   */
  public async saveNewReservation(reservation: RelationshipModel): Promise<string> {
    return await this.dataService.createModel(CollectionNames.Reservation, reservation, '@reservation.operation.create');
  }

  /**
   * Show a modal to edit an existing reservation.
   * @param reservation the reservation to edit
   */
   public async editReservation(reservation: RelationshipModel): Promise<void> {
    const _modal = await this.modalController.create({
      component: ReservationEditModalComponent,
      componentProps: {
        reservation: reservation,
      }
    });
    _modal.present();
    await _modal.onWillDismiss();
    // we do not need to handle the data, as the modal component will update the reservation directly
  }

  /**
   * Retrieve an existing reservation from the database.
   * @param key the key of the reservation to retrieve
   * @returns the reservation as an Observable
   */
  public readReservation(key: string): Observable<RelationshipModel> {
    this.currentKey$.next(key);
    return this.dataService.readModel(CollectionNames.Reservation, key) as Observable<RelationshipModel>;
  }

  /**
   * Update an existing reservation with new values.
   * @param reservation the reservation to update
   * @param i18nPrefix the prefix for the i18n key to use for the toast message (can be used for a delete confirmation)
   */
  public async updateReservation(reservation: RelationshipModel, i18nPrefix = '@reservation.operation.update'): Promise<void> {
    await this.dataService.updateModel(CollectionNames.Reservation, reservation, i18nPrefix);
  }

  /**
   * End an existing reservation by archiving it.
   * @param reservation the reservation to delete, its bkey needs to be valid so that we can find it in the database. 
   */
  public async endReservation(reservation: RelationshipModel): Promise<void> {
    reservation.isArchived = true;
    await this.updateReservation(reservation, '@reservation.operation.delete');
    await this.saveComment(CollectionNames.Reservation, reservation.bkey, '@comment.message.reservation.deleted');   
  }

  public async createNewReservation(): Promise<void> {
    const _resource = await this.selectResource();
    if (!_resource) return;

    const _booker = await this.selectBooker();
    if (!_booker) return;

    const _reservation = newReservation(_resource, _booker, await this.selectValidFrom());
    await this.editReservation(_reservation);

  }

  // tbd: pass resource as a parameter and check to skip the resource selection
  public async createNewReservationFromSubject(subjectKey: string): Promise<void> {
    const _booker = await firstValueFrom(this.dataService.readModel(CollectionNames.Subject, subjectKey));
    if (isSubject(_booker)) {
      const _resource = await this.selectResource();
      if (!_resource) return;

      const _reservation = newReservation(_resource, _booker, await this.selectValidFrom());
      await this.editReservation(_reservation);
    } else {
      warn('ReservationService.createNewReservationFromSubject: no subject ${subjectKey} found.');
    } 
  }

  public async createNewReservationFromResource(resourceKey: string): Promise<void> {
    const _resource = await firstValueFrom(this.dataService.readModel(CollectionNames.Resource, resourceKey));
    if (isResource(_resource)) {
      const _booker = await this.selectBooker();
      if (!_booker) return;

      const _reservation = newReservation(_resource, _booker, await this.selectValidFrom());
      await this.editReservation(_reservation);  
    } else {
      warn('ReservationService.createNewReservationFromResource: no resource ${resourceKey} found.');
    } 
  }

  private async selectValidFrom(): Promise<string> {
    const _date = await this.selectDate() ?? getTodayStr(DateFormat.StoreDate);
    return convertDateFormatToString(_date, DateFormat.IsoDate, DateFormat.StoreDate);
  }

  public async selectDate(): Promise<string | undefined> {
    const _modal = await this.modalController.create({
      component: BkDateSelectModalComponent,
      cssClass: 'date-modal',
      componentProps: {
        isoDate: getTodayStr(DateFormat.IsoDate)
      }
    });
    _modal.present();
    const { data, role } = await _modal.onDidDismiss();
    if (role === 'confirm') {
      if (typeof(data) === 'string') {
        return data;
      } else {
        warn('ReservationService.selectDate: type of returned data is not string: ' + data);
      }
    }
    return undefined;
  }

  /**
   * Select an booker from the list of subjects to be used in a new reservation. 
   * Booker can be any subject (Person, Org, Group).
   * @returns the subject that was selected or undefined if no subject was selected
   */
  public async selectBooker(): Promise<SubjectModel | undefined> {
    const _modal = await this.modalController.create({
      component: BkModelSelectComponent,
      componentProps: {
        bkListType: ListType.SubjectAll
      }
    });
    _modal.present();
    const { data, role } = await _modal.onDidDismiss();
    if (role === 'confirm') {
      return isSubject(data) ? data : undefined;
    }
    return undefined;
  }

  /**
   * Select a resource from the list of all resources to be used in a new reservation. 
   * @returns the resource that was selected or undefined if no resource was selected
   */
    public async selectResource(): Promise<ResourceModel | undefined> {
      const _modal = await this.modalController.create({
        component: BkModelSelectComponent,
        componentProps: {
          bkListType: ListType.ResourceAll
        }
      });
      _modal.present();
      const { data, role } = await _modal.onDidDismiss();
      if (role === 'confirm') {
        return isResource(data) ? data : undefined;
      }
      return undefined;
    }

  /*-------------------------- list --------------------------------*/
  /**
   * List the reservations that a subject has.
   * @param subjectKey the document id of the subject to list the reservations for
   * @returns an Observable array of the selected reservations
   */
  public listReservationsOfSubject(subjectKey: string): Observable<RelationshipModel[]> {
    if (!subjectKey || subjectKey.length === 0) return of([]);
    return this.dataService.listModelsBySingleQuery(CollectionNames.Reservation, 'subjectKey', subjectKey) as Observable<RelationshipModel[]>;
  }

  /**
   * List the bookers of a given resource.
   * @param resourceKey the id of the resource to list its bookers for
   * @returns a list of the bookers of the resource as an Observable
   */
  public listBookersOfResource(resourceKey: string): Observable<RelationshipModel[]> {
    if (!resourceKey || resourceKey.length === 0) return of([]);
    return this.dataService.listModelsBySingleQuery(CollectionNames.Reservation, 'objectKey', resourceKey) as Observable<RelationshipModel[]>;
  }

  /*-------------------------- export --------------------------------*/
  public async export(): Promise<void> {
    const _index = await this.selectExportType();
    if (_index === undefined) return;
    if (_index === 0) {
      console.log('ReservationService.export: export are not implemented yet.');
      //await exportXlsx(this.filteredItems(), 'all', 'all');
    }
  }

  private async selectExportType(): Promise<number | undefined> {
    const _modal = await this.modalController.create({
      component: BkLabelSelectModalComponent,
      componentProps: {
        labels: [
          '@reservation.select.raw', 
          '@reservation.select.lockers', 
        ],
        icons: ['list-circle-outline', 'list-outline'],
        title: '@reservation.select.title'
      }
    });
    _modal.present();
    const { data, role } = await _modal.onDidDismiss();
    if (role === 'confirm') {
      if (data !== undefined) {
        console.log('ReservationService.selectExportType: data: ' + data);
        return parseInt(data);
      }
    }
    return undefined;
  }
 
  /*-------------------------- search index --------------------------------*/
  public getSearchIndex(item: BaseModel): string {
    return getRelationshipIndex(item);
  }

  public getSearchIndexInfo(): string {
    return getRelationshipIndexInfo();
  }
}
