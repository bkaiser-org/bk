import { Injectable, inject } from '@angular/core';
import { ListType } from '@bk/categories';
import { Observable, firstValueFrom, of } from 'rxjs';
import { CollectionNames, DateFormat, convertDateFormatToString, getTodayStr, warn } from '@bk/util';
import { BaseService, BkModelSelectComponent } from '@bk/base';
import { newResourceOwnership } from './ownership.util';
import { BaseModel, RelationshipModel, ResourceModel, SubjectModel, isResource, isSubject } from '@bk/models';
import { getRelationshipIndex, getRelationshipIndexInfo } from '@bk/relationship';
import { BkDateSelectModalComponent, BkLabelSelectModalComponent } from '@bk/ui';
import { OwnershipEditModalComponent } from './ownership-edit.modal';
import { ModalController } from '@ionic/angular/standalone';

@Injectable({
    providedIn: 'root'
})
export class OwnershipService extends BaseService {
  private modalController = inject(ModalController);

  /*-------------------------- CRUD operations Ownership --------------------------------*/
  /**
   * Create a new RelationshipModel and save it to the database.
   * @param ownership the new RelationshipModel
   * @returns the document id of the stored model in the database
   */
  public async saveNewOwnership(ownership: RelationshipModel): Promise<string> {
    return await this.dataService.createModel(CollectionNames.Ownership, ownership, '@ownership.operation.create');
  }

  /**
   * Show a modal to edit an existing ownership.
   * @param ownership the ownership to edit
   */
  public async editOwnership(ownership: RelationshipModel): Promise<void> {
    const _modal = await this.modalController.create({
      component: OwnershipEditModalComponent,
      componentProps: {
        ownership: ownership,
      }
    });
    _modal.present();
    await _modal.onWillDismiss();
    // we do not need to handle the data, as the modal component will update the ownership directly
  }

  /**
   * Retrieve an existing ownership from the database.
   * @param key the key of the ownership to retrieve
   * @returns the ownership as an Observable
   */
  public readOwnership(key: string): Observable<RelationshipModel> {
    this.currentKey$.next(key);
    return this.dataService.readModel(CollectionNames.Ownership, key) as Observable<RelationshipModel>;
  }

  /**
   * Update an existing ownership with new values.
   * @param ownership the ownership to update
   */
  public async updateOwnership(ownership: RelationshipModel): Promise<void> {
    await this.dataService.updateModel(CollectionNames.Ownership, ownership, `@ownership.operation.update`);
  }

  /**
   * End an existing Ownership.
   * We do not archive ownerships as we want to make them visible in the lists.
   * Therefore, we end an ownership by setting its validTo date.
   * @param ownership the Ownership to delete, its bkey needs to be valid so that we can find it in the database. 
   */
  public async endOwnership(ownership: RelationshipModel): Promise<void> {
    const _date = await this.selectDate();
    if (!_date) return;
    ownership.validTo = convertDateFormatToString(_date, DateFormat.IsoDate, DateFormat.StoreDate);
    await this.updateOwnership(ownership);
    await this.saveComment(CollectionNames.Ownership, ownership.bkey, '@comment.message.ownership.deleted');   
  }

  public async createNewOwnershipFromSubject(subjectKey: string): Promise<void> {
    const _subject = await firstValueFrom(this.dataService.readModel(CollectionNames.Subject, subjectKey));
    if (isSubject(_subject)) {
      const _resource = await this.selectResource();
      if (!_resource) return;

      const _date = await this.selectDate() ?? getTodayStr(DateFormat.StoreDate);
      if (!_date) return;

      const _validFrom = convertDateFormatToString(_date, DateFormat.IsoDate, DateFormat.StoreDate);

      const _ownership = newResourceOwnership(_resource, _subject, _validFrom);
      const _key = await this.saveNewOwnership(_ownership);
      await this.saveComment(CollectionNames.Ownership, _key, '@comment.operation.initial.conf');   
    } else {
      warn('OwnershipService.createNewOwnershipFromSubject: no subject ${subjectKey} found.');
    } 
  }

  public async createNewOwnershipFromResource(resourceKey: string): Promise<void> {
    const _resource = await firstValueFrom(this.dataService.readModel(CollectionNames.Resource, resourceKey));
    if (isResource(_resource)) {
      const _owner = await this.selectOwner();
      if (!_owner) return;

      const _date = await this.selectDate() ?? getTodayStr(DateFormat.StoreDate);
      if (!_date) return;
      
      const _validFrom = convertDateFormatToString(_date, DateFormat.IsoDate, DateFormat.StoreDate);

      const _ownership = newResourceOwnership(_resource, _owner, _validFrom);
      const _key = await this.saveNewOwnership(_ownership);
      await this.saveComment(CollectionNames.Ownership, _key, '@comment.operation.initial.conf');   
    } else {
      warn('OwnershipService.createNewOwnershipFromResource: no resource ${resourceKey} found.');
    } 
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
        warn('OwnershipService.selectDate: type of returned data is not string: ' + data);
      }
    }
    return undefined;
  }

  /**
   * Select an owner from the list of subjects to be used in a new ownership. 
   * Owner can be any subject (Person, Org, Group).
   * @returns the subject that was selected or undefined if no subject was selected
   */
  public async selectOwner(): Promise<SubjectModel | undefined> {
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
   * Select a resource from the list of all resources to be used in a new ownership. 
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
   * List the ownerships that a subject has.
   * @param subjectKey the document id of the subject to list the ownerships for
   * @returns an Observable array of the selected ownerships
   */
  public listOwnershipsOfSubject(subjectKey: string): Observable<RelationshipModel[]> {
    if (!subjectKey || subjectKey.length === 0) return of([]);
    return this.dataService.listModelsBySingleQuery(CollectionNames.Ownership, 'subjectKey', subjectKey) as Observable<RelationshipModel[]>;
  }

  /**
   * List the owners of a given resource.
   * @param resourceKey the id of the resource to list its owners for
   * @returns a list of the owners of the resource as an Observable
   */
  public listOwnersOfResource(resourceKey: string): Observable<RelationshipModel[]> {
    if (!resourceKey || resourceKey.length === 0) return of([]);
    return this.dataService.listModelsBySingleQuery(CollectionNames.Ownership, 'objectKey', resourceKey) as Observable<RelationshipModel[]>;
  }

  /*-------------------------- export --------------------------------*/
  public async export(): Promise<void> {
    const _index = await this.selectExportType();
    if (_index === undefined) return;
    if (_index === 0) {
      console.log('OwnershipService.export: export are not implemented yet.');
      //await exportXlsx(this.filteredItems(), 'all', 'all');
    }
  }

  private async selectExportType(): Promise<number | undefined> {
    const _modal = await this.modalController.create({
      component: BkLabelSelectModalComponent,
      componentProps: {
        labels: [
          '@ownership.select.raw', 
          '@ownership.select.lockers', 
        ],
        icons: ['list-circle-outline', 'list-outline'],
        title: '@ownership.select.title'
      }
    });
    _modal.present();
    const { data, role } = await _modal.onDidDismiss();
    if (role === 'confirm') {
      if (data !== undefined) {
        console.log('OwnershipService.selectExportType: data: ' + data);
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
