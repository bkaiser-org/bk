import { addIndexElement } from '@bk/base';
import { ResourceType, ResourceTypes, getCategoryAbbreviation } from '@bk/categories';
import { BaseModel, RelationshipModel, isResource } from '@bk/models';
import { die } from '@bk/util';

/* ---------------------- Getters -------------------------*/
export function getResourceLogo(resourceType: ResourceType): string {
  switch (resourceType) {
    case ResourceType.RowingBoat:
    case ResourceType.MotorBoat:
      return 'boat-outline';
    case ResourceType.HouseKey:
      return 'key-outline';
    case ResourceType.FemaleLocker:
      return 'female-outline';
    case ResourceType.MaleLocker:
      return 'male-outline';
    case ResourceType.Vehicle:
      return 'car-outline';
    case ResourceType.Other:
      return 'hammer-outline';
    case ResourceType.Undefined:
      return 'help-circle-outline';
    case ResourceType.RealEstate:
      return 'home-outline';
    default:
      die('ResourceUtil.getResourceLogo: unknown resource type ' + resourceType);
  }
}

export function getResourceSlug(resourceType: ResourceType): string {
  switch (resourceType) {
    case ResourceType.RowingBoat:
    case ResourceType.MotorBoat: return 'boat';
    case ResourceType.FemaleLocker:
    case ResourceType.MaleLocker: return 'locker';
    case ResourceType.HouseKey: return 'key';
    case ResourceType.Vehicle: return 'vehicle';
    case ResourceType.RealEstate: return 'realEstate';
    default: return 'other';
  }
}

export function getResourceTitle(resourceType: ResourceType, operation: string | undefined, isResourceAdmin: boolean): string {
  const _operation = operation || isResourceAdmin ? 'update' : 'view';
  const _slug = getResourceSlug(resourceType);
  return `@resource.${_slug}.operation.${_operation}.label`;
}

/* ---------------------- Index operations -------------------------*/
export function getResourceIndex(resource: BaseModel): string {
  let _index = '';
  if (isResource(resource)) {
    _index = addIndexElement(_index, 'n', resource.name);
    _index = addIndexElement(_index, 'c', getCategoryAbbreviation(ResourceTypes, resource.category));
  }
  return _index;
}

/**
 * Returns a string explaining the structure of the index.
 * This can be used in info boxes on the GUI.
 */
export function getResourceIndexInfo(): string {
  return 'n:name c:type';
}

/*---------------------------------------- INDEX -------------------------------------------*/

export function getRelationshipIndex(relationship: RelationshipModel): string {
  let _index = '';
  _index = addIndexElement(_index, 'sn', relationship.subjectName + ' ' + relationship.subjectName2);
  _index = addIndexElement(_index, 'on', relationship.objectName + ' ' + relationship.objectName2);
  if (relationship?.properties.nickName) {
    _index = addIndexElement(_index, 'nn', relationship.properties.nickName);
  }
  return _index;
}