import { die, warn } from '@bk/util';
import { OwnershipFormModel, RelationshipModel } from '@bk/models';
import { getRelationshipIndex } from '@bk/relationship';

export function convertOwnershipToForm(ownership: RelationshipModel | undefined): OwnershipFormModel {
  if (!ownership) die('OwnershipFormUtil.convertOwnershipToForm: ownership is undefined');
  return {
    name: ownership.name,
    firstName: ownership.subjectName2,
    lastName: ownership.subjectName,
    subjectType: ownership.subjectType,
    price: ownership.price,
    validFrom: ownership.validFrom,
    validTo: ownership.validTo,
    notes: ownership.description,
    tags: ownership.tags
  }
}

/**
 * Only convert back the fields that can be changed by the user.
 * @param ownership the ownership to be updated.
 * @param vm the view model, ie. the form data with the updated values.
 * @returns the updated ownership.
 */
export function convertFormToOwnership(ownership: RelationshipModel, vm: OwnershipFormModel | undefined): RelationshipModel {
  if (!vm) {
    warn('OwnershipFormUtil.convertFormToOwnership: vm is undefined');
    return ownership;
  }
  ownership.validFrom = vm.validFrom ?? '';
  ownership.validTo = vm.validTo ?? '';

  ownership.price = parseInt(vm.price + ''); // make sure it's a number (input returns string)

  ownership.description = vm.notes ?? '';
  ownership.tags = vm.tags ?? '';

  ownership.index = getRelationshipIndex(ownership);

  return ownership;
}
