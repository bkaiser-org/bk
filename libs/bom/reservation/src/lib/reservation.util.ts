import { BoatType, CategoryType, ModelType, RelationshipState, RelationshipType } from '@bk/categories';
import { RelationshipModel, ResourceModel, SubjectModel } from '@bk/models';
import { DateFormat, END_FUTURE_DATE_STR, SCS_SKIFF_INSURANCE, SCS_SKIFF_STORAGE, die, getTodayStr } from '@bk/util';


export function newReservation(resource: ResourceModel, booker: SubjectModel, validFrom = getTodayStr(DateFormat.StoreDate)): RelationshipModel {
  const _reservation = new RelationshipModel();
  _reservation.category = RelationshipType.Reservation as number;
  _reservation.count = '1';
  _reservation.validFrom = validFrom;
  _reservation.validTo = END_FUTURE_DATE_STR;

  _reservation.subjectKey = booker.bkey ?? die('newReservation: booker.bkey is undefined');
  _reservation.subjectName = booker.name;
  if (booker.modelType === ModelType.Person) _reservation.subjectName2 = booker.firstName;
  _reservation.subjectType = booker.modelType; // Person, Org, Group
  _reservation.subjectCategory = booker.category; // Gender or OrgType
  _reservation.url = '';

  _reservation.objectKey = resource.bkey ?? die('newResource: resource.bkey is undefined');
  _reservation.objectName = resource.name;
  _reservation.objectName2 = '';
  _reservation.objectType = resource.modelType; // 3: Boat or 4: Resource
  _reservation.objectCategory = resource.category; // ResourceType or BoatType
  _reservation.modelType = ModelType.Relationship;
  _reservation.name = booker.name + '/' + resource.name;
  _reservation.subType = CategoryType.Undefined;  // not used
  _reservation.price = 300;   // tbd needs to be calculated based on defaults per ResourceType
  _reservation.state = RelationshipState.Active as number;
  _reservation.tenant = resource.tenant;
  return _reservation;
}

export function newReservationFromBooker(booker: SubjectModel, validFrom = getTodayStr(DateFormat.StoreDate)): RelationshipModel {
  const _reservation = new RelationshipModel();
  _reservation.category = RelationshipType.Reservation as number;
  _reservation.count = '1';
  _reservation.validFrom = validFrom;
  _reservation.validTo = END_FUTURE_DATE_STR;

  _reservation.subjectKey = booker.bkey ?? die('newReservation: booker.bkey is undefined');
  _reservation.subjectName = booker.name;
  if (booker.modelType === ModelType.Person) _reservation.subjectName2 = booker.firstName;
  _reservation.subjectType = booker.modelType; // Person, Org, Group
  _reservation.subjectCategory = booker.category; // Gender or OrgType
  _reservation.url = '';

  _reservation.objectKey = '';
  _reservation.objectName = '';
  _reservation.objectName2 = '';
  _reservation.objectType = ModelType.Boat; // 3: Boat or 4: Resource
  _reservation.objectCategory = BoatType.b1x; // ResourceType or BoatType
  _reservation.modelType = ModelType.Relationship;
  _reservation.name = '';
  _reservation.subType = CategoryType.Undefined;  // not used
  _reservation.price = SCS_SKIFF_STORAGE + SCS_SKIFF_INSURANCE;
  _reservation.state = RelationshipState.Applied as number;
  _reservation.tenant = booker.tenant;
  return _reservation;
}
