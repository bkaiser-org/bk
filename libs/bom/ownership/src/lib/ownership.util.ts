import { Inject } from '@angular/core';
import { DataService } from '@bk/base';
import { CategoryType, ModelType, OrgKey, RelationshipState, RelationshipType, ResourceType } from '@bk/categories';
import { RelationshipModel, ResourceModel, SubjectModel } from '@bk/models';
import { CollectionNames, DateFormat, END_FUTURE_DATE_STR, SCS_KEY_DEPOSIT, SCS_LOCKER_FEE, SCS_SKIFF_INSURANCE, SCS_SKIFF_STORAGE, die, getTodayStr } from '@bk/util';

export function getOwnershipPrice(modelType: ModelType, resourceType: ResourceType, ownerKey: string): number {
  if (modelType === ModelType.Boat) return ownerKey === OrgKey.SCS ? 0 : SCS_SKIFF_STORAGE + SCS_SKIFF_INSURANCE;
  // it is a resource
  switch (resourceType) {
    case ResourceType.RowingBoat: return ownerKey === OrgKey.SCS ? 0 : SCS_SKIFF_STORAGE + SCS_SKIFF_INSURANCE;
    case ResourceType.FemaleLocker:
    case ResourceType.MaleLocker: return SCS_LOCKER_FEE;
    case ResourceType.HouseKey: return SCS_KEY_DEPOSIT;
    case ResourceType.MotorBoat:
    case ResourceType.Vehicle:
    case ResourceType.Undefined:
    default: return 0;
  }
}

/**
 * Update an existing ownership with new values.
 * @param ownership the ownership to update
 */
export async function updateOwnership(ownership: RelationshipModel): Promise<void> {
  if (ownership.validTo?.length === 0) {
    ownership.validTo = END_FUTURE_DATE_STR;
  }  
  await Inject(DataService).updateModel(CollectionNames.Ownership, ownership, `@ownership.operation.update`);
}

export function newResourceOwnership(resource: ResourceModel, owner: SubjectModel, validFrom = getTodayStr(DateFormat.StoreDate)): RelationshipModel {
  if (!owner.bkey) die('ownership.util.newResourceOwnership(): owner.bkey is mandatory.');
  const _ownership = new RelationshipModel();
  _ownership.category = RelationshipType.Ownership as number;
  _ownership.count = '1';
  _ownership.validFrom = validFrom;
  _ownership.validTo = END_FUTURE_DATE_STR;

  _ownership.subjectKey = owner.bkey ?? die('newResourceOwnership: owner.bkey is undefined');
  _ownership.subjectName = owner.name;
  if (owner.modelType === ModelType.Person) _ownership.subjectName2 = owner.firstName;
  _ownership.subjectType = owner.modelType; // Person, Org, Group
  _ownership.subjectCategory = owner.category; // Gender or OrgType
  _ownership.url = owner.url;

  _ownership.objectKey = resource.bkey ?? die('newResourceOwnership: resource.bkey is undefined');
  _ownership.objectName = resource.name;
  _ownership.objectName2 = '';
  _ownership.objectType = resource.modelType; // 3: Boat or 4: Resource
  _ownership.objectCategory = resource.category; // ResourceType or BoatType
  _ownership.modelType = ModelType.Relationship;
  _ownership.name = owner.name + '/' + resource.name;
  _ownership.subType = CategoryType.Undefined;  // not used
  _ownership.price = getOwnershipPrice(resource.modelType, resource.category as unknown as ResourceType, owner.bkey);
  _ownership.state = RelationshipState.Active as number;
  return _ownership;
}
