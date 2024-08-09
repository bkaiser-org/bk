import { enforce, omitWhen, only, staticSuite, test} from 'vest';
import { DocumentModel } from './document.model';
import { categoryValidations } from '../primitive-validations/category.validations';
import { urlValidations } from '../fields/url.validations';
import { dirValidations } from '../fields/dir.validations';
import { stringValidations } from '../primitive-validations/string.validations';
import { SHORT_NAME_LENGTH, compareDate, isFutureDate } from '@bk/util';
import { DocumentType, ModelType } from '@bk/categories';
import { numberValidations } from '../primitive-validations/number.validations';
import { dateValidations } from '../primitive-validations/date.validations';
import { baseValidations } from '../base/base.validations';

export const documentValidations = staticSuite((model: DocumentModel, field?: string) => {
  if (field) only(field);

  baseValidations(model, field);
  categoryValidations('category', model.category, DocumentType);
  dirValidations('dir', model.dir);
  stringValidations('fileName', model.fileName, SHORT_NAME_LENGTH);
  stringValidations('extension', model.extension, SHORT_NAME_LENGTH);
  stringValidations('mimeType', model.mimeType, SHORT_NAME_LENGTH);
  urlValidations('thumbUrl', model.thumbUrl);
  numberValidations('size', model.size, true, 0, 1000000000);
  stringValidations('title', model.title, SHORT_NAME_LENGTH);
  stringValidations('altText', model.altText, SHORT_NAME_LENGTH);
  stringValidations('authorKey', model.authorKey, SHORT_NAME_LENGTH);
  stringValidations('authorName', model.authorName, SHORT_NAME_LENGTH);
  dateValidations('dateOfDocCreation', model.dateOfDocCreation);
  dateValidations('dateOfDocLastUpdate', model.dateOfDocLastUpdate);
  stringValidations('locationKey', model.locationKey, SHORT_NAME_LENGTH);
  stringValidations('md5hash', model.md5hash, SHORT_NAME_LENGTH);
  stringValidations('priorVersionKey', model.priorVersionKey, SHORT_NAME_LENGTH);
  stringValidations('version', model.version, SHORT_NAME_LENGTH);

  test('modelType', 'docModelType', () => {
    enforce(model.modelType).equals(ModelType.Document);
  })

  // cross validations
  omitWhen(model.dateOfDocCreation === '', () => {
    test('dateOfDocCreation', 'docCreationNotFuture', () => {
      enforce(isFutureDate(model.dateOfDocCreation)).isFalsy();
    })
  });

  omitWhen(model.dateOfDocLastUpdate === '', () => {
    test('dateOfDocLastUpdate', 'docUpdateNotFuture', () => {
      enforce(isFutureDate(model.dateOfDocLastUpdate)).isFalsy();
    })
  });

  omitWhen(model.dateOfDocCreation === '' || model.dateOfDocLastUpdate === '', () => {
    test('dateOfDocLastUpdate', 'docUpdateAfterCreation', () => {
      enforce(compareDate(model.dateOfDocLastUpdate, model.dateOfDocCreation) >= 0);
    });
  })
});

// tbd: cross the authorKey to reference into subjects
// tbd: cross the locationKey to reference into locations
// tbd: cross the priorVersionKey to reference into documents