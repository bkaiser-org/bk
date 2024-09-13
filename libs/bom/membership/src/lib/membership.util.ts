import { RelationshipModel, SubjectModel } from '@bk/models';
import { getMembershipPrice, getRelationshipIndex } from '@bk/relationship';
import { MemberType, MemberTypes, ModelType, ModelValidationType, OrgKey, OrgType, RelationshipType, ScsMemberType, ScsMemberTypes, getCategoryAbbreviation, getMembershipState, getOrgNameAbbreviation } from '@bk/categories';
import { CollectionNames, DateFormat, END_FUTURE_DATE_STR, convertDateFormatToString, die, getTodayStr } from '@bk/util';
import { DataService } from '@bk/base';
import { Inject } from '@angular/core';

export function getMembershipAccordionValues(membership: RelationshipModel | undefined): string[] {
  if (!membership) die('MembershipUtil.getMembershipAccordionValues: membership is mandatory.');
  if (membership.subjectType === ModelType.Org) {
    if (membership.subjectCategory === OrgType.Group) return ['members'];
    else return ['addresses'];
  } else return ['addresses', 'memberships'];
}

export interface OldJuniors {
  id: string,
  name: string,
  dateOfBirth: string
}

export interface MemberStatistics {
  gender: number,
  age: number,
  memberCategory: ScsMemberType,
  zipCode: number
}

/********************************** SRV List Export ********************************* */
export function getSrvHeaderRow(): string[] {
  return [
    'personKey',
    'scsMemberKey',
    'srvMemberKey',
    'ClubName',
    'Status',
    'MC',
    'Kat',
    'Vorname',
    'Name',
    'Name/Vorname',
    'Adresse',
    'PLZ',
    'Ort',
    'GebDatum',
    'GebDatum',
    'Eintritt',
    'Austritt',
    'SRV-Nr',
    'SRV Datum',
    'Haupt-Club',
    'Handy',
    'E-Mail Privat',
    'SRV-Beitrag',
    'Funktion',
    'Rudern',
    'Kommentar'  
  ];
} 
export function convertToSrvDataRow(person: SubjectModel, scsMember: RelationshipModel, srvMember: RelationshipModel | undefined): string[] {
  if (!person?.bkey || !scsMember?.bkey) die('MembershipUtil.convertToSrvDataRow: person and scsMember are mandatory.');
  return [
    person.bkey,
    scsMember.bkey,
    srvMember?.bkey ?? '',
    'Seeclub Stäfa', 
    getSrvMemberStatus(srvMember), 
    getSrvMemberCategory(person.dateOfBirth),
    getCategoryAbbreviation(ScsMemberTypes, scsMember.subType),
    person.firstName,
    person.name, 
    person.name + ' ' + person.firstName,
    person.fav_street, 
    person.fav_zip, 
    person.fav_city, 
    (!person) ? '' : getDateInSrvFormat(person.dateOfBirth), 
    person.dateOfBirth,
    scsMember.validFrom,
    scsMember.validTo,
    getSrvNumber(srvMember),                                       // SRV Nummer
    (!srvMember) ? '' : getDateInSrvFormat(srvMember.validFrom),          // SRV Eintrittsdatum
    (!srvMember) ? '' : isDoubleMember(srvMember), 
    person.fav_phone, 
    person.fav_email,
    (!srvMember) ? '' : srvMember.price.toString(), 
    srvMember?.properties?.orgFunction ?? '',
    'WAHR',
    srvMember?.properties?.note ?? ''
  ];
}

function isDoubleMember(srvMember: RelationshipModel): string {
  return srvMember.subType === MemberType.Double ? 'Nein' : 'Ja';
}

function getDateInSrvFormat(dateStr: string): string {
  if (!dateStr || dateStr.length === 0) return '';
  return convertDateFormatToString(dateStr, DateFormat.StoreDate, DateFormat.SrvDate);
}

function getSrvMemberStatus(srvMember?: RelationshipModel): string {
  if (!srvMember) return '';
  return srvMember.subType === MemberType.Double ? 'Doppelmitglieder' : 'Zahlende Mitglieder';
}

function getSrvNumber(srvMember?: RelationshipModel): string {
  if (!srvMember) return '';
  return srvMember.name.includes('/') ? '' : srvMember.name;
}

function getSrvMemberCategory(birthdate: string): string {
  const _currentYear = Number(getTodayStr(DateFormat.Year));
  if (!birthdate || birthdate.length === 0) return '';
  const _birthYear = Number(convertDateFormatToString(birthdate, DateFormat.StoreDate, DateFormat.Year));
  return (_currentYear - _birthYear > 18) ? 'A' : 'J';
}

export function newMembershipFromSubject(subject: SubjectModel, org: SubjectModel, validFrom = getTodayStr(DateFormat.StoreDate), memberCategory = 0, orgFunction='', abbreviation='', nickName=''): RelationshipModel {
  const _membership = new RelationshipModel();
  _membership.properties.dateOfBirth = subject.dateOfBirth;
  _membership.properties.zipCode = subject.fav_zip;  
  _membership.category = RelationshipType.Membership as number;
  _membership.count = '1';
  _membership.validFrom = validFrom;
  _membership.validTo = END_FUTURE_DATE_STR;

  _membership.subjectKey = subject.bkey ?? die('newMembershipFromSubject: subject.bkey is undefined');
  _membership.subjectName = subject.name;
  _membership.subjectName2 = subject.firstName;
  _membership.subjectType = subject.modelType;  // Org or Person
  _membership.subjectCategory = subject.category; // gender or orgType
  _membership.url = subject.url;

  _membership.objectKey = org.bkey ?? die('newMembershipFromSubject: org.bkey is undefined');
  _membership.objectName = org.name;
  _membership.objectName2 = '';
  _membership.objectType = ModelType.Org;
  _membership.objectUrl = org.url;
  _membership.objectCategory = org.category;
  _membership.modelType = ModelType.Relationship;
  _membership.name = subject.name + '/' + org.name;
  _membership.subType = memberCategory;  // default is to set the membership to active
  _membership.price = getMembershipPrice(_membership.objectKey, _membership.subType);
  _membership.state = getMembershipState(_membership.objectKey, _membership.subType);
  _membership.priority = 1;
  _membership.properties.orgFunction = orgFunction;
  _membership.properties.abbreviation = abbreviation;
  _membership.properties.nickName = nickName;
  _membership.index = getRelationshipIndex(_membership);
  _membership.relIsLast = true;
  _membership.relLog = getRelLogEntry(_membership.objectKey, _membership.priority, '', _membership.validFrom, _membership.subType);
  return _membership;
}

/**
 * Update an existing membership with new values.
 * @param membership the membership to update
 */
export async function updateMembership(membership: RelationshipModel): Promise<void> {
  if (membership.validTo?.length === 0) {
    membership.validTo = END_FUTURE_DATE_STR;
  }
  await Inject(DataService).updateModel(CollectionNames.Membership, membership, `@membership.operation.update`);

}

export async function updateMembershipAttributesPerOrg(relationships: RelationshipModel[], orgKey: string, dataService: DataService) {
  // 1) relationships contains all memberships of a person, sorted by validFrom
  // 2) filter only the memberships of the given org
  const _orgMemberships = relationships.filter((r: RelationshipModel) => {
    if (orgKey === OrgKey.Other) {
      return r.objectKey !== OrgKey.SCS && r.objectKey !== OrgKey.SRV;
    } else {
      return r.objectKey === orgKey;
    }
  });

  let _relLog = '';
  let _priority = 0;
  let _relIsLast = false;

  // 3) iterate over all memberships
  for (let i = 0; i < _orgMemberships.length; i++) {

    if (orgKey === OrgKey.Other) {    // for other memberships, we assume that they are all independent
      _priority = 1;
      _relLog = getRelLogEntry(orgKey, _priority, '', _orgMemberships[i].validFrom, _orgMemberships[i].subType);
      _relIsLast = true;
    } else {          // for SCS and SRV memberships, we link them together sorted by validFrom
      _priority = i + 1;
      _relLog = getRelLogEntry(orgKey, _priority, _relLog, _orgMemberships[i].validFrom, _orgMemberships[i].subType);
      _relIsLast = (i === _orgMemberships.length - 1);
    }

    // 4) update the membership (only if it has changed)
    try {
      if (_orgMemberships[i].priority !== _priority || _orgMemberships[i].relLog !== _relLog || _orgMemberships[i].relIsLast !== _relIsLast) {
        _orgMemberships[i].priority = _priority;
        _orgMemberships[i].relLog = _relLog;
        _orgMemberships[i].relIsLast = _relIsLast;
        await dataService.updateModel(ModelValidationType.Membership, _orgMemberships[i]);
        const _org = getOrgNameAbbreviation(_orgMemberships[i].objectKey as OrgKey, _orgMemberships[i].objectName);
        console.log(`    ${_orgMemberships[i].bkey}/${_org}: ${_orgMemberships[i].validFrom}-${_orgMemberships[i].validTo} -> ${_orgMemberships[i].priority}/${_orgMemberships[i].relLog}/${_orgMemberships[i].relIsLast}`);
      }
    }
    catch(error) {
      console.log(`error on membership ${_orgMemberships[i].bkey}: `, error);
    }
  }
}

/**
 * Generate a relLog entry for a membership change.
 * @param orgKey the key of the organisation in order to differentiate the member types
 * @param priority the priority of the current membership
 * @param priorRelLog the relLog entry of the previous membership
 * @param validFrom the start date of the current membership
 * @param category the membership category fo the current membership
 * @returns 
 */
export function getRelLogEntry(orgKey: string, priority: number, priorRelLog: string, validFrom: string, category: number): string {
  let _relLog = '';
  const _memberTypes = (orgKey === OrgKey.SCS) ? ScsMemberTypes : MemberTypes;
  if (priority === 1) {    // first membership
    _relLog = validFrom + ':' + getCategoryAbbreviation(_memberTypes, category);
  } else {
    _relLog = priorRelLog + ',' + getCategoryAbbreviation(_memberTypes, category);
  }
  return _relLog;
}

/**
 * Generate a comment for a membership change. e.g. J -> A
 * @param objectKey the key of the organisation (to differentiate the member types )
 * @param oldMembershipType the old membership type
 * @param newMembershipType the new membership type
 * @returns a short description of the membership change
 */
export function getMembershipCategoryChangeComment(objectKey: string, oldMembershipType: number, newMembershipType: number): string {
  const _oldMemberTypeAbbreviation = getMemberTypeAbbreviation(objectKey, oldMembershipType);
  const _newMemberTypeAbbreviation = getMemberTypeAbbreviation(objectKey, newMembershipType);
  return `${_oldMemberTypeAbbreviation} -> ${_newMemberTypeAbbreviation}`;
}

/**
 * Get the abbreviation of a member type based on the organisation.
 * @param objectKey the key of the organisation
 * @param memberType the member type (either ScsMemberType or MemberType)
 * @returns the abbreviation of the member type
 */
export function getMemberTypeAbbreviation(objectKey: string, memberType: number): string {
  return getCategoryAbbreviation(objectKey === OrgKey.SCS ? ScsMemberTypes : MemberTypes, memberType);
}
