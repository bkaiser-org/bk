import { die, fixDuration, warn } from '@bk/util';
import { RelationshipModel, ReservationFormModel, ResourceModel } from '@bk/models';
import { getRelationshipIndex } from '@bk/relationship';
import { BoatType, BoatUsage, getCategoryName, ModelType, ReservationState, ReservationType, ReservationTypes, ResourceType } from '@bk/categories';

export function convertReservationToForm(reservation: RelationshipModel | undefined): ReservationFormModel {
  if (!reservation) die('ReservationFormUtil.convertReservationToForm: reservation is undefined');
  return {
    bkey: reservation.bkey,
    name: reservation.name,
    firstName: reservation.subjectName2,
    lastName: reservation.subjectName,
    subjectType: reservation.subjectType,
    price: reservation.price,
    validFrom: reservation.validFrom,
    validTo: reservation.validTo,
    state: reservation.state,
    type: reservation.subType,
    startTime: reservation.properties.startTime,
    endTime: reservation.properties.endTime,
    participants: reservation.properties.participants,
    area: reservation.properties.area,
    confirmed: false,
    load: '',
    currentValue: 0,
    hexColor: '',
    tenant: reservation.tenant,
    reference: reservation.properties.reservationRef,
    notes: reservation.description,
    tags: reservation.tags
  }
}

/**
 * Only convert back the fields that can be changed by the user.
 * @param reservation the reservation to be updated.
 * @param vm the view model, ie. the form data with the updated values.
 * @returns the updated reservation.
 */
export function convertFormToReservation(reservation: RelationshipModel, vm: ReservationFormModel | undefined): RelationshipModel {
  if (!vm) {
    warn('ReservationFormUtil.convertFormToReservation: vm is undefined');
    return reservation;
  }
  reservation.subType = vm.type ?? ReservationType.SocialEvent;
  reservation.name = vm.name ?? getCategoryName(ReservationTypes, reservation.subType) + ' ' + reservation.subjectName;
  reservation.validFrom = vm.validFrom ?? '';
  reservation.validTo = vm.validTo ?? '';
  const _dates = fixDuration(reservation.validFrom, reservation.validTo);
  reservation.validFrom = _dates[0];
  reservation.validTo = _dates[1];
  reservation.objectName = vm.name ?? '';

  reservation.price = parseInt(vm.price + ''); // make sure it's a number (input returns string)
  reservation.state = vm.state ?? ReservationState.Initial;
  reservation.properties = {};
  reservation.description = vm.notes ?? '';
  reservation.tags = vm.tags ?? '';
  reservation.index = getRelationshipIndex(reservation);

  return reservation;
}

export function convertFormToResource(vm: ReservationFormModel | undefined): ResourceModel {
  if (!vm) die('ReservationFormUtil.convertFormToResource: vm is mandatory');
  if (!vm.name) die('ReservationFormUtil.convertFormToResource: vm.name is mandatory');
  const _resource = new ResourceModel();
  _resource.name = vm.name;
  _resource.category = ResourceType.RowingBoat;
  _resource.subType = BoatType.b1x;
  _resource.modelType = ModelType.Boat;
  _resource.usage = BoatUsage.Private;
  _resource.currentValue = parseInt(vm.currentValue + '');  // make sure it's a number (input returns string)
  _resource.weight = 0;
  _resource.load = vm.load ?? '';
  _resource.color = vm.hexColor ?? '';
  _resource.description = vm.notes ?? '';
  _resource.tags = vm.tags ?? die('ReservationFormUtil.convertFormToResource: vm.tags is mandatory');
  return _resource;
}
