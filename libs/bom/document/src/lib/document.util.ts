import { addIndexElement } from '@bk/base';
import { DocumentTypes, ModelType, RelationshipType, getCategoryAbbreviation, getModelSlug, getSlugFromRelationshipType } from '@bk/categories';
import { BaseModel, DOCUMENT_DIR, DocumentModel, isDocument } from '@bk/models';
import { checkUrlType, warn } from '@bk/util';

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

