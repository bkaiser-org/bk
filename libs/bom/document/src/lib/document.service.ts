import { Injectable, inject } from '@angular/core';
import { BaseService } from '@bk/base';
import { DocumentType, ModelType, RelationshipType, getModelSlug } from '@bk/categories';
import { Observable, of } from 'rxjs';
import { BaseModel, DocumentModel, Image } from '@bk/models';
import { CollectionNames, DateFormat, STORAGE, convertDateFormatToString, dirname, error, fileSizeUnit, generateRandomString, getThumbnailUrl, getTodayStr } from '@bk/util';
import { getDocumentIndex, getDocumentIndexInfo, getDocumentStoragePath } from './document.util';
import { ref, getDownloadURL, getMetadata, listAll, FullMetadata } from "firebase/storage";
import { ModalController } from '@ionic/angular/standalone';
import { ImageSelectModalComponent } from './image-select.modal';

@Injectable({
  providedIn: 'root'
})
export class DocumentService extends BaseService {
  private readonly modalController = inject(ModalController);
  private readonly storage = inject(STORAGE);

  /*-------------------------- CRUD operations --------------------------------*/
  /**
   * Save a new document into the database.
   * @param document the new document to be saved
   * @returns the document id of the new DocumentModel in the database
   */
  public async createDocument(document: DocumentModel): Promise<string> {
    document.index = getDocumentIndex(document);
    return this.dataService.createModel(CollectionNames.Document, document, `@${getModelSlug(document.modelType)}.operation.create`);
  }

  /**
   * Save a new document into the database based on a file and its full path.
   * @param fullPath 
   * @param file 
   */
  public async saveDocumentInDatabase(fullPath: string, file: File) {
    await this.createDocument(await this.getDocumentFromFile(file, fullPath));
  }

  /**
   * Read a document from the database by returning an Observable of a DocumentModel by uid.
   * @param firestore a handle to the Firestore database
   * @param uid the key of the model document
   */
  public readDocument(key: string): Observable<DocumentModel> {
    this.currentKey$.next(key);
    return this.dataService.readModel(CollectionNames.Document, key) as Observable<DocumentModel>;
  }

  /**
   * Update an existing document with new values.
   * @param document the DocumentModel with the new values
   */
  public async updateDocument(document: DocumentModel): Promise<void> {
    document.index = getDocumentIndex(document);
    await this.dataService.updateModel(CollectionNames.Document, document, `@${getModelSlug(document.modelType)}.operation.update`);
  }

  /**
   * Delete an existing document in the database by archiving it.
   * @param document the DocumentModel to be deleted.
   */
  public async deleteDocument(document: DocumentModel): Promise<void> {
    document.isArchived = true;
    await this.dataService.updateModel(CollectionNames.Document, document, `@${getModelSlug(document.modelType)}.operation.delete`);
  }

  /*-------------------------- LIST  --------------------------------*/
 /**
   * List all documents.
   * @param orderBy 
   * @param sortOrder 
   * @returns 
   */
  public listAllDocuments(orderBy = 'name', sortOrder = 'asc'): Observable<DocumentModel[]> {
    return this.dataService.listAllModels(CollectionNames.Document, orderBy, sortOrder) as Observable<DocumentModel[]>;
  }

  public listDocuments(modelType: ModelType, key: string, relationshipType?: RelationshipType): Observable<DocumentModel[]> {
    const _dir = getDocumentStoragePath(this.env.auth.tenantId, modelType, key, relationshipType);
    return _dir ? this.listDocumentsFromDirectory(_dir) : of([]);
  }

  public listDocumentsFromDirectory(dir: string): Observable<DocumentModel[]> {
    return this.dataService.listModelsBySingleQuery(CollectionNames.Document, 'dir', dir) as Observable<DocumentModel[]>;
  }

  public async listDocumentsFromStorageDirectory(modelType: ModelType, key: string, relationshipType?: RelationshipType): Promise<DocumentModel[]> {
    const _docs: DocumentModel[] = [];
    const _path = getDocumentStoragePath(this.env.auth.tenantId, modelType, key, relationshipType);
    const _ref = ref(this.storage, _path);
    try {
      const _items = await listAll(_ref);
      await Promise.all(_items.items.map(async (_item) => {
        const _metadata = await getMetadata(_item);
        const _doc = await this.convertStorageMetadataToDocumentModel(_metadata);
        _docs.push(_doc);
      }));
    }
    catch(_ex) {
      error(undefined, 'DocumentService.listDocumentsFromStorageDirectory: ERROR: ' + JSON.stringify(_ex));
    }
    return _docs;
  }

  /*-------------------------- UPLOAD -------------------------------*/
  public async pickAndUploadImage(key: string): Promise<Image | undefined> {
    const _modal = await this.modalController.create({
      component: ImageSelectModalComponent,
      cssClass: 'wide-modal',
      componentProps: {
        key: key
      }
    });
    _modal.present();

    const { data, role } = await _modal.onWillDismiss();
    if(role === 'confirm') {
      return data as Image;
    }
    return undefined;
  }

  /*-------------------------- SEARCH -------------------------------*/
  public getSearchIndex(item: BaseModel): string {
    return getDocumentIndex(item);
  }

  public getSearchIndexInfo(): string {
    return getDocumentIndexInfo();
  }
  
  /*-------------------------- CONVERSION --------------------------------*/
  /**
   * Convert a file to a DocumentModel.
   * @param file the file to convert
   * @param fullPath the full path of the file (/dir/filename.extension)
   * @returns the DocumentModel
   */
  public async getDocumentFromFile(file: File, fullPath: string): Promise<DocumentModel> {
    const _doc = new DocumentModel();
    _doc.name = file.name;
    _doc.fileName = file.name.split('.')[0];
    _doc.extension = file.name.split('.')[1];
    _doc.description = '';
    _doc.category = DocumentType.InternalFile;

    _doc.url = await getDownloadURL(ref(this.storage, fullPath));
    // _doc.url = getImgixUrl(fullPath, undefined);
    _doc.thumbUrl = getThumbnailUrl(fullPath, this.env.thumbnail.width, this.env.thumbnail.height);
    _doc.dateOfDocCreation = getTodayStr();
    _doc.dateOfDocLastUpdate = getTodayStr();
    _doc.dir = dirname(fullPath);
    _doc.mimeType = file.type;
    _doc.size = file.size;
    _doc.priorVersionKey = '';
    _doc.version = '1.0.0';
    _doc.isArchived = false;
    _doc.isTest = false;
    return _doc;
  }

  private async convertStorageMetadataToDocumentModel(metadata: FullMetadata): Promise<DocumentModel> {
    const _doc = new DocumentModel();
    _doc.bkey = generateRandomString(10);
    _doc.name = metadata.name;
    _doc.fileName = metadata.name.split('.')[0];
    _doc.extension = metadata.name.split('.')[1];
    _doc.description = '';
    _doc.category = DocumentType.InternalFile;
    _doc.url = await getDownloadURL(ref(this.storage, metadata.fullPath));
    //_doc.url = getImgixUrl(metadata.fullPath, undefined);
    _doc.thumbUrl = getThumbnailUrl(metadata.fullPath, this.env.thumbnail.width, this.env.thumbnail.height);
    _doc.dateOfDocCreation = convertDateFormatToString(metadata.timeCreated.substring(0, 10), DateFormat.IsoDate, DateFormat.StoreDate);
    _doc.dateOfDocLastUpdate = convertDateFormatToString(metadata.updated.substring(0, 10), DateFormat.IsoDate, DateFormat.StoreDate);
    _doc.dir = dirname(metadata.fullPath);
    _doc.mimeType = metadata.contentType ?? '';
    _doc.size = metadata.size;
    _doc.priorVersionKey = '';
    _doc.version = '1.0.0';
    _doc.isArchived = false;
    _doc.isTest = false;
    _doc.md5hash = metadata.md5Hash ?? '';
    return _doc;
  }
  
  /*-------------------------- STORAGE --------------------------------*/
  /**
   * Check if a document exists at a specific location in the storage.
   * @param fullPath the specific location in the storage
   * @param isStrict if true, the functiond throws an error if the document does not exist
   * @returns true if the document exists in the given storage location, false otherwise
   */
  public async doesDocumentExistInStorage(fullPath: string, isStrict = true): Promise<boolean> {
    try {
      await getDownloadURL(ref(this.storage, fullPath));
      return true;
    }
    catch {
      if (isStrict === true) {
        error(undefined, 'DocumentService.doesDocumentExistInStorage: ERROR: document ' + fullPath + ' does not exist in storage.');
      }
      return false;
    }
  }

  /**
   * Returns the size of a document.
   * @param path the full path of the document in the storage
   * @returns the size of the document in bytes or undefined if the document does not exist
   */
  public async getSize(path: string): Promise<number | undefined>{
    const _ref = ref(this.storage, path);
    try {
      const _metadata = await getMetadata(_ref);
      console.log('DocumentService.getSize: metadata: ' + JSON.stringify(_metadata));
      return _metadata.size;
    }
    catch(_ex) {
      error(undefined, 'DocumentService.getSize: ERROR: ' + JSON.stringify(_ex));
    }
    return undefined;
  }

  /**
   * Calculates the sum of the sizes of all files in a given path.
   * items = files, prefixes = folders
   * @param path a directory in the storage
   * @param isRecursive 
   */
  public async calculateStorageConsumption(path: string, isRecursive = false): Promise<void> {
    const _ref = ref(this.storage, path);
    let _totalSize = 0;
    console.log('Calculating storage consumption for ' + path);
    try {
      const _result = await listAll(_ref);
      for (const _item of _result.items) {
        const _size = (await getMetadata(_item)).size;
        console.log('    ' + _item.fullPath + ': ' + _size);
        _totalSize += _size;
      }
      console.log(path + ': ' + _result.items.length + ' files with ' + fileSizeUnit(_totalSize));
      if (isRecursive === true) {
        for (const _prefix of _result.prefixes) {
          await this.calculateStorageConsumption(_prefix.fullPath, true);
        }
      }
    }
    catch(_ex) {
      error(undefined, 'DocumentService.calculateStorageConsumption: ERROR: ' + JSON.stringify(_ex));
    }
  }

  /**
   * Print the metadata of a document in the storage for debugging purposes.
   * @param path the full path of the document in the storage
   */
  public async getRefInfo(path: string): Promise<void> {
    const _ref = ref(this.storage, path);
    console.log(_ref.fullPath + ': ');
    try {
      const _metadata = await getMetadata(_ref);
      console.log('    contentType: ' + _metadata.contentType);
      console.log('    size: ' + fileSizeUnit(_metadata.size));
      console.log('    created: ' + _metadata.timeCreated);
      console.log('    hash: ' + _metadata.md5Hash);
    }
    catch(_ex) {
      console.log('    no metadata; probably it is a folder.');
    }
  }
}