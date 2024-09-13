import { CollectionNames, DateFormat, die, getTodayStr } from "@bk/util";
import { CommentModel, UserModel } from "@bk/models";

/* ---------------------- Model  -------------------------------*/
 /**
   * Convenience function to create a new CommentModel with given values.
   * @param authorKey 
   * @param authorName 
   * @param commentStr 
   * @returns the created CommentModel
   */
export function createComment(authorKey: string, authorName: string, commentStr: string, parentCollection: string, parentKey: string): CommentModel {
  const _comment = new CommentModel();
  _comment.authorKey = authorKey;
  _comment.name = authorName;
  _comment.description = commentStr;
  _comment.creationDate = getTodayStr(DateFormat.StoreDate);
  _comment.parentKey = parentKey;
  _comment.parentCollection = parentCollection;
  return _comment;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function saveComment(dataService: any, currentUser: UserModel | undefined, collectionName: string, parentKey: string | undefined, comment: string): Promise<void> {
  if (!currentUser) die('comment.util.saveComment: inconsistent app state: there is no current user.');
  const _key = currentUser.bkey ?? die('comment.util.saveComment: inconsistent app state: current user has no key.');
  if (!parentKey) die('comment.util.saveComment: inconsistent app state: there is no parentKey.');
  const _comment = createComment(_key, currentUser.personName, comment, collectionName, parentKey);
  await dataService.createModel(`${collectionName}/${parentKey}/${CollectionNames.Comment}`, _comment);
}
