import { Injectable } from '@angular/core';
import { BaseService } from '@bk/base';
import { Observable } from 'rxjs';
import { BaseModel, InvoicePositionModel } from '@bk/models';
import { CollectionNames } from '@bk/util';
import { getInvoicePositionIndex, getInvoicePositionIndexInfo } from './invoice-position.util';

@Injectable({
  providedIn: 'root'
})
export class InvoicePositionService extends BaseService {

  /*-------------------------- CRUD operations --------------------------------*/
  /**
   * Create a new InvoicePositionModel in the database.
   * @param invoicePosition the model to be created
   * @returns the document id of the model created
   */
  public async createInvoicePosition(invoicePosition: InvoicePositionModel): Promise<string | null> {
    invoicePosition.index = getInvoicePositionIndex(invoicePosition);
    return this.dataService.createModel(CollectionNames.InvoicePosition, invoicePosition, '@finance.invoicePosition.operation.create');
  }

  /**
   * Return an Observable of an InvoicePosition by uid.
   * @param key the document id of the InvoicePositionModel in the database
   */
  public readInvoicePosition(key: string): Observable<InvoicePositionModel> {
    this.currentKey$.next(key);
    return this.dataService.readModel(CollectionNames.InvoicePosition, key) as Observable<InvoicePositionModel>;
  }

  /**
   * Update an existing InvoicePosition with new values
   * @param invoicePosition the new values
   */
  public async updateSubject(invoicePosition: InvoicePositionModel): Promise<void> {
    invoicePosition.index = getInvoicePositionIndex(invoicePosition);
    await this.dataService.updateModel(CollectionNames.InvoicePosition, invoicePosition, '@finance.invoicePosition.operation.update');
  }

  /*-------------------------- LIST operations --------------------------------*/

  /**
   * List All InvoicePositions in the database.
   * @param orderBy  the field to order the list by
   * @param sortOrder the sort order (asc or desc)
   * @returns an Observable of an array of InvoicePositions
   */
  public listAllInvoicePositions(orderBy = 'name', sortOrder = 'asc'): Observable<InvoicePositionModel[]> {
    return this.dataService.listAllModels(CollectionNames.InvoicePosition, orderBy, sortOrder) as Observable<InvoicePositionModel[]>;
  }

  /*-------------------------- search index --------------------------------*/
  public getSearchIndex(item: BaseModel): string {
    return getInvoicePositionIndex(item);
  }

  public getSearchIndexInfo(): string {
    return getInvoicePositionIndexInfo();
  }
}
