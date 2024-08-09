import { die } from '@bk/util';
import { MembershipFormModel, RelationshipModel, SubjectModel } from '@bk/models';
import { GenderType } from '@bk/categories';
import { getRelationshipIndex } from '@bk/relationship';

export function convertMembershipToForm(membership: RelationshipModel | undefined): MembershipFormModel {
  if (!membership) die('MembershipFormUtil.convertMembershipToForm: membership is undefined');
  return {
    bkey: membership.bkey,
    membershipId: membership.name,
    firstName: membership.subjectName2,
    lastName: membership.subjectName,
    gender: membership.subjectCategory,
    subjectType: membership.subjectType,
    price: membership.price,
    dateOfEntry: membership.validFrom,
    dateOfExit: membership.validTo,
    memberKey: membership.bkey,
    memberState: membership.state,
    memberCategory: membership.subType,
    memberUrl: membership.url,
    orgId: membership.objectKey,
    orgName: membership.objectName,
    orgUrl: membership.objectUrl,
    notes: membership.description,
    tags: membership.tags,
    bexioId: membership.properties.bexioId ?? '',
    abbreviation: membership.properties.abbreviation ?? '',
    orgFunction: membership.properties.orgFunction ?? '',
    nickName: membership.properties.nickName ?? '',
    dateOfBirth: membership.properties.dateOfBirth,
    zipCode: membership.properties.zipCode ?? ''
  }
}

/**
 * Only convert back the fields that can be changed by the user.
 * @param membership the membership to be updated.
 * @param vm the view model, ie. the form data with the updated values.
 * @returns the updated membership.
 */
export function convertFormToMembership(membership: RelationshipModel, vm: MembershipFormModel, convertMembershipType = true): RelationshipModel {
  membership.validFrom = vm.dateOfEntry ?? '';
  membership.validTo = vm.dateOfExit ?? '';

  // if it is a category change, the membership type is not updated. Instead, a new membership is created with the new type.
  if (convertMembershipType && vm.memberCategory !== undefined) {
    membership.subType = vm.memberCategory;
  }
  membership.price = parseInt(vm.price + ''); // make sure it's a number (input returns string)

  membership.properties.bexioId = vm.bexioId;
  membership.properties.abbreviation = vm.abbreviation;
  membership.properties.orgFunction = vm.orgFunction;
  membership.properties.nickName = vm.nickName;

  membership.description = vm.notes ?? '';
  membership.tags = vm.tags ?? '';

  membership.index = getRelationshipIndex(membership);

  return membership;
}

  export function convertMembershipFormToSubject(subject: SubjectModel | undefined, vm: MembershipFormModel): SubjectModel {
    if (!subject) subject = new SubjectModel();
    if (!vm.memberKey) die('MembershipFormUtil.convertMembershipFormToSubject: memberKey is undefined');
    if (!vm.subjectType) die('MembershipFormUtil.convertMembershipFormToSubject: subjectType is undefined');
    subject.bkey = vm.memberKey;
    subject.firstName = vm.firstName ?? '';
    subject.name = vm.lastName ?? '';
    subject.category = vm.gender ?? GenderType.Male;
    subject.modelType = vm.subjectType;
    subject.dateOfBirth = vm.dateOfBirth ?? '';
    subject.description = vm.notes ?? '';
    subject.tags = vm.tags ?? '';
    return subject;
  }
