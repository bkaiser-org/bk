import { DateFormat, getTodayStr } from "@bk/util";
import { CommentModel } from "@bk/models";

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



