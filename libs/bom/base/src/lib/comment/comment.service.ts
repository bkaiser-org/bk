import { Injectable, inject } from "@angular/core";
import { Observable, of } from "rxjs";
import { CollectionNames, DateFormat, die, getTodayStr, warn } from "@bk/util";
import { CommentModel } from "@bk/models";
import { DataService } from "../models/data.service";
import { createComment } from "./comment.util";
import { AuthorizationService } from "../authorization/authorization.service";

@Injectable({
    providedIn: 'root'
})
export class CommentService {
    public authorizationService = inject(AuthorizationService);
    private dataService = inject(DataService);

  /* ---------------------- CRUD operations -------------------------------*/

  /**
   * Comments can not be deleted nor edited. They can only be created.
   * The only way to change or delete a comment is directly in the database.
   * Comment entries in the description property can be written in i18n notation (starting with @, e.g. @comment.operation.initial.conf).
   * Such a comment is translated in the template view.
   */
  /**
   * Save a new comment into the database to a given model.
   * @param collectionName the  name of the parent collection
   * @param parentKey the key of the parent object
   * @param comment the new comment to save
   */
  public async  createComment(collectionName: string | undefined, parentKey: string | undefined, comment: string | undefined): Promise<void> {
    if (!collectionName || collectionName.length === 0 || !parentKey || parentKey.length === 0 || !comment || comment.length === 0) {
      warn('CommentService.createComment: collectionName, parentKey and comment are mandatory.');
      return;
    }
    const _user = this.authorizationService.currentUser() ?? die('CommentService.createComment: inconsistent app state: there is no current user.');
    const _commentModel = createComment(_user.personKey, _user.personName, comment, collectionName, parentKey);
    if (!_commentModel.creationDate) _commentModel.creationDate = getTodayStr(DateFormat.StoreDateTime);
    await this.dataService.createModel(`${collectionName}/${parentKey}/${CollectionNames.Comment}`, _commentModel);
  }

  /**
   * Read a comment from the database as an Observable of a comment by id.
   * @param collectionName the  name of the parent collection
   * @param parentKey the key of the parent object
   * @param commentKey the unique id of the comment to read (comment Key)
   */
  public readComment(collectionName: string, parentKey: string, commentKey: string): Observable<CommentModel> {
    return this.dataService.readModel(`${collectionName}/${parentKey}/${CollectionNames.Comment}`, commentKey) as Observable<CommentModel>;
  }
  
  /**
   * Return all comments in the collection as an Observable.
   * @param collectionName the  name of the parent collection
   * @param parentKey the key of the parent object
   */
  public listComments(collectionName: string, parentKey: string): Observable<CommentModel[]> {
    if (collectionName?.length === 0 || parentKey?.length === 0) {
      return of([]);
    }
    return this.dataService.listAllModels(`${collectionName}/${parentKey}/${CollectionNames.Comment}`, 'creationDate', 'desc') as Observable<CommentModel[]>;
  }
}