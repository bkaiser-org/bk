import { Injectable, inject } from "@angular/core";
import { BaseModel } from "@bk/models";
import { AlertController, ToastController } from "@ionic/angular";
import { Observable, firstValueFrom } from "rxjs";
import { ActionType, DbQuery, QueryValueType } from "@bk/categories";
import { createModel, createObject, deleteModel, deleteObject, readModel, readObject, updateModel, updateObject, updateOrCreateModel } from "./base-model/base-model.util";
import { listAllFromCollectionGroup, listAllModels, listAllObjects, listModelsBySingleQuery, searchData } from "./search.util";
import { bkTranslate, ConfigService, die, FIRESTORE } from "@bk/util";
import { query, collection } from "firebase/firestore";
import { collectionData } from "rxfire/firestore";


@Injectable({
  providedIn: 'root'
})
export abstract class DataService {
  private firestore = inject(FIRESTORE);
  private toastController = inject(ToastController);
  private alertController = inject(AlertController);
  private configService = inject(ConfigService);

  private tenantId = this.configService.getConfigString('tenant_id');

  /**
   * Save a model as a new Firestore document into the database.
   * @param collectionName the name of the Firestore collection
   * @param model the model to save in Firestore
   * @param i18nPrefix The prefix for internationalized confirmation and error messages. 
   * ¨      Expected to have .conf for success and .error for failure translations.
   *        if undefined, no confirmation toast is shown.
   * @returns the key of the saved model
   */
  public async createModel(collectionName: string, model: BaseModel, i18nPrefix?: string): Promise<string> {
    return createModel(this.firestore, collectionName, model, this.tenantId, i18nPrefix, this.toastController);
  }

  /**
   * Save an object as a new Firestore document into the database.
   * Use this method to save any other object than a model. For models, use createModel().
   * @param collectionName the name of the Firestore collection
   * @param object the object to store in the database
   * @param key the key of the object in the database
   * @param i18nPrefix The prefix for internationalized confirmation and error messages. 
   * ¨      Expected to have .conf for success and .error for failure translations.
   *        if undefined, no confirmation toast is shown
   * @returns the key of the object
   */
  public async createObject(collectionName: string, object: object, key:string | undefined, i18nPrefix?: string): Promise<string> {
    return createObject(this.firestore, collectionName, object, key, i18nPrefix, this.toastController);
  }

  /**
   * Lookup a model in the Firestore database and return it as an Observable
   * @param collectionName the name of the Firestore collection
   * @param key the key of the model in the database
   * @param isStrict if true, throw an error if the model is not found, otherwise return undefined
   * @returns an Observable of the model
   */
  public readModel(collectionName: string, key: string | undefined, isStrict = true): Observable<BaseModel | undefined> {
    return readModel(this.firestore, collectionName, key, isStrict);
  }

  public async readModels(collectionName: string, keys: string[]): Promise<BaseModel[]> {
    if (!keys?.length) die('DataService.loadModels: keys is mandatory.' );
    // loop over all async reads and wait for all to complete
    const _models: BaseModel[] = [];
    const _promises = keys.map(async key => {
      const _model = await firstValueFrom(readModel(this.firestore, collectionName, key));
      if (_model) _models.push(_model);
    });
    await Promise.all(_promises);
    return _models; 
  }

  /**
   * Lookup an object in the Firestore database and return it as an Observable
   * @param collectionName the name of the Firestore collection
   * @param key the document id of the object in the database
   * @returns an Observable of the object
   */
  public readObject(collectionName: string, key: string): Observable<unknown> {
    return readObject(this.firestore, collectionName, key);
  }

  /**
   * Update an existing model with new values.
   * @param collectionName the name of the Firestore collection
   * @param model the model with the new values
   * @param i18nPrefix The prefix for internationalized confirmation and error messages. 
   * ¨      Expected to have .conf for success and .error for failure translations.
   *        if undefined, no confirmation toast is shown.
   * @returns the key of the updated model
   */
  public async updateModel(collectionName: string, model: BaseModel, i18nPrefix?: string): Promise<string> {
    return updateModel(this.firestore, collectionName, model, i18nPrefix, this.toastController);
  }

  /**
   * Update an existing model with new values.
   * @param collectionName the name of the Firestore collection
   * @param model the model with the new values
   * @param i18nPrefix The prefix for internationalized confirmation and error messages. 
   * ¨      Expected to have .conf for success and .error for failure translations.
   *        if undefined, no confirmation toast is shown.
   * @returns the key of the updated model
   */
  public async updateObject(collectionName: string, key: string, object: unknown, i18nPrefix?: string): Promise<string> {
    return updateObject(this.firestore, collectionName, key, object, i18nPrefix, this.toastController);
  }

  /**
   * Create (if the model has no id) or update (if the model has an id) a model and show a confirmation toast.
   * @param collectionName the name of the Firestore collection
   * @param model the model with the new values
   * @param i18nPrefix the prefix for the translations; expected to have 'create|update.conf|error' for success failure message translatios.
   * @param action the type of the update (create or update)
   * @param i18nPrefix The prefix for internationalized confirmation and error messages. 
   * ¨      Expected to have .conf for success and .error for failure translations.
   *        if undefined, no confirmation toast is shown.

   * @returns the key of the updated model
   */
  public async updateOrCreateModel(collectionName: string, model: BaseModel, action: ActionType, i18nPrefix?: string): Promise<string> {
    return updateOrCreateModel(this.firestore, collectionName, model, action, this.tenantId, i18nPrefix, this.toastController);
  }

  /**
   * Non-destructively Delete a model from the Firestore database. The model is just deactivated.
   * For physical deletion, an admin user needs to permanently delete the object directly in the database.
   * @param collectionName the name of the Firestore collection
   * @param model the model to be deleted
   * @param i18nPrefix The prefix for internationalized confirmation and error messages. 
   * ¨      Expected to have .conf for success and .error for failure translations
   *        as well as .label and .askConfirmation for the Alert messages.
   *        if undefined, no confirmation toast nor alert message is shown.
   */
  public async deleteModel(collectionName: string, model: BaseModel, i18nPrefix?: string): Promise<void> {
    if (i18nPrefix !== undefined && i18nPrefix.length > 0) {
        const _alert = await this.alertController.create({
            header: bkTranslate(i18nPrefix + '.label'),
            message: bkTranslate(i18nPrefix + '.askConfirmation'),
            buttons: [{
                text: bkTranslate('@general.operation.change.cancel')
            }, {
                text: bkTranslate('@general.operation.change.ok'),
                handler: async () => {
                  await deleteModel(this.firestore, collectionName, model, i18nPrefix, this.toastController);
                }
            }]
        });
        await _alert.present();
    } else {
      await deleteModel(this.firestore, collectionName, model, i18nPrefix, this.toastController);
    }
  }

  /**
   * Delete an object in the database.
   * We do not delete objects permanently. Instead we deactivate the objects.
   * Therefore, object attribute isArchived is set to true.
   * Admin users may permanently delete objects directly in the database.

  * @param collectionName the name of the Firestore collection to delete the model from
  * @param key the document id of the object in the database
  * @param i18nPrefix The prefix for internationalized confirmation and error messages. 
  * ¨      Expected to have .conf for success and .error for failure translations.
  *        if undefined, no confirmation toast is shown.
  * @returns a void Promise
  */
  public async deleteObject(collectionName: string, key: string, i18nPrefix?: string): Promise<void> {
    if (i18nPrefix !== undefined && i18nPrefix.length > 0) {
      const _alert = await this.alertController.create({
          header: bkTranslate(i18nPrefix + '.label'),
          message: bkTranslate(i18nPrefix + '.askConfirmation'),
          buttons: [{
              text: bkTranslate('@general.operation.change.cancel')
          }, {
              text: bkTranslate('@general.operation.change.ok'),
              handler: async () => {
                await deleteObject(this.firestore, collectionName, key, i18nPrefix, this.toastController)
              }
          }]
      });
      await _alert.present();
    } else {
      await deleteObject(this.firestore, collectionName, key, i18nPrefix, this.toastController)
    }
  }

  /**
   * List all models of a collection in the Firestore database.
   * @param collectionName the name of the Firestore collection
   * @param tenantId the tenant id
   * @param orderBy the field to order the list by
   * @param sortOrder the sort order (asc or desc)  
   * @returns 
   */
  public listAllModels(collectionName: string, orderBy = 'name', sortOrder = 'asc'): Observable<BaseModel[]> {
      return listAllModels(this.firestore, collectionName, this.tenantId, orderBy, sortOrder);
  }

  /**
   * Lists all models of a given collection in the Firestore database without applying any queries nor sorting.
   * @param collectionName 
   * @returns 
   */
  public listAllModelsRaw(collectionName: string): Observable<BaseModel[]> {
    const _ref = query(collection(this.firestore, collectionName));
    return collectionData(_ref) as Observable<BaseModel[]>;
  }

  /**
   * List all objects of a collection in the Firestore database.
   * @param collectionName the name of the Firestore collection
   * @param orderBy optional field to order the list by
   * @param sortOrder optional sort order (asc or desc)  
   * @returns an Observable array of the data
   */
    public listAllObjects(collectionName: string, orderBy?: string, sortOrder?: string): Observable<unknown[]> {
      return listAllObjects(this.firestore, collectionName, orderBy, sortOrder);
    }

  /**
   * List all non-archived, non-test models of a collection in the Firestore database that match a single query.
   * @param collectionName the name of the Firestore collection
   * @param searchKey the field to search by
   * @param value the value to search for
   * @param operator the operator to use for the search (==, >, <, >=, <=, !=, array-contains, in, array-contains-any), default is to check for equality
   * @param orderBy the field to order the list by
   * @param sortOrder the sort order (asc or desc)
   * @returns an Observable of an array of selected models
   */
  public listModelsBySingleQuery(collectionName: string, searchKey: string, value: QueryValueType, operator = '==', orderBy = 'name', sortOrder = 'asc'): Observable<BaseModel[]> {
      return listModelsBySingleQuery(this.firestore, collectionName, this.tenantId, searchKey, value, operator, orderBy, sortOrder);
  }

  /**
   * Return all items of a collection group.
   * @param collectionName 
   * @returns all items of the collection group
   */
  public listAllFromCollectionGroup(collectionName: string): Observable<unknown[]> {
    return listAllFromCollectionGroup(this.firestore, collectionName);
  }

  /**
   * Search for models in the Firestore database that match a list of queries.
   * tbd: the values of isTest and isArchived should be taken from the user settings. But injecting UserService results in a circular dependency.
   * @param collectionName the name of the Firestore collection
   * @param dbQuery the list of queries
   * @param orderBy the field to order the list by
   * @param sortOrder the sort order (asc or desc)
   * @returns an Observable of an array of selected models
   */
  public searchData(collectionName: string, dbQuery: DbQuery[], orderBy = 'name', sortOrder = 'asc', useSystemQuery = true): Observable<BaseModel[]> {
    if (useSystemQuery) {
      dbQuery.push({ key: 'isTest', operator: '==', value: false });
      dbQuery.push({ key: 'isArchived', operator: '==', value: false });
      dbQuery.push({ key: 'tenant', operator: '==', value: this.tenantId })
    }
    return searchData(this.firestore, collectionName, dbQuery, orderBy, sortOrder);  
  }
}