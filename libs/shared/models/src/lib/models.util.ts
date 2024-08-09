import { ModelType, RelationshipType, ResourceType } from "@bk/categories";
import { AddressModel } from "./address/address.model";
import { CommentModel } from "./comment/comment.model";
import { CompetitionLevelModel } from "./competition-level/competition-level.model";
import { DocumentModel } from "./document/document.model";
import { EventModel } from "./event/event.model";
import { InvoicePositionModel } from "./invoice-position/invoice-position.model";
import { LocationModel } from "./location/location.model";
import { PageModel } from "./page/page.model";
import { RelationshipModel } from "./relationship/relationship.model";
import { ResourceModel } from "./resource/resource.model";
import { SectionModel } from "./section/section.model";
import { SubjectModel } from "./subject/subject.model";
import { UserModel } from "./user/user.model";
import { isType } from "@bk/util";
import { BaseModel } from "./base/base.model";
import { MenuItemModel } from "./menu/menu-item.model";
import { TaskModel } from "./task/task.model";
import { TripModel } from "./trip/trip.model";

/**
 * Narrowing from BaseModel
 * we are defining a user-defined type guard with type predicates (is) for each of the models.
 * https://www.typescriptlang.org/docs/handbook/advanced-types.html#user-defined-type-guards
 * 
 * usage: if (isAddress(data)) -> data is AddressModel
 * @param address the data to check the type for
 * @returns true if the data is of requested type
 */

export function isBaseModel(model: unknown): model is BaseModel {
  return isType(model, new BaseModel);
}

export function isAddress(address: unknown): address is AddressModel {
  return isType(address, new AddressModel);
}

export function isComment(comment: unknown): comment is CommentModel {
  return isType(comment, new CommentModel);
}

export function isCompetitionLevel(competitionLevel: unknown): competitionLevel is CompetitionLevelModel {
  return isType(competitionLevel, new CompetitionLevelModel);
}

export function isDocument(document: unknown): document is DocumentModel {
  return isType(document, new DocumentModel);
}

export function isEvent(event: unknown): event is EventModel {
  return isType(event, new EventModel);
}

export function isInvoicePosition(invoicePosition: unknown): invoicePosition is InvoicePositionModel {
  return isType(invoicePosition, new InvoicePositionModel);
}

export function isLocation(location: unknown): location is LocationModel {
  return isType(location, new LocationModel);
}

export function isMenuItem(menuItem: unknown): menuItem is MenuItemModel {
  return isType(menuItem, new MenuItemModel);
}

export function isPage(page: unknown): page is PageModel {
  return isType(page, new PageModel);
}


export function isRelationship(relationship: unknown): relationship is RelationshipModel {
  return isType(relationship, new RelationshipModel);
}

export function isResource(resource: unknown): resource is ResourceModel {
  return isType(resource, new ResourceModel);
}

export function isSection(section: unknown): section is SectionModel {
  return isType(section, new SectionModel);
}

export function isSubject(subject: unknown): subject is SubjectModel {
  return isType(subject, new SubjectModel);
}

export function isUser(user: unknown): user is UserModel {
  return isType(user, new UserModel);
}

// sub-models
// narrowing to RelationshipModel
export function isMembership(membership: unknown): membership is RelationshipModel {
  return isRelationship(membership) && membership.category === RelationshipType.Membership;
}

export function isOwnership(ownership: unknown): ownership is RelationshipModel {
  return isRelationship(ownership) && ownership.category === RelationshipType.Ownership;
}

// narrowing to SubjectModel
export function isOrg(org: unknown): org is SubjectModel {
  return isSubject(org) && org.modelType === ModelType.Org;
}

export function isPerson(person: unknown): person is SubjectModel {
  return isSubject(person) && person.modelType === ModelType.Person;
}

export function isGroup(group: unknown): group is SubjectModel {
  return isSubject(group) && group.modelType === ModelType.Group;
}

// narrowing to ResourceModel
export function isBoat(boat: unknown): boat is ResourceModel {
  return isResource(boat) && boat.modelType === ModelType.Boat;
}

export function isFemaleLocker(locker: unknown): locker is ResourceModel {
  return isResource(locker) && locker.category === ResourceType.FemaleLocker;
}

export function isMaleLocker(locker: unknown): locker is ResourceModel {
  return isResource(locker) && locker.category === ResourceType.MaleLocker;
}

export function isLocker(locker: unknown): locker is ResourceModel {
  return isFemaleLocker(locker) || isMaleLocker(locker);
}

export function isKey(key: unknown): key is ResourceModel {
  return isResource(key) && key.modelType === ModelType.HouseKey;
}

export function isVehicle(vehicle: unknown): vehicle is ResourceModel {
  return isResource(vehicle) && vehicle.category === ResourceType.Vehicle;
}

export function isMotorBoat(boat: unknown): boat is ResourceModel {
  return isResource(boat) && boat.category === ResourceType.MotorBoat;
}

export function isOtherResource(res: unknown): res is ResourceModel {
  return isResource(res) && res.category === ResourceType.Other;
}

export function isTask(task: unknown): task is TaskModel {
  return isType(task, new TaskModel);
}

export function isTrip(trip: unknown): trip is TripModel {
  return isType(trip, new TripModel);
}
