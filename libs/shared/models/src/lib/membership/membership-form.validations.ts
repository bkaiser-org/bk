
import { enforce, omitWhen, only, staticSuite, test} from 'vest';
import { tagsValidations } from '../fields/tags.validations';
import { MembershipFormModel } from './membership-form.model';
import { stringValidations } from '../primitive-validations/string.validations';
import { categoryValidations } from '../primitive-validations/category.validations';
import { GenderType, MemberType, MembershipModelType, MembershipState, OrgKey, ScsMemberType } from '@bk/categories';
import { DESCRIPTION_LENGTH, SHORT_NAME_LENGTH, isAfterDate, isFutureDate } from '@bk/util';
import { numberValidations } from '../primitive-validations/number.validations';
import { dateValidations } from '../primitive-validations/date.validations';
import { urlValidations } from '../fields/url.validations';

export const membershipFormValidations = staticSuite((model: MembershipFormModel, field?: string) => {
  if (field) only(field);

  stringValidations('bkey', model.bkey, SHORT_NAME_LENGTH);
  stringValidations('membershipId', model.membershipId, SHORT_NAME_LENGTH);
  stringValidations('firstName', model.firstName, SHORT_NAME_LENGTH);
  stringValidations('lastName', model.lastName, SHORT_NAME_LENGTH);
  categoryValidations('gender', model.gender, GenderType); // tbd: if Person: gender, else orgType
  categoryValidations('type', model.subjectType, MembershipModelType); // Person, Org, Group
  numberValidations('price', model.price, false, 0, 1000000);
  dateValidations('dateOfEntry', model.dateOfEntry);
  dateValidations('dateOfExit', model.dateOfExit);
  stringValidations('memberKey', model.memberKey, SHORT_NAME_LENGTH);
  categoryValidations('memberState', model.memberState, MembershipState);

  omitWhen(model.orgId !== OrgKey.SCS, () => {
    categoryValidations('memberCategory', model.memberCategory, ScsMemberType); 
  });
  omitWhen(model.orgId === OrgKey.SCS, () => {
    categoryValidations('memberCategory', model.memberCategory, MemberType); 
  });

  urlValidations('memberUrl', model.memberUrl);
  stringValidations('orgName', model.orgName, SHORT_NAME_LENGTH);
  urlValidations('orgUrl', model.orgUrl);
  stringValidations('orgId', model.orgId, SHORT_NAME_LENGTH);
  stringValidations('bexioId', model.bexioId, SHORT_NAME_LENGTH);
  stringValidations('abbreviation', model.abbreviation, SHORT_NAME_LENGTH);
  stringValidations('orgFunction', model.orgFunction, SHORT_NAME_LENGTH);
  stringValidations('nickName', model.nickName, SHORT_NAME_LENGTH);
  dateValidations('dateOfBirth', model.dateOfBirth);
  stringValidations('zipCode', model.zipCode, SHORT_NAME_LENGTH);
  tagsValidations('tags', model.tags);
  stringValidations('notes', model.notes, DESCRIPTION_LENGTH);

   // cross field validations
  omitWhen(model.dateOfEntry === '' || model.dateOfExit === '', () => {
    test('dateOfExit', 'membershipExitAfterEntry', () => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      enforce(isAfterDate(model.dateOfExit!, model.dateOfEntry!)).isTruthy();
    });
  });

  omitWhen(model.dateOfBirth === '', () => {
    test('dateOfBirth', 'membershipDateOfBirthNotFuture', () => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      enforce(isFutureDate(model.dateOfBirth!)).isFalsy();
    })
  });

  // cross collection validations
  // tbd: cross reference memberKey in subjects
  // tbd: cross reference orgId in subjects

});



