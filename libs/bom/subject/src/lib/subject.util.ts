import { addIndexElement } from '@bk/base';
import { GenderType, ModelType, OrgType, OrgTypes, getCategoryAbbreviation } from '@bk/categories';
import { BaseModel, OrgFormModel, PersonFormModel, SubjectModel, UserModel, isSubject } from '@bk/models';
import { die, getFullPersonName } from '@bk/util';

/**
 * Based on modelType and orgType of a subject, return the list of accordion values to be displayed.
 * @param subject 
 * @returns the list of accordion values to be displayed.
 */
export function getSubjectAccordionValues(subject: SubjectModel | undefined): string[] {
  if (!subject) return ['addresses'];
  if (subject.modelType === ModelType.Org) {
    if (subject.category === OrgType.Group) return ['members'];
    else return ['addresses'];
  } else return ['addresses', 'memberships'];
}

/**
 * For a given person, return a UserModel. This is used when registering a new user.
 * @param subject 
 * @returns 
 */
export function createUserFromSubject(subject: SubjectModel): UserModel {
  if (subject.modelType !== ModelType.Person) die('SubjectUtil.createUserFromSubject: subject must be a person.');
  if (!subject.bkey) die('SubjectUtil.createUserFromSubject: subject must have a bkey.')
  const _user = new UserModel();
  _user.loginEmail = subject.fav_email;
  _user.personKey = subject.bkey;
  _user.personName = getFullPersonName(subject.firstName, subject.name);
  _user.gravatarEmail = subject.fav_email;
  _user.roles = { registered: true };
  return _user;
}

/* ---------------------- Index operations -------------------------*/
/**
 * Create an index entry for a given subject based on its values.
 * @param subject 
 * @returns the index string
 */
export function getSubjectIndex(subject: BaseModel): string {
  let _index = '';
  if (isSubject(subject)) {
    _index = addIndexElement(_index, 'n', subject.name);
    _index = addIndexElement(_index, 'c', subject.fav_city);
    if (subject.modelType === ModelType.Person) {
      _index = addIndexElement(_index, 'fn', subject.firstName);
      _index = addIndexElement(_index, 'g', subject.category === Number(GenderType.Female) ? 'f' : 'm');
    }
    if (subject.modelType === ModelType.Org || subject.modelType === ModelType.Group) {
      _index = addIndexElement(_index, 'ot', getCategoryAbbreviation(OrgTypes, subject.category));
    }
    _index = addIndexElement(_index, 'dob', subject.dateOfBirth);
  }
  return _index;
}

/**
 * Returns a string explaining the structure of the index.
 * This can be used in info boxes on the GUI.
 */
export function getSubjectIndexInfo(): string {
  return 'n:name [person|org: c:city] [person: fn:firstName g:m|f dob:dateOfBirth] [org|group: ot:orgType]';
}

export function getSubjectTitle(vm: OrgFormModel | PersonFormModel, operation: 'update' | 'view'): string {
  if (vm.modelType === ModelType.Org) {
    return (vm as OrgFormModel).orgType === OrgType.Group ? `@subject.group.operation.${operation}.label` : `@subject.org.operation.${operation}.label`;
  } else {  // Person
    return `@subject.person.operation.${operation}.label`;
  }
}
