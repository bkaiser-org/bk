import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { error, CollectionNames, die } from '@bk/util';
import { DataService } from '@bk/base';
import { ModelType } from '@bk/categories';
import { UserModel } from '@bk/models';
import { ToastController } from '@ionic/angular';
import { getUserIndex } from './user.util';
import { AuthService } from '@bk/auth';

export enum SearchKey {
    FirebaseUid = 'bkey',
    LoginEmail = 'loginEmail',
    PersonKey = 'personKey',
    PersonName = 'personName',
}

@Injectable({
    providedIn: 'root'
})
export class UserService  {
  private dataService = inject(DataService);
  private authService = inject(AuthService);
  private toastController = inject(ToastController);
  public modelType = ModelType.User;

  /* ---------------------- Standard CRUD operations -------------------------------*/
  /**
   * Save a new document into the database and return its uid.
   * The document ID is assigned manually to the value of the firebase user id (for both bkey and document id).
   * @param user the new document to save
   */
  public async create(user: UserModel): Promise<string | null> {
    return await this.dataService.createModel(CollectionNames.User, user, '@user.operation.create');
  }

    /**
     * Lookup an object by its primary key in the database and return an Observable of the document.
     * The document id of the user collection is the same as the firebase user id.
     * @param key the document id of the object in the database
     */
    public read(key: string | undefined): Observable<UserModel | undefined> {
      return this.dataService.readModel(CollectionNames.User, key, false) as unknown as Observable<UserModel>;
    }

    /**
     * Lookup users by their loginEmail. LoginEmail should be unique, therefore there should be one or none element in the result.
     * @param loginEmail the email address that the user is registered with
     * @returns an array of users that have the given email address registered as their loginEmail.
     */
    public readByLoginEmail(loginEmail: string): Observable<UserModel[]> {
        return this.search(SearchKey.LoginEmail, loginEmail);
    }

    /**
     * Lookup users by their person key. Normally, a single person should only have one single user account.
     * Therefore there should be one or none element in the result.
     * @param personKey the document id of the PersonModel that relates to this user
     * @returns an array of users that have the given personKey registered.
     */
    public readByPersonKey(personKey: string): Observable<UserModel[]> {
        return this.search(SearchKey.PersonKey, personKey);
    }

    /**
     * Update a document with the values of the given document.
     * Update is for non-destructive updates, ie. it updates the current value
     * within the database with the new value specified as the parameter.
     * Dest
     * @param user the new user values
     */
    public async update(user: UserModel): Promise<void> {
      await this.dataService.updateModel(CollectionNames.User, user, '@user.operation.update');
    }

    /**
     * Delete the user.
     * @param user: the user to delete
     */
    public async delete(user: UserModel): Promise<void> {
      await this.dataService.deleteModel(CollectionNames.User, user, '@user.operation.delete');
    }

    /**
     * Return all documents in the collection as an Observable.
     */
    public list(orderBy = SearchKey.FirebaseUid, sortOrder = 'asc'): Observable<UserModel[]> {
      return this.dataService.listAllModels(CollectionNames.User, orderBy, sortOrder) as unknown as Observable<UserModel[]>;
    }

    /**
     * Search for a user by a single search parameter.
     * Search parameter must be uid, loginEmail or person.bkey.
     * @param searchKey the name of the search parameter
     * @param valueParam the value to look for (equality)
     * @param orderBy the list is sorted according to this attribute
     */
    public search(searchKey: SearchKey, valueParam: string | number | boolean, orderBy = SearchKey.PersonName, sortOrder = 'asc'): Observable<UserModel[]> {
      return this.dataService.listModelsBySingleQuery(CollectionNames.User, searchKey, valueParam, '==', orderBy, sortOrder) as unknown as Observable<UserModel[]>;
    }

  /**
   * Creates a new user account associated with the specified email address and password.
   * Check whether a Firebase account already exists for this email address. If not, create the account.
   * On successful creation of the user account, this new user is signed in. That's why we update the user to the former current user.
   * User account creation can fail if the account already exists and the password is invalid.
   * see https://stackoverflow.com/questions/37517208/firebase-kicks-out-current-user/38013551#38013551
   * for solutions to solve this admin function on the client side without being looged out. 
   * @param user 
   */
  public async createUserAndAccount(user: UserModel): Promise<void> {
    if (!user.loginEmail || user.loginEmail.length === 0) die('UserService.createUserAndAccount: loginEmail is missing - can not register this user');
    try {
      const _uid = await this.authService.createFirebaseAccount(user.loginEmail);
      if (_uid) {      // the Firebase account exists, now create the user
          user.bkey = _uid;
          user.index = getUserIndex(user);
          await this.create(user);
      } 
    }
    catch (_ex) {
      error(this.toastController, 'UserService.createUserAndAccount -> error: ' + JSON.stringify(_ex));
    }
  }
}
