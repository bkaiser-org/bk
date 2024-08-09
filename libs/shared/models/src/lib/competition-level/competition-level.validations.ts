import { enforce, only, staticSuite, test} from 'vest';
import { stringValidations } from '../primitive-validations/string.validations';
import { SHORT_NAME_LENGTH } from '@bk/util';
import { dateValidations } from '../primitive-validations/date.validations';
import { baseValidations } from '../base/base.validations';
import { CompetitionLevel, GenderType, MemberType, ModelType, ScsMemberType } from '@bk/categories';
import { CompetitionLevelModel } from './competition-level.model';
import { categoryValidations } from '../primitive-validations/category.validations';


export const competitionLevelValidations = staticSuite((model: CompetitionLevelModel, field?: string) => {
  if (field) only(field);

  baseValidations(model, field);
  categoryValidations('category', model.category, GenderType);
  stringValidations('personKey', model.personKey, SHORT_NAME_LENGTH);
  dateValidations('dateOfBirth', model.dateOfBirth);
  categoryValidations('competitionLevel', model.competitionLevel, CompetitionLevel);
  stringValidations('scsMembershipKey', model.scsMembershipKey, SHORT_NAME_LENGTH);
  categoryValidations('scsMemberType', model.scsMemberType, ScsMemberType);
  stringValidations('srvMembershipKey', model.srvMembershipKey, SHORT_NAME_LENGTH);
  stringValidations('srvMemberId', model.srvMemberId, SHORT_NAME_LENGTH);
  categoryValidations('srvMemberType', model.srvMemberType, MemberType);
  stringValidations('srvLicenseOwnershipKey', model.srvLicenseOwnershipKey, SHORT_NAME_LENGTH);
  dateValidations('srvLicenseValidUntil', model.srvLicenseValidUntil);

  test('modelType', 'competitionLevelModelType', () => {
    enforce(model.modelType).equals(ModelType.CompetitionLevel);
  })

});

// tbd: validate the personKey to reference into subjects
// tbd: validate the scsMembershipKey to reference into memberships
// tbd: validate the srvMembershipKey to reference into memberships
// tbd: validate the srvLicenseOwnershipKey to reference into resources

