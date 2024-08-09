import { enforce, only, staticSuite, test} from 'vest';
import { stringValidations } from '../primitive-validations/string.validations';
import { SHORT_NAME_LENGTH } from '@bk/util';
import { baseValidations } from '../base/base.validations';
import { InvoicePositionType, ModelType } from '@bk/categories';
import { categoryValidations } from '../primitive-validations/category.validations';
import { InvoicePositionModel } from './invoice-position.model';
import { numberValidations } from '../primitive-validations/number.validations';
import { booleanValidations } from '../primitive-validations/boolean.validations';


export const invoicePositionValidations = staticSuite((model: InvoicePositionModel, field?: string) => {
  if (field) only(field);

  baseValidations(model, field);
  stringValidations('personKey', model.personKey, SHORT_NAME_LENGTH);
  stringValidations('firstName', model.firstName, SHORT_NAME_LENGTH);
  categoryValidations('category', model.category, InvoicePositionType);
  numberValidations('year', model.year, true, 1990, 2030);
  numberValidations('amount', model.amount, false, 0, 100000);

  stringValidations('currency', model.currency, 3);
  test('currency', 'invoicePositionCurrency', () => {
    enforce(model.currency).equals('CHF');
  });


  booleanValidations('isBillable', model.isBillable);

  test('modelType', 'invoicePositionModelType', () => {
    enforce(model.modelType).equals(ModelType.InvoicePosition);
  });

  // cross field validations

  // cross collection validations
  // tbd: validate the personKey to reference into subjects

});

