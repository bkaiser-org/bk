import { ModelType } from '@bk/categories';
import { BaseModel } from '../base/base.model';

export const DOCUMENT_DIR = 'documents';
export const EZS_DIR = 'ezs';

export class DocumentModel extends BaseModel {
  // tbd: add md5hash
  // { name: 'md5hash', label: 'model.document.field.md5hash', value: false },
  //   public md5hash: string;  // from firestorage

  // name: this must match with the name of the file in firebase storage (fileName + . + extension)
  // description: a human-readable, translatable file name (i18n)
  // category: DocumentType
  // url: url of the original file
  // creationDate = firestorage timeCreated
  // lastUpdate = firestorage updated
  // firestorage fullPath = dir + / + fileName + . + extension
    public dir = '';
    public fileName = ''; // the file name without extension
    public extension = '';
    public mimeType = '';  // = firestorage:  contentType
    public thumbUrl = ''; // the url of the thumbnail
    public size = 0;
    public title = ''; // e.g. short image title
    public altText = ''; // alternate text for images (default = name)
    public authorKey = '';  // the author of the document, does not need to be the same as the person that save the file
    public authorName = ''; // the author of the document, does not need to be the same as the person that save the file
    public dateOfDocCreation = ''; // the date the document was created
    public dateOfDocLastUpdate = ''; // the date the document was last updated
    public locationKey = ''; // the location where an image was taken 
    public md5hash = ''; // md5hash value of the file
    public priorVersionKey = '';
    public version = '';
  

    constructor() {
        super();
        this.modelType = ModelType.Document;
    }
}
