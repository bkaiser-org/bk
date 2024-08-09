import { enforce, omitWhen, only, staticSuite, test } from 'vest';
import { BoatType, CategoryType, GenderType, MemberType, MembershipState, ModelType, OrgKey, OrgType, RelationshipType, ResourceType, ScsMemberType } from '@bk/categories';
import { SHORT_NAME_LENGTH, compareDate } from '@bk/util';
import { stringValidations } from '../primitive-validations/string.validations';
import { dateValidations } from '../primitive-validations/date.validations';
import { baseValidations } from '../base/base.validations';
import { categoryValidations } from '../primitive-validations/category.validations';
import { RelationshipModel } from './relationship.model';
import { urlValidations } from '../fields/url.validations';
import { numberValidations } from '../primitive-validations/number.validations';

export const relationshipValidations = staticSuite((model: RelationshipModel, field?: string) => {
  if (field) only(field);

  baseValidations(model);
  test('modelType', 'relModelType', () => {
    enforce(model.modelType).equals(ModelType.Relationship);
  });
  categoryValidations('category', model.category, RelationshipType);

  stringValidations('subjectKey', model.subjectKey, SHORT_NAME_LENGTH);
  stringValidations('subjectName', model.subjectName, SHORT_NAME_LENGTH);
  stringValidations('subjectName2', model.subjectName2, SHORT_NAME_LENGTH);
  categoryValidations('subjectType', model.subjectType, ModelType);
  test('subjectType', 'relCorrectSubjectType', () => {
    enforce(model.subjectType).oneOf(
      enforce.numberEquals(ModelType.Person),
      enforce.numberEquals(ModelType.Org),
      enforce.numberEquals(ModelType.Group)
    );
  });

  stringValidations('objectKey', model.objectKey, SHORT_NAME_LENGTH);
  stringValidations('objectName', model.objectName, SHORT_NAME_LENGTH);
  stringValidations('objectName2', model.objectName2, SHORT_NAME_LENGTH);
  urlValidations('objectUrl', model.objectUrl);
  numberValidations('price', model.price, true, 0, 1000000);
  stringValidations('count', model.count, 5);
  numberValidations('priority', model.priority, true, -1, 1000);
  dateValidations('validFrom', model.validFrom);
  dateValidations('validTo', model.validTo);

  // tbd: validate properties

  // cross field validations
  omitWhen(model.validFrom === '' || model.validTo === '', () => {
    test('validTo', 'ownershipValidToAfterValidFrom', () => {
      enforce(compareDate(model.validTo, model.validFrom) >= 0);
    });
  });

  /*----------------------------------------------------------------------------------------------*/
  // OWNERSHIP
  omitWhen(model.category !== RelationshipType.Ownership, () => {

    // subjectType: tested for all relationship types (see above) -> Person, Org, Group
    omitWhen(model.subjectType !== ModelType.Person, () => {
      test('subjectCategory', 'relSubjectCatGender', () => {
        enforce(model.subjectCategory).inside(Object.values(GenderType));
      });  
    });
    omitWhen(model.subjectType !== ModelType.Org, () => {
      test('subjectCategory', 'relSubjectCatOrg', () => {
        enforce(model.subjectCategory).inside(Object.values(OrgType));
      });
    });
    omitWhen(model.subjectType !== ModelType.Group, () => {
      test('subjectCategory', 'relSubjectCatGroup', () => {
        enforce(model.subjectCategory).numberEquals(OrgType.Group);
      });
    });

    // objecttype
    test('objectType', 'relObjType', () => {
      enforce(model.objectType).oneOf(
        enforce.numberEquals(ModelType.Boat),
        enforce.numberEquals(ModelType.Resource)
      );
    });
    omitWhen(model.objectType !== ModelType.Boat, () => {
      test('objectCategory', 'relObjCatBoat', () => {
        enforce(model.objectCategory).inside(Object.values(BoatType));
      });
    });
    omitWhen(model.objectType !== ModelType.Resource, () => {
      test('objectCategory', 'relObjCatResource', () => {
        enforce(model.objectCategory).inside(Object.values(ResourceType));
      });
    });

    test('subType', 'relSubTypeOwnership', () => {
      enforce(model.subType).numberEquals(CategoryType.Undefined);
    });
    
    // state -> RelationshipState f(ObjectType, ObjectCategory)
    // price -> f(ObjectType, ObjectCategory)
  });

  /*----------------------------------------------------------------------------------------------*/
  // MEMBERSHIP
  omitWhen(model.category !== RelationshipType.Membership, () => {

    // subjectType: tested for all relationship types (see above) -> Person, Org, Group
    omitWhen(model.subjectType !== ModelType.Person, () => {
      test('subjectCategory', 'relSubjectCatGender', () => {
        enforce(model.subjectCategory).inside(Object.values(GenderType));
      });  
    });
    omitWhen(model.subjectType !== ModelType.Org, () => {
      test('subjectCategory', 'relSubjectCatOrg', () => {
        enforce(model.subjectCategory).inside(Object.values(OrgType));
      });
    });
    omitWhen(model.subjectType !== ModelType.Group, () => {
      test('subjectCategory', 'relSubjectCatGroup', () => {
        enforce(model.subjectCategory).numberEquals(OrgType.Group);
      });
    });

    // objecttype
    test('objectType', 'memberObjTypeOrgGroup', () => {
      enforce(model.objectType).oneOf(
        enforce.numberEquals(ModelType.Org),
        enforce.numberEquals(ModelType.Group)
      );
    });

    // objectCategory
    test('objectCategory', 'memberObjCatOrgType', () => {
      enforce(model.objectCategory).inside(Object.values(OrgType));
    });

    // subType
    omitWhen(model.objectKey !== OrgKey.SCS, () => {
      test('subType', 'memberScsSubType', () => {
        enforce(model.subType).inside(Object.values(ScsMemberType));
      });  
    });
    omitWhen(model.objectKey === OrgKey.SCS, () => {
      test('subType', 'memberNonScsSubType', () => {
        enforce(model.subType).inside(Object.values(MemberType));
      });  
    });

    // state -> MembershipState f(ObjectKey)
    omitWhen(model.objectKey !== OrgKey.SCS && model.subType !== ScsMemberType.Passiv, () => {
      test('state', 'memberScsPassiveState', () => {
        enforce(model.state).equals(MembershipState.Passive);
      });  
    });

    // price -> f(ObjectType, ObjectCategory)
  });

  /*----------------------------------------------------------------------------------------------*/
  // RESERVATION
  omitWhen(model.category !== RelationshipType.Reservation, () => {
    // objectType = Boat or Resource
    // objectType = Boat -> objectCategory = BoatType
    // objectType = Resource -> objectCategory = ResourceType
    // subjectType = Person, Org, Group
    // subjectType = Person -> subjectCategory = GenderType
    // subjectType = Org -> subjectCategory = OrgType
    // subjectType = Group -> subjectCategory = undefined
    // subType = ReservationType
    // state = f(ObjectType, ObjectCategory) ReservationState
    // price = f(ObjectType, ObjectCategory)
  });

  /*----------------------------------------------------------------------------------------------*/
  // PERSONAL
  omitWhen(model.category !== RelationshipType.Personal, () => {
    // objectType = Person
    // objectCategory = GenderType
    // subjectType = Person
    // subjectCategory = GenderType
    // subType = PersonalRelationshipType
  });

  /*----------------------------------------------------------------------------------------------*/
  // EMPLOYMENT
  omitWhen(model.category !== RelationshipType.Employment, () => {
    // objectType = Org
    // objectCategory = OrgType
    // subjectType = Person | Org | Group
    // subjectCategory = GenderType | OrgType | undefined
    // subType = EmploymentType
    // state = EmploymentState (idea, offered, active, archived)
    // price = Salary
  });

  /*----------------------------------------------------------------------------------------------*/
  // OWNERSHIP_TRANSFER
  omitWhen(model.category !== RelationshipType.OwnershipTransfer, () => {
    // objectType = Org | Person
    // objectCategory = OrgType | GenderType
    // subjectType = Org | Person
    // subjectCategory = OrgType | GenderType
    // subType = OwnershipTransferType
    // state = OwnershipTransferState (idea, offered, active, archived)
    // price = Price
  });

  // cross collection validations
  // tbd: cross reference subjectKey in subjects
  //    cross reference objectKey in subjects or resources... 

});

