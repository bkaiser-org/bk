import { ActionType, AddressChannels, ApplicationTypes, BoatTypes, Category, CategoryType, DocumentTypes, EventTypes, GenderTypes, getCategoryAbbreviation, ListTypes, LocationTypes, ModelType, OrgTypes, RelationshipType, RelationshipTypes, ResourceTypes, SectionTypes } from '@bk/categories';
import { die, confirmAction, warn, nameMatches, getProperty, bkTranslate, SortCriteria, SortDirection, sortAscending, sortDescending, convertDateFormat, DateFormat, numberMatches, tagMatches } from '@bk/util';
import { Observable, of } from 'rxjs';
import { ToastController } from '@ionic/angular';
import { BaseModel, AddressModel, RelationshipModel, ResourceModel, SubjectModel, EventModel, DocumentModel, isBoat, isRelationship, isSubject, isDocument, isEvent, isResource, isBaseModel, DataState } from '@bk/models';
import { collection, deleteDoc, doc, Firestore, setDoc, updateDoc } from 'firebase/firestore';
import { docData } from 'rxfire/firestore';

/*----------------------- CRUD ----------------------------------------------*/

/**
 * Save a model as a new Firestore document into the database. 
 * If bkey is not set, the document ID is automatically assigned, otherwise bkey is used as the document ID in Firestore.
 * This function uses setdoc() to overwrite a document with the same ID. If the document does not exist, it will be created.
 * If the document does exist, its contents will be overwritten with the newly provided data.
 * @param firestore a handle to the Firestore database
 * @param collectionName the name of the Firestore collection to create the model in
 * @param model the data to save
 * @param i18nPrefix The prefix for internationalized confirmation and error messages. 
 * ¨      Expected to have .conf for success and .error for failure translations.
 *        if undefined, no confirmation toast is shown.
 * @param toastController the toast controller to show the confirmation toast
 * @returns a Promise of the key of the newly stored model
 */
export async function createModel(firestore: Firestore, collectionName: string, model: BaseModel, tenantId: string, i18nPrefix?: string, toastController?: ToastController): Promise<string> {
  if (!model) die('BaseModelUtil.createModel: model is mandatory.');
  const _prefix = `BaseModelUtil.createModel(${model.bkey}) of type ${model.category})`;
  // If bkey is not set, the document ID is automatically assigned, otherwise bkey is used as the document ID in Firestore.
  const _key = model.bkey;
  const _ref = (!_key || _key.length === 0) ? doc(collection(firestore, collectionName)) : doc(firestore, collectionName, _key);

  // we delete the bkey from the model because we don't want to store it in the database (_ref.id is available instead)
  const _storedModel = structuredClone(model);
  _storedModel.tenant = [tenantId];   // ensure that the tenant is set
  delete _storedModel.bkey;

  try {
    // we need to convert the custom object to a pure JavaScript object (e.g. arrays)
    await setDoc(_ref, JSON.parse(JSON.stringify(_storedModel)));
    if (i18nPrefix && i18nPrefix.length > 0 && toastController) {
      await confirmAction(bkTranslate(`${i18nPrefix}.conf`), true, toastController);
    }
    return Promise.resolve(_ref.id);
  }
  catch (_ex) {
    console.error(`${_prefix} -> ERROR on path=${collectionName}/${_ref.id}:`, _ex);
    if (i18nPrefix && i18nPrefix.length > 0 && toastController) {
      await confirmAction(bkTranslate(`${i18nPrefix}.error`), true, toastController);
    }
    return Promise.reject(new Error('Failed to create model'));
  }
}

/**
 * Asynchronously creates an object in a specified Firestore collection.
 * Use this method to save any data other than a model. For saving a model, use createModel()
 * 
 * @param {Firestore} firestore - The Firestore instance in which to create the object.
 * @param {string} collectionName - The name of the Firestore collection in which to create the object.
 * @param {object} object - The object data to be created in Firestore.
 * @param {string} key - The unique key for the object in the collection.
 * @param i18nPrefix The prefix for internationalized confirmation and error messages. 
 * ¨      Expected to have .conf for success and .error for failure translations.
 *        if undefined, no confirmation toast is shown.
 * @param toastController the toast controller to show the confirmation toast
 * 
 * @returns {Promise<string>} Returns a promise that resolves with the provided key if the object is successfully created.
 * 
 * @throws {Error} Throws an error if the `object` or `collectionName` is not provided.
 * @throws {Error} Throws an error if there's a problem creating the object in Firestore.
 * 
 * @see Firestore for more details about the Firestore instance.
 * 
 * Note: This function uses `setDoc` and `doc` methods from Firestore SDK.
 */
export async function createObject(firestore: Firestore, collectionName: string, object: object, key: string | undefined, i18nPrefix?: string, toastController?: ToastController): Promise<string> {
  if (collectionName?.length === 0) die('BaseModelUtil.createObject: collectionName is mandatory.');
  if (!object) die('BaseModelUtil.createObject: object is mandatory.');
  try {
    // if the key is not set, the document ID is automatically assigned, otherwise the given key is used as the document ID in Firestore.
    const _ref = key?.length === 0 ? doc(collection(firestore, collectionName)) : doc(firestore, `${collectionName}/${key}`);
    await setDoc(_ref, object);
    if (i18nPrefix && i18nPrefix.length > 0 && toastController) {
      await confirmAction(bkTranslate(`${i18nPrefix}.conf`), true, toastController);
    }
    return Promise.resolve(_ref.id);
  }
  catch (_ex) {
    console.error(`BaseModelUtil.createObject(${collectionName}, ${key}) -> ERROR: `, _ex);
    if (i18nPrefix && i18nPrefix.length > 0 && toastController) {
      await confirmAction(bkTranslate(`${i18nPrefix}.error`), true, toastController);
    }
    return Promise.reject(new Error('Failed to create object'));
  }
}

/**
 * Lookup a model in the Firestore database and return it as an Observable.
 * @param firestore a handle to the Firestore database
 * @param collectionName the name of the Firestore collection (this can be a path e.g. subjects/SUBJECTKEY/addresses)
 * @param key the key of the document in the database
 * @param isStrict if true, throw an error if the model is not found, otherwise return undefined
 */
export function readModel(firestore: Firestore, collectionName: string, key: string | undefined, isStrict = true): Observable<BaseModel | undefined> {
  if (!collectionName) die('BaseModelUtil.readModel: collectionName is mandatory');
  if (!key) {
    return isStrict ? die('BaseModelUtil.readModel: key is mandatory') : of(undefined);
  }
  try {
    // we need to add the firestore document id as bkey into the model
    return docData(doc(firestore, `${collectionName}/${key}`), { idField: 'bkey' }) as Observable<BaseModel>;
  }
  catch (_ex) {
    console.error(`BaseModelUtil.readModel(${collectionName}/${key}) -> ERROR: `, _ex);
    return isStrict ? die('Failed to read model') : of(undefined);
  }
}

/**
 * Lookup an object in the Firestore database and return it as an Observable.
 * @param firestore a handle to the Firestore database
 * @param collectionName the name of the Firestore collection (this can be a path)
 * @param key the key of the document in the database
 */
export function readObject(firestore: Firestore, collectionName: string, key: string): Observable<unknown> {
  if (!collectionName) die('BaseModelUtil.readObject: collectionName is mandatory');
  if (!key) die('BaseModelUtil.readObject: key is mandatory');
  try {
    return docData(doc(firestore, `${collectionName}/${key}`)) as Observable<unknown>;
  }
  catch (_ex) {
    console.error(`BaseModelUtil.readObject(${collectionName}/${key}) -> ERROR: `, _ex);
    return die('Failed to read object');
  }
}

/**
 * Update the document with id=uid with the given document.
 * Update is for non-destructive updates, ie. it updates the current value
 * within the database with the new value specified as the parameter.
 * @param firestore a handle to the Firestore database
 * @param collectionName the name of the Firestore collection to update the model in
 * @param model the changed model document to save
 * @param i18nPrefix The prefix for internationalized confirmation and error messages. 
 * ¨      Expected to have .conf for success and .error for failure translations.
 *        if undefined, no confirmation toast is shown.
 * @param toastController the toast controller to show the confirmation toast
 * @returns a Promise of the key of the updated model
 */
export async function updateModel(firestore: Firestore, collectionName: string, model: BaseModel, i18nPrefix?: string, toastController?: ToastController): Promise<string> {
  if (!model) die('BaseModelUtil.updateModel: model is mandatory.');
  if (!model.tenant || model.tenant.length === 0) die('BaseModelUtil.updateModel: model.tenant is mandatory.');

  const _key = model.bkey;
  if (!_key || _key.length === 0) die('BaseModelUtil.updateModel: model.bkey is mandatory.');

  const _prefix = `BaseModelUtil.updateModel(${_key} of type ${model.category})`;
  const _path = `${collectionName}/${_key}`;

  // we delete attribute bkey from the model because we don't want to store it in the database (_ref.id is available instead)
  const _storedModel = structuredClone(model);
  delete _storedModel.bkey;
  
  try {
    await updateDoc(doc(firestore, _path), {..._storedModel});
    if (i18nPrefix && i18nPrefix.length > 0 && toastController) {
      await confirmAction(bkTranslate(`${i18nPrefix}.conf`), true, toastController);
    }
    return Promise.resolve(_key);
  }
  catch (_ex) {
    console.error(`${_prefix} -> ERROR: `, _ex);
    if (i18nPrefix && i18nPrefix.length > 0 && toastController) {
      await confirmAction(bkTranslate(`${i18nPrefix}.error`), true, toastController);
    }
    return Promise.reject(new Error('Failed to update model'));
  }
}

/**
 * 
 * @param firestore a handle to the Firestore database
 * @param collectionName the name of the Firestore collection to update the object in
 * @param key the document id of the object in the database
 * @param object the object with the new values
 * @param i18nPrefix The prefix for internationalized confirmation and error messages. 
 * ¨      Expected to have .conf for success and .error for failure translations.
 *        if undefined, no confirmation toast is shown.
 * @param toastController the toast controller to show the confirmation toast
 * @returns a Promise of the key of the updated object
 */
export async function updateObject(firestore: Firestore, collectionName: string, key: string, object: unknown, i18nPrefix?: string, toastController?: ToastController): Promise<string> {
  if (collectionName?.length === 0) die('BaseModelUtil.updateObject: collectionName is mandatory.');
  if (key?.length === 0) die('BaseModelUtil.updateObject: key is mandatory.');
  if (!object) die('BaseModelUtil.updateObject: object is mandatory.');
  const _path = `${collectionName}/${key}`;
  try {
    await updateDoc(doc(firestore, _path), object);
    if (i18nPrefix && i18nPrefix.length > 0 && toastController) {
      await confirmAction(bkTranslate(`${i18nPrefix}.conf`), true, toastController);
    }
    return Promise.resolve(key);
  }
  catch (_ex) {
    console.error(`BaseModelUtil.updateObject(${_path}) -> ERROR: `, _ex);
    if (i18nPrefix && i18nPrefix.length > 0 && toastController) {
      await confirmAction(bkTranslate(`${i18nPrefix}.error`), true, toastController);
    }
    return Promise.reject(new Error('Failed to update object'));
  }
}

/**
 * Asynchronously updates an existing model or creates a new model in a specified Firestore collection. 
 * Provides feedback either through internationalized messages or console logs.
 * Optionally navigates to a specified URL after the operation.
 * 
 * @param {Firestore} firestore - The Firestore instance where the model resides.
 * @param {string} collectionName - The name of the Firestore collection.
 * @param {BaseModel} model - The model instance to be updated or created.
 * @param {ActionType} action - The type of action, either 'Create' or 'Update'.
 * @param i18nPrefix The prefix for internationalized confirmation and error messages. 
 * ¨      Expected to have .conf for success and .error for failure translations.
 *        if undefined, no confirmation toast is shown.
 * @param toastController the toast controller to show the confirmation toast
 * 
 * @returns {Promise<void>} Returns a promise that resolves once the operation and optional navigation are completed.
 * @throws {Error} Throws an error if there's an issue updating or creating the model in Firestore.
 * 
 * @see Firestore for more details on the Firestore instance.
 * @see BaseModel for details on the model structure.
 * @see ToastController for feedback display details.
 * @see Router for navigation details.
 */
export async function updateOrCreateModel(firestore: Firestore, collectionName: string, model: BaseModel, action: ActionType, tenantId: string, i18nPrefix?: string, toastController?: ToastController): Promise<string> {
  try {
    const _key = (action === ActionType.Create) ? 
        await createModel(firestore, collectionName, model, tenantId) : 
        await updateModel(firestore, collectionName, model);
      if (i18nPrefix && i18nPrefix.length > 0 && toastController) {
        confirmAction(i18nPrefix + '.conf', true, toastController);    
      }
      return Promise.resolve(_key);
  }
  catch (_ex) {
    if (!i18nPrefix || i18nPrefix.length === 0 || !toastController) {
      console.warn('ERROR updateOrCreateModel: ', _ex);
    } else {
      confirmAction(i18nPrefix + '.error', true, toastController);
    }
    return Promise.reject(new Error('Failed to update or create model'));
  }
}

/**
 * Delete the model.
 * We don't delete models permanently. Instead we archive the models.
 * Admin can still find the archived models in the database.
 * Admin user may also permanently delete archived models directly in the database.
 *
 * @param firestore a handle to the Firestore database
 * @param collectionName the name of the Firestore collection to delete the model from
 * @param model the model document to delete
 * @param i18nPrefix The prefix for internationalized confirmation and error messages. 
 * ¨      Expected to have .conf for success and .error for failure translations.
 *        if undefined, no confirmation toast is shown.
 * @param toastController the toast controller to show the confirmation toast
 * @returns a void Promise
 */
export async function deleteModel(firestore: Firestore, collectionName: string, model: BaseModel, i18nPrefix?: string, toastController?: ToastController): Promise<void> {
  model.isArchived = true;
  if (model.modelType === ModelType.Address) {
    (model as AddressModel).isFavorite = false;
  }
  await updateModel(firestore, collectionName, model, i18nPrefix, toastController);
}

/**
 * Delete an object in the database.
 * Objects are directly and permanently deleted in the database.

 * @param firestore a handle to the Firestore database
 * @param collectionName the name of the Firestore collection to delete the model from
 * @param key the document id of the object in the database
 * @param i18nPrefix The prefix for internationalized confirmation and error messages. 
 * ¨      Expected to have .conf for success and .error for failure translations.
 *        if undefined, no confirmation toast is shown.
 * @param toastController the toast controller to show the confirmation toast
 * @returns a void Promise
 */
export async function deleteObject(firestore: Firestore, collectionName: string, key: string, i18nPrefix?: string, toastController?: ToastController): Promise<void> {
  const _path = `${collectionName}/${key}`;
  try {
    await deleteDoc(doc(firestore, _path));
    if (i18nPrefix && i18nPrefix.length > 0 && toastController) {
      confirmAction(i18nPrefix + '.conf', true, toastController);    
    }
    return Promise.resolve();
  }
  catch (_ex) {
    if (!i18nPrefix || i18nPrefix.length === 0 || !toastController) {
      console.warn(`BaseModelUtil.deleteObject(${_path}): ERROR: `, _ex);
    } else {
      confirmAction(i18nPrefix + '.error', true, toastController);
    }
    return Promise.reject(new Error('Failed to delete object'));
    }
}


/*-------------------------FILTERS --------------------------------------------*/
// filters are filtering an (Observable)Array of data by some criteria. This happens in-memory without a database access.

export function filterModelsByCategory(state: DataState, category: number): BaseModel[] {
  const _state = structuredClone(state);
  _state.selectedCategory = category;
  return filterModels(_state);
}

export function filterModelsBySearchTerm(state: DataState, searchTerm: string): BaseModel[] {
  const _state = structuredClone(state);
  _state.searchTerm = searchTerm;
  return filterModels(_state);
}

export function filterModelsByYear(state: DataState, year: number): BaseModel[] {
  const _state = structuredClone(state);
  _state.selectedYear = year;
  return filterModels(_state);
}

export function filterModelsByTag(state: DataState, tag: string): BaseModel[] {
  const _state = structuredClone(state);
  _state.selectedTag = tag;
  return filterModels(_state);
}


// filter by search term, category and tag
export function filterModels(state: DataState): BaseModel[] {
  switch (ListTypes[state.listType].modelType) {
    case ModelType.Boat: return filterBoats(state);
    case ModelType.Resource: return filterResources(state);
    case ModelType.Event: return filterEvents(state);
    case ModelType.Document: return filterDocuments(state);
    case ModelType.Subject: return filterSubjects(state);
    case ModelType.Relationship: 
      return ListTypes[state.listType].relationshipType === RelationshipType.Ownership ? filterOwnerships(state) : filterMemberships(state);    
    default: return filterBaseModels(state);
  }
}

export function filterBoats(state: DataState): BaseModel[] {
  return state.groupedItems.filter(
    (_model) => {
      if (isBoat(_model)) {
        const _searchFieldName = ListTypes[state.listType].search?.fieldName; 
        return nameMatches(getProperty(_model, _searchFieldName as keyof ResourceModel) + '', state.searchTerm) &&
        categoryMatches(_model.subType, state.selectedCategory) &&
        tagMatches(_model.tags, state.selectedTag);
      } else {
        return false;
      }
    }
  )
}

export function filterMemberships(state: DataState): BaseModel[] {
  return state.groupedItems.filter(
    (_model) => {
      if (isRelationship(_model)) {
        const _searchFieldName = ListTypes[state.listType].search?.fieldName; 
        const _yearFieldName = reduceYearFieldName(ListTypes[state.listType].year?.fieldName);
        const _dateStr = _model[_yearFieldName as keyof RelationshipModel] as string;
        const _year = (!_dateStr || _dateStr.length !== 8) ? 0 : Number(convertDateFormat(_dateStr, DateFormat.StoreDate, DateFormat.Year, false));
        return (
          nameMatches(getProperty(_model, _searchFieldName as keyof RelationshipModel)+'', state.searchTerm) &&
          categoryMatches(_model.subType, state.selectedCategory) &&
          numberMatches(_year, state.selectedYear) &&
          tagMatches(_model.tags, state.selectedTag));  
      } else {
        return false;
      }
    }
  )
}

export function filterOwnerships(state: DataState): BaseModel[] {
  return state.groupedItems.filter(
    (_model) => {
      if (isRelationship(_model)) {
        const _searchFieldName = ListTypes[state.listType].search?.fieldName; 
        return (
          nameMatches(getProperty(_model, _searchFieldName as keyof RelationshipModel)+'', state.searchTerm) &&
          categoryMatches(_model.objectCategory, state.selectedCategory) &&
          tagMatches(_model.tags, state.selectedTag));  
      } else {
        return false;
      }
    }
  )
}

export function filterSubjects(state: DataState): BaseModel[] {
  return state.groupedItems.filter(
    (_model) => {
      if (isSubject(_model)) {
        const _searchFieldName = ListTypes[state.listType].search?.fieldName; 
        const _yearFieldName = reduceYearFieldName(ListTypes[state.listType].year?.fieldName);
        const _dateStr = _model[_yearFieldName as keyof SubjectModel] as string;
        const _year = Number(convertDateFormat(_dateStr, DateFormat.StoreDate, DateFormat.Year, false));
        return (
          nameMatches(getProperty(_model, _searchFieldName as keyof SubjectModel)+'', state.searchTerm) &&
          categoryMatches(_model.category, state.selectedCategory) &&
          numberMatches(_year, state.selectedYear) &&
          tagMatches(_model.tags, state.selectedTag));  
      } else {
        return false;
      }
    }
  )
}

export function filterDocuments(state: DataState): BaseModel[] {
  return state.groupedItems.filter(
    (_model) => {
      if (isDocument(_model)) {
        const _searchFieldName = ListTypes[state.listType].search?.fieldName; 
        const _yearFieldName = reduceYearFieldName(ListTypes[state.listType].year?.fieldName);
        const _dateStr = _model[_yearFieldName as keyof DocumentModel] as string;
        const _year = Number(convertDateFormat(_dateStr, DateFormat.StoreDate, DateFormat.Year, false));
        return (
          nameMatches(getProperty(_model, _searchFieldName as keyof DocumentModel)+'', state.searchTerm) &&
          categoryMatches(_model.category, state.selectedCategory) &&
          numberMatches(_year, state.selectedYear) &&
          tagMatches(_model.tags, state.selectedTag));  
      } else {
        return false;
      }
    }
  )
}

export function filterEvents(state: DataState): BaseModel[] {
  return state.groupedItems.filter(
    (_model) => {
      if (isEvent(_model)) {
        const _searchFieldName = ListTypes[state.listType].search?.fieldName; 
        const _yearFieldName = reduceYearFieldName(ListTypes[state.listType].year?.fieldName);
        const _dateStr = _model[_yearFieldName as keyof EventModel] as string;
        const _year = Number(convertDateFormat(_dateStr, DateFormat.StoreDate, DateFormat.Year, false));
        return (
          nameMatches(getProperty(_model, _searchFieldName as keyof EventModel)+'', state.searchTerm) &&
          categoryMatches(_model.category, state.selectedCategory) &&
          numberMatches(_year, state.selectedYear) &&
          tagMatches(_model.tags, state.selectedTag));  
      } else {
        return false;
      }
    }
  )
}

export function filterResources(state: DataState): BaseModel[] {
  return state.groupedItems.filter(
    (_model) => {
      if (isResource(_model)) {
        const _searchFieldName = ListTypes[state.listType].search?.fieldName; 
        return nameMatches(getProperty(_model, _searchFieldName as keyof ResourceModel)+'', state.searchTerm) &&
          categoryMatches(_model.category, state.selectedCategory) &&
          tagMatches(_model.tags, state.selectedTag);  
      } else {
        return false;
      }
    }
  )
}

export function filterBaseModels(state: DataState): BaseModel[] {
  return state.groupedItems.filter(
    (_model) => {
      const _searchFieldName = ListTypes[state.listType].search?.fieldName; 
      return nameMatches(getProperty(_model, _searchFieldName as keyof BaseModel)+'', state.searchTerm) &&
        categoryMatches(_model.category, state.selectedCategory) &&
        tagMatches(_model.tags, state.selectedTag);
    }
  )
}

export function reduceYearFieldName(yearFieldName: string | undefined): string | undefined {
  if (!yearFieldName || yearFieldName.length === 0) return undefined;
  if (yearFieldName === 'dateOfFoundation') return 'dateOfBirth';   // map dateOfFoundation to dateOfBirth
  if (yearFieldName === 'dateOfLiquidation') return 'dateOfDeath';  // map dateOfLiquidation to dateOfDeath
  return yearFieldName;
}

/*-------------------------SORT --------------------------------------------*/
export function sortModels(models: BaseModel[], sortCriteria: SortCriteria): BaseModel[] {
  switch(sortCriteria.direction) {
    case SortDirection.Ascending: return sortAscending(models, sortCriteria.field, sortCriteria.typeIsString);
    case SortDirection.Descending: return sortDescending(models, sortCriteria.field, sortCriteria.typeIsString);
    default: return models;
  }
}

/*-------------------------HELPERS --------------------------------------------*/
/**
 * Pretty print properties of an object.
 * @param obj the object
 * @param full if false, only print a short version
 */
export function printProperties<T>(obj: T, full: boolean): string {
  if (obj === undefined) {
    return 'undefined';
  }
  if (obj === null) {
    return 'null';
  }
  let _msg = '';
  let _prefix = '';
  if (full === false) {
    if (isBaseModel(obj)) {
      return `${obj.bkey}/${obj.name}`
    }
    _prefix = 'unknown object: ';
  }
  for (const property in obj) {
    if (_msg.length > 16) {
      _msg += ', ';
    }
    _msg += `${property}: ${obj[property]}`;
  }
  return _prefix + _msg;
}

export function checkKey(model: BaseModel, key?: string): BaseModel {
  if (!model.bkey || model.bkey.length === 0) {
    warn('base-model.util.checkKey(): bkey is empty');
  }
  if (key && model.bkey !== key) {
    warn(`base-model.util.checkKey(): bkey mismatch: ${model.bkey} !== ${key}`);
    model.bkey = key;
  }
  return model;
}

/* ---------------------- Index operations -------------------------------*/
export function getBaseIndex(model: BaseModel, categories: Category[]): string {
  let _index = '';
  if (model) {
    _index = addIndexElement(_index, 'n', model.name);
    if (categories) {
      _index = addIndexElement(_index, 'c', getCategoryAbbreviation(categories, model.category));
    }
  }
  return _index;
}

export function getBaseIndexInfo(): string {
  return 'n:name c:category-abbreviation';
}

export function addIndexElement(index: string, key: string, value: string | number | boolean): string {
  if (!value || !key || key.length === 0) {
    return index;
  }
  if (typeof (value) === 'string') {
    if (value.length === 0 || (value.length === 1 && value.startsWith(' '))) {
      return index;
    }
  }
  return `${index} ${key}:${value}`;
}

/* ---------------------- Categories -------------------------------*/
/**
 * Retrieves categories based on the provided model type.
 * 
 * @param {ModelType} modelType - The type of the model for which categories are required.
 * @returns {Category[]} A list of categories corresponding to the given model type.
 * @throws dies when an unknown modelType is encountered.
 * 
 * @example
 * getCategoriesByModelType(ModelType.Address) // Returns AddressChannels
 * 
 * @see ModelType for possible model types.
 * @see Category for possible return types.
 */
export function getCategoriesByModelType(modelType: ModelType): Category[] {
  switch (modelType) {
    case ModelType.Address: return AddressChannels;
    case ModelType.Application: return ApplicationTypes;
    case ModelType.Boat: return BoatTypes;
    case ModelType.Comment: return [];
    case ModelType.Document: return DocumentTypes;
    case ModelType.Event: return EventTypes;
    case ModelType.HouseKey: return ResourceTypes;
    case ModelType.Location: return LocationTypes;
    case ModelType.Locker: return ResourceTypes;
    case ModelType.Org: return OrgTypes;
    case ModelType.Person: return GenderTypes;
    case ModelType.Relationship: return RelationshipTypes;
    case ModelType.Relnote: return [];
    case ModelType.Resource: return ResourceTypes;
    case ModelType.User: return [];
    case ModelType.Page: return [];
    case ModelType.Section: return SectionTypes;
    default: die(`BaseModelUtil.getCategoriesByModelType -> unknown modelType ${modelType}`);
  }
}

/**
 * This method can be used as a compare method in filters.
 * It returns true if the filter criteria (catFilter) is either ALL or matches the given property (catProperty).
 * @param catProperty the category to test
 * @param catFilter the category filter (can be explicit or ALL)
 * @returns true if the categories match
 */
export function categoryMatches(catProperty: number, catFilter: number | null | undefined): boolean {
  if (catFilter === null || catFilter === undefined || catFilter === CategoryType.All) return true;
  return catProperty === catFilter;
}


/* ---------------------- helpers -------------------------------*/

/**
 * Determine the color to highlight test and archived items in a list.
 *   --bk-test-color: #ccffff;
 *   --bk-archived-color: #ffcc99;
 * @param isTest  it is a test item
 * @param isArchived  it is an archived item
 */
export function getListItemColor(isTest: boolean, isArchived: boolean): string {
  let _color = '';
  if (isTest === true) {
    _color = 'light';
  } else if (isArchived === true) {
    _color = 'dark';
  }
  return _color;
}
