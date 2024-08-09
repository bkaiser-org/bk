import { enforce, omitWhen, only, staticSuite, test} from 'vest';
import { tagsValidations } from '../fields/tags.validations';
import { stringValidations } from '../primitive-validations/string.validations';
import { categoryValidations } from '../primitive-validations/category.validations';
import { BoatType, GenderType, MembershipModelType, ModelType, OrgType, ResourceType } from '@bk/categories';
import { DESCRIPTION_LENGTH, SHORT_NAME_LENGTH, isAfterDate } from '@bk/util';
import { dateValidations } from '../primitive-validations/date.validations';
import { numberValidations } from '../primitive-validations/number.validations';
import { ReservationFormModel } from './reservation-form.model';
import { booleanValidations } from '../primitive-validations/boolean.validations';

export const reservationFormValidations = staticSuite((model: ReservationFormModel, field?: string) => {
  if (field) only(field);

  stringValidations('bkey', model.bkey, SHORT_NAME_LENGTH);
  stringValidations('name', model.name, SHORT_NAME_LENGTH);
  stringValidations('firstName', model.firstName, SHORT_NAME_LENGTH);
  stringValidations('lastName', model.lastName, SHORT_NAME_LENGTH);
  dateValidations('validFrom', model.validFrom);
  dateValidations('validTo', model.validTo);
  stringValidations('subjectKey', model.subjectKey, SHORT_NAME_LENGTH);
  categoryValidations('subjectType', model.subjectType, MembershipModelType); // Person, Org, Group
  stringValidations('objectKey', model.objectKey, SHORT_NAME_LENGTH);
  numberValidations('objectType', model.objectType, true, 3, 4);    // Boat 3 or Resource 4
  tagsValidations('tags', model.tags);
  stringValidations('notes', model.notes, DESCRIPTION_LENGTH);
  booleanValidations('confirmed', model.confirmed, true);

  omitWhen(model.subjectType !== ModelType.Person, () => {
    categoryValidations('subjectCategory', model.subjectCategory, GenderType); 
  });
  omitWhen(model.subjectType !== ModelType.Org, () => {
    categoryValidations('subjectCategory', model.subjectCategory, OrgType); 
  });
  omitWhen(model.subjectType !== ModelType.Group, () => {
    test('subjectCategory', 'resSubjCatGroup', () => {
      enforce(model.subjectCategory).equals(OrgType.Group);
    })
  });
  omitWhen(model.objectType !== ModelType.Boat, () => {
    categoryValidations('objectCategory', model.objectCategory, BoatType); 
  });
  omitWhen(model.objectType !== ModelType.Resource, () => {
    categoryValidations('objectCategory', model.objectCategory, ResourceType); 
  });

   // cross field validations
  omitWhen(model.validFrom === '' || model.validTo === '', () => {
    test('validTo', 'ownershipValidToAfterValidFrom', () => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      enforce(isAfterDate(model.validTo!, model.validFrom!)).isTruthy();
    });
  });

  // cross collection validations
  // tbd: cross reference subjectKey in subjects
  // tbd: cross reference objectKey in resources
});



