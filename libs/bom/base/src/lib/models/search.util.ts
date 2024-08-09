import { Observable, map } from 'rxjs';
import { BaseModel } from '@bk/models';
import { CategoryType, DbQuery, ModelType, QueryValueType, getCollectionNameFromModelType } from '@bk/categories';
import { die, tagMatches, warn } from '@bk/util';
import { getRangeQuery } from './query.util';
import { Firestore, OrderByDirection, QueryConstraint, WhereFilterOp, collection, collectionGroup, orderBy, query, where } from 'firebase/firestore';
import { collectionData } from 'rxfire/firestore';

/*----------------------- SEARCH ----------------------------------------------*/
/**
 * Search data based on the given query.
 * This function should not be used directly but via dataService.searchData().
 * @param firestore   a handle to the Firestore database
 * @param collectionName the name of the Firestore collection to search in
 * @param dbQuery the query to search for (an array of DbQuery objects: key, operator, value)
 * @param orderByParam the name of the field to order by
 * @param sortOrderParam the sort order (asc or desc)
 * @returns an Observable of the search result (array of BaseModels)
 */
export function searchData(firestore: Firestore, collectionName: string, dbQuery: DbQuery[], orderByParam = 'name', sortOrderParam = 'asc'): Observable<BaseModel[]> {
  const _queries: QueryConstraint[] = [];
  for (const _dbQuery of dbQuery) {
    _queries.push(where(_dbQuery.key, _dbQuery.operator as WhereFilterOp, _dbQuery.value))
  }
  _queries.push(orderBy(orderByParam, sortOrderParam as OrderByDirection));
  const _queryRef = query(collection(firestore, collectionName), ..._queries);
  const _storedModels = collectionData(_queryRef, { idField: 'bkey' }) as Observable<BaseModel[]>;
  return _storedModels.pipe(map((_models: BaseModel[]) => {
    return _models.sort((a, b) => a.name.localeCompare(b.name));
  }));
}

/**
 * Search by date range. The match is exclusive the given border dates.
 * @param firestore a handle to the Firestore database
 * @param fieldName the name of the field to search for (e.g. dateOfBirth)
 * @param startDate the start of the range, e.g. 20100101
 * @param endDate the end of the range, e.g. 99991231
 */
export function searchDateRange(firestore: Firestore, collectionName: string, key: string,
  startDate = '00000000', endDate = '99999999', isTest = false, isArchived = false, orderBy = 'name', sortOrder = 'asc'): Observable<BaseModel[]> {
  if (!collectionName) die('BaseModelUtil.searchDateRange: collectionName is mandatory');
  if (!key) die('BaseModelUtil.searchDateRange: fieldName is mandatory');
  return searchData(firestore, collectionName, getRangeQuery(key, startDate, endDate, isTest, isArchived), orderBy, sortOrder);
}

export function searchByYear(firestore: Firestore, collectionName: string, key: string, year: string,
  isTest = false, isArchived = false, orderBy = 'name', sortOrder = 'asc'): Observable<BaseModel[]> {
  if (!collectionName) die('BaseModelUtil.searchByYear: collectionName is mandatory');
  if (!key) die('BaseModelUtil.searchByYear: key is mandatory');
  if (!year) die('BaseModelUtil.searchByYear: year is mandatory');
  if (year.length !== 4 || typeof year !== 'number') die(`BaseModelUtil.searchByYear: invalid year format <${year}> (should be nnnn)`);

  const _startDate = year + '0000';
  const _endDate = year + '1232';
  return searchDateRange(firestore, collectionName, key, _startDate, _endDate, isTest, isArchived, orderBy, sortOrder);
}


export function searchByTag(firestore: Firestore, tenantId: string, modelType: ModelType, tagName: string, orderBy = 'name', sortOrder = 'asc' as OrderByDirection): Observable<BaseModel[]> {
  if (!tagName) die('BaseModelUtil.searchByTag: tagName is mandatory');
  return listAllModelsByType(firestore, tenantId, modelType, orderBy, sortOrder).pipe(map((_models: BaseModel[]) => {
    return _models.filter((_model: BaseModel) => {
      return tagMatches(_model.tags, tagName);
    });
  }));
}

/**
 * Find all model objects that are part of the given category.
 * @param categoryId the category id to search for
 */
export function searchByCategory(firestore: Firestore, collectionName: string, tenantId: string, categoryId: number, categoryKey = 'category', orderBy = 'name', sortOrder = 'asc' as OrderByDirection): Observable<BaseModel[]> {
  if (categoryId === CategoryType.All || categoryId === CategoryType.Undefined) {
    return listAllModels(firestore, collectionName, orderBy, sortOrder);
  } else {
    return searchData(firestore, collectionName, [
      { key: 'isTest', operator: '==', value: false },
      { key: 'isArchived', operator: '==', value: false },
      { key: categoryKey, operator: '==', value: categoryId },
      { key: 'tenant', operator: '==', value: tenantId }
    ], orderBy, sortOrder);
  }
}

/*----------------------- LIST ----------------------------------------------*/
// LIST functions are querying Firestore collections.

export function listAllModels(firestore: Firestore, collectionName: string, tenantId: string, orderBy = 'name', sortOrder = 'asc'): Observable<BaseModel[]> {
  return searchData(firestore, collectionName, [
    { key: 'isTest', operator: '==', value: false },
    { key: 'isArchived', operator: '==', value: false },
    { key: 'tenant', operator: '==', value: tenantId }
  ], orderBy, sortOrder);
}

export function listAllObjects(firestore: Firestore, collectionName: string, orderBy?: string, sortOrder?: string): Observable<unknown[]> {
  return searchData(firestore, collectionName, [], orderBy, sortOrder);
}

export function listAllFromCollectionGroup(firestore: Firestore, collectionName: string): Observable<unknown[]> {
  const _query = collectionGroup(firestore, collectionName);
  return collectionData(_query, { idField: 'bkey' }) as Observable<unknown[]>;
}

export function listAllModelsByType(firestore: Firestore, tenantId: string, modelType: ModelType, orderBy = 'name', sortOrder = 'asc'): Observable<BaseModel[]> {
  return searchData(firestore, getCollectionNameFromModelType(modelType), [
    { key: 'isTest', operator: '==', value: false },
    { key: 'isArchived', operator: '==', value: false },
    { key: 'tenant', operator: '==', value: tenantId },
    { key: 'modelType', operator: '==', value: modelType }
  ], orderBy, sortOrder);
}

export function listModelsByTrue(firestore: Firestore, collectionName: string, tenantId: string, searchKey: string, orderBy = 'name', sortOrder = 'asc'): Observable<BaseModel[]> {
  return searchData(firestore, collectionName, [
    { key: 'isTest', operator: '==', value: false },
    { key: 'isArchived', operator: '==', value: false },
    { key: 'tenant', operator: '==', value: tenantId },
    { key: searchKey, operator: '==', value: true }
  ], orderBy, sortOrder);
}

export function listModelsBySingleQuery(firestore: Firestore, collectionName: string, tenantId: string, searchKey: string, value: QueryValueType, operator = '==', orderBy = 'name', sortOrder = 'asc'): Observable<BaseModel[]> {
  return searchData(firestore, collectionName, [
    { key: 'isTest', operator: '==', value: false },
    { key: 'isArchived', operator: '==', value: false },
    { key: 'tenant', operator: '==', value: tenantId },
    { key: searchKey, operator: operator, value: value }
  ], orderBy, sortOrder);
}

/*----------------------- STEPPER ----------------------------------------------*/
export function incrementIndex(currentIndex: number | undefined, length: number): number {
  if (!currentIndex) return 0;
  return currentIndex < (length - 1) ? currentIndex + 1 : 0;
}

export function decrementIndex(currentIndex: number | undefined, length: number): number {
  if (!currentIndex) return 0;
  return currentIndex > 0 ? currentIndex - 1 : length - 1;
}

export function getIndexByKey(filteredItems: BaseModel[], key: string | undefined): number {
  if (!filteredItems || key === undefined) {
    warn('BaseModelUtil.getIndexByKey: filteredItems and key are mandatory (returning 0).');
    return 0;
  }
  return filteredItems.findIndex((_item) => _item.bkey === key);
}

export function getKeyByIndex(filteredItems: BaseModel[], index: number | undefined): string {
  if (!filteredItems || index === undefined) {
    warn('BaseModelUtil.getKeyByIndex: filteredItems and index are mandatory.');
    return '';
  }
  if (index < 0 || index > filteredItems.length) {
    warn('BaseModelUtil.getKeyByIndex: invalid index given.');
    return '';
  }
  return filteredItems[index].bkey ?? '';
}