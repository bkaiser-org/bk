import { MemberInfo, PersonNewFormModel, SubjectModel } from '@bk/models';
import { GenderType, MemberType, ModelType, getDefaultMembershipCategory } from '@bk/categories';
import { AhvFormat, formatAhv, DateFormat, getTodayStr, END_FUTURE_DATE_STR } from '@bk/util';


export function getPersonNewFormModel(orgId: string | undefined): PersonNewFormModel {
  return {
    firstName: '',
    lastName: '',
    gender: GenderType.Male,
    dateOfBirth: '',
    dateOfDeath: '',
    countryCode: '',
    street: '',
    zipCode: '',
    city: '',
    phone: '',
    email: '',
    ssn: '',
    notes: '',
    tags: '',
    modelType: ModelType.Person,
    orgId: orgId,
    dateOfEntry: getTodayStr(DateFormat.IsoDate),
    dateOfExit: '',
    memberCategory: getDefaultMembershipCategory(orgId),
    function: '',
    abbreviation: '',
    nickName: ''
  }
}

export function convertNewFormToPerson(vm: PersonNewFormModel): SubjectModel {
  const _subject = new SubjectModel();
  _subject.firstName = vm.firstName ?? '';
  _subject.name = vm.lastName ?? '';
  _subject.category = Number(vm.gender);
  _subject.dateOfBirth = vm.dateOfBirth ?? '';
  _subject.dateOfDeath = vm.dateOfDeath ?? '';
  _subject.fav_country = vm.countryCode ?? 'CH';
  _subject.fav_street = vm.street ?? '';
  _subject.fav_zip = vm.zipCode ?? '';
  _subject.fav_city = vm.city ?? '';
  _subject.fav_phone = vm.phone ?? '';
  _subject.fav_email = vm.email ?? '';
  _subject.taxId = formatAhv(vm.ssn ?? '', AhvFormat.Electronic);
  _subject.description = vm.notes ?? '';
  _subject.tags = vm.tags ?? '';
  _subject.modelType = vm.modelType ?? ModelType.Person;
  return _subject;
}

export function convertNewFormToMembership(vm: PersonNewFormModel): MemberInfo {
  return {
    orgId: vm.orgId,
    dateOfEntry: !vm.dateOfEntry ? getTodayStr() : vm.dateOfEntry,
    dateOfExit: !vm.dateOfExit ? END_FUTURE_DATE_STR : vm.dateOfExit,
    memberCategory: vm.memberCategory ?? MemberType.Active,
    function: vm.function ?? '',
    abbreviation: vm.abbreviation ?? '',
    nickName: vm.nickName ?? ''
  }
}
