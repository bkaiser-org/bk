import { addIndexElement } from '@bk/base';
import { DocumentTypes, ModelType, RelationshipType, getCategoryAbbreviation, getModelSlug, getSlugFromRelationshipType } from '@bk/categories';
import { BaseModel, DOCUMENT_DIR, DocumentModel, isDocument } from '@bk/models';
import { readAsFile, UploadTaskComponent } from '@bk/ui';
import { checkUrlType, warn } from '@bk/util';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { FilePicker } from '@capawesome/capacitor-file-picker';
import { ModalController, Platform } from '@ionic/angular/standalone';

/* ---------------------- Index operations -------------------------*/
/**
 * Create the index for a document.
 * @param document 
 * @returns 
 */
export function getDocumentIndex(document: BaseModel): string {
  let _index = '';
  if (isDocument(document)) {
    _index = addIndexElement(_index, 'n', document.name);
    _index = addIndexElement(_index, 'c', getCategoryAbbreviation(DocumentTypes, document.category));
    _index = addIndexElement(_index, 'e', document.extension);
    _index = addIndexElement(_index, 'd', document.dir);
  }
  return _index;
}

/**
 * Returns a string explaining the structure of the index.
 * This can be used in info boxes on the GUI.
 */
export function getDocumentIndexInfo(): string {
  return 'n:name c:documentTypeAbbreviation e:extension, d:directory';
}

/*-------------------------- UPLOAD --------------------------------*/
/**
 * Shows as a file dialog and lets the user choose file from the local file system.
 * @param mimeTypes a list of mime types to filter the file dialog (e.g. ['image/png', 'image/jpg', 'application/pdf'])
 * @returns the selected file or undefined if the file dialog was cancelled
 */
export async function pickFile(mimeTypes: string[]): Promise<File | undefined> {
  const _result = await FilePicker.pickFiles({
    types: mimeTypes
  });
  if (_result.files.length !== 1) {
    warn('document.util.pickFile: expected 1 file, got ' + _result.files.length);
    return undefined;
  }
  const _blob = _result.files[0].blob;
  if (!_blob) {
    warn('document.util.pickFile: blob is mandatory.');
    return undefined;
  }
  const _file = new File([_blob], _result.files[0].name, {
    type: _result.files[0].mimeType
  });
  return _file;
}

/**
 * Uploads a file to the storage location and shows a progress bar.
 * @param file the document to upload
 * @param storageLocation an URL to the storage location, i.e. the folder where the file should be stored
 * @returns the full path of the uploaded file or undefined if the upload was cancelled
 */
export async function uploadFile(modalController: ModalController, file: File, storageLocation: string): Promise<string | undefined> {
  console.log('uploadFile: file =', file, 'storageLocation =', storageLocation, 'fullPath =', storageLocation + '/' + file.name);
  const _modal = await modalController.create({
    component: UploadTaskComponent,
    cssClass: 'upload-modal',
    componentProps: {
      file: file,
      fullPath: storageLocation + '/' + file.name,
      title: '@document.operation.upload.single.title'
    }
  });
  _modal.present();

  const { role } = await _modal.onWillDismiss();
  return ( role === 'confirm') ? storageLocation + '/' + file.name : undefined;
}

/**
 * Uploads a file to a specific model.
 * @param modalController the modal controller to show the upload progress
 * @param tenantId the tenant of the model
 * @param file the file to upload
 * @param modelType the type of the model to which the file belongs
 * @param key the key of the model to which the file belongs
 * @returns the full path of the uploaded file or undefined if the upload was cancelled
 */
export async function uploadFileToModel(modalController: ModalController, tenantId: string, file: File, modelType: ModelType, key: string): Promise<string | undefined> {
  if (key) {
    const _storageLocation = getDocumentStoragePath(tenantId, modelType, key);
    return _storageLocation ? await uploadFile(modalController, file, _storageLocation) : undefined;
  }
  return undefined;
}

/* ---------------------- Camera -------------------------*/
  /**
   * Select a photo from the camera or the photo library.
   * @returns the image taken or selected
   */
  export async function pickPhoto(platform: Platform): Promise<File | undefined> {
    const _photo = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: platform.is('mobile') ? CameraSource.Prompt : CameraSource.Photos 
    });
    return await readAsFile(_photo, platform);
  }

/* ---------------------- Helpers -------------------------*/
/**
 * Determine the title of a document based on a given operation.
 * @param operation 
 * @returns 
 */
export function getDocumentTitle(operation: string): string {
  return `document.operation.${operation}.label`;
}

export function getFullPath(document: DocumentModel): string {
  return document.dir + '/' + document.name; // dir + / + fileName + . + extension
}

export function checkMimeType(mimeType: string, imagesOnly = false): boolean {
  // images are always accepted
  if (mimeType.startsWith('image')) {
    return true;
  } // pdfs are accepted as normal documents
  if (imagesOnly === false && mimeType.startsWith('application/pdf')) {
    return true;
  }
  return false;
}

export function getDocumentStoragePath(tenant: string, modelType: ModelType, key: string, relationshipType?: RelationshipType): string | undefined {
  console.log('getDocumentStoragePath: tenant =', tenant, 'modelType =', modelType, 'key =', key, 'relationshipType =', relationshipType);
  if (modelType === undefined) {
    warn('document.util.getDocumentStoragePath -> modelType is undefined');
    return undefined;
  }
  if (key === undefined) {
    warn('document.util.getDocumentStoragePath -> key is undefined');
    return undefined;
  }
  if (tenant === undefined) {
    warn('document.util.getDocumentStoragePath -> tenant is undefined');
    return undefined;
  }
  const _slug = getDocumentSlug(modelType, relationshipType);
  return `${tenant}/${_slug}/${key}/${DOCUMENT_DIR}`;
}

export function getDocumentSlug(modelType: ModelType, relationshipType?: RelationshipType): string {
  let _slug = getModelSlug(modelType);
  if (relationshipType) {
    _slug = getSlugFromRelationshipType(relationshipType);
  }
  return _slug;
}

/**
 * The given url is checked for its URL type and transformed into a path that can be used with imgix.
 * This path is of URLType storage, ie. a relative url to a file in the storage.
 * The file referenced by the url is mostly an image or a pdf, but it can be another file type.
 * The function either returns a relative storage path or undefined.
 * A URL of type 'key' is converted into a storage path (tenant/slug/key/DOCUMENT_DIR)
 * @param url the url as configured in the model
 * @param modelType the model type of the model
 * @param tenant the tenant of the model
 */
export function getStoragePath(url: string | undefined, modelType: ModelType, tenant: string): string | undefined {
  if (!url || url.length === 0) return undefined;
  const _urlType = checkUrlType(url);
  if (_urlType === 'storage') return url;
  if (_urlType === 'key') {
    return getDocumentStoragePath(tenant, modelType, url);
  }
  return undefined;
}

