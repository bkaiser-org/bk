import { enforce, only, staticSuite, test} from 'vest';
import { stringValidations } from '../primitive-validations/string.validations';
import { SHORT_NAME_LENGTH } from '@bk/util';
import { ModelType } from '@bk/categories';
import { CommentModel } from './comment.model';
import { dateValidations } from '../primitive-validations/date.validations';
import { baseValidations } from '../base/base.validations';
import { numberValidations } from '../primitive-validations/number.validations';


export const commentValidations = staticSuite((model: CommentModel, field?: string) => {
  if (field) only(field);

  baseValidations(model, field);
  stringValidations('authorKey', model.authorKey, SHORT_NAME_LENGTH, 5, true);
  dateValidations('creationDate', model.creationDate);
  stringValidations('parentKey', model.parentKey, SHORT_NAME_LENGTH, 5, true);
  stringValidations('parentCollection', model.parentCollection, SHORT_NAME_LENGTH, 5, true);
  numberValidations('category', model.category, true, -1, -1);
  
  test('modelType', 'commentModelType', () => {
    enforce(model.modelType).equals(ModelType.Comment);
  });
  test('description', 'commentNotEmpty', () => {
    enforce(model.description).isNotEmpty();
  });
  test('description', 'commentShouldMakeSense', () => {
    enforce(model.description).notEquals('Neuer Kommentar wurde erstellt');
    enforce(model.description).notEquals('initial comment');
    enforce(model.description).notEquals('initial');
    enforce(model.description).notEquals('created');
    enforce(model.description).notEquals('deleted');
    enforce(model.description).notEquals('test');
    enforce(model.description).notEquals('blah');
    enforce(model.description).notEquals('gugus');
    enforce(model.description).notEquals('sugus');
    enforce(model.description).notEquals('...');

  });

});

// tbd: check the authorKey to reference into subjects
