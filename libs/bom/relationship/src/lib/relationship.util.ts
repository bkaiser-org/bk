import { addIndexElement } from "@bk/base";
import { ModelType, RelationshipType, MemberType, Category, getScsMembershipPrice, MembershipStates, RelationshipTypes, OrgKey, getCategoryName, ResourceTypes, getSlugFromRelationshipType } from "@bk/categories";
import { BaseModel, RelationshipModel, isRelationship } from "@bk/models";
import { bkTranslate, getFullPersonName } from "@bk/util";

export function getRelationshipPrefix(relationship: RelationshipModel): string {
  let _prefix = 'relationship';
  if (relationship.category === (RelationshipType.Membership as number)) {
    _prefix = relationship.subjectType === ModelType.Org ? 'org' : 'person';
  }
  return _prefix;
}

/* ---------------------- Index operations -------------------------*/
export function getRelationshipIndex(relationship: BaseModel): string {
  let _index = '';
  if (isRelationship(relationship)) {
    _index = addIndexElement(_index, 'sn', relationship.subjectName + ' ' + relationship.subjectName2);
    _index = addIndexElement(_index, 'on', relationship.objectName + ' ' + relationship.objectName2);
    if (relationship?.properties.nickName) {
      _index = addIndexElement(_index, 'nn', relationship.properties.nickName);
    }
  }
  return _index;
}

/**
 * Returns a string explaining the structure of the index.
 * This can be used in info boxes on the GUI.
 */
export function getRelationshipIndexInfo(): string {
  return 'sn:subjectName on:ObjectName [nn:nickName]';
}

/* ---------------------- Helpers -------------------------*/

export function setRelationshipTitle(rel: RelationshipModel | undefined, operation: string): string {
  if (rel === undefined) return '';
  return bkTranslate(`@${getSlugFromRelationshipType(rel.category)}.operation.${operation}.label`);
}

export function getRelationshipDescription(rel: RelationshipModel, isReversed = false): string {
  const _direction = isReversed === true ? 'revreldesc' : 'reldesc';
  return `@${getSlugFromRelationshipType(rel.category)}.${_direction}`;
}

export function getFullRelationshipDescription(
  rel: RelationshipModel | undefined,
  isReversed = false): string {
  if (rel === undefined) return '';
  let _relDesc = bkTranslate(getRelationshipDescription(rel, isReversed));
  if (rel.category === RelationshipType.Ownership) {
    if (rel.objectType === ModelType.Boat) {
      _relDesc += ' ' + bkTranslate('@resource.type.rowingBoat.label');
    } else {
      _relDesc += ' ' + bkTranslate(`${getCategoryName(ResourceTypes, rel.objectCategory)}`);
    }
  }
  return isReversed === true ?
    `${rel.objectName} ${_relDesc} ${getSubjectName(rel)}` :
    `${getSubjectName(rel)} ${_relDesc} ${rel.objectName}`;
}

export function getSubjectName(rel: RelationshipModel): string {
  return rel.subjectType === ModelType.Person ? getFullPersonName(rel.subjectName2, rel.subjectName) : rel.subjectName;
}

export function getRelationshipStates(relationshipType: number): Category[] {
  return relationshipType === RelationshipType.Membership ? MembershipStates : RelationshipTypes;
}

export function isRelationshipTerminated(relationship: RelationshipModel): boolean {
  return !((relationship.validTo === undefined || relationship.validTo.length === 0));
}

/*---------------------- MEMBERSHIP ----------------------------------------*/

/* ---------------------- Index operations -------------------------*/
// getMembershipIndex -> getRelationshipIndex
// getMembershipIndexInfo -> getRelationshipIndexInfo
// checkMembershipModel
// stringifyMembershipModel -> stringifyRelationshipModel


export function getMembershipPrice(orgKey: string, memberCategoryId: number): number {
  if (orgKey === OrgKey.SCS) return getScsMembershipPrice(memberCategoryId);
  if (orgKey === OrgKey.SRV && memberCategoryId === MemberType.Active) return 75;
  // for non-active SRV members or members of all other orgs
  return 0;
}




