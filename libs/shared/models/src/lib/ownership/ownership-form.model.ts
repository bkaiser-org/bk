import { DeepPartial, DeepRequired } from 'ngx-vest-forms';

export type OwnershipFormModel = DeepPartial<{
  bkey: string,
  name: string,   // name
  firstName: string,    // subjectName2
  lastName:  string,    // subjectName
  subjectKey: string,
  subjectCategory: number,       // person: gender, org: orgtype, group: OrgType.Group = 4
  subjectType: number,         // subjectType:   Person = 0, Org = 2, Group = 5
  price: number,       
  validFrom: string,  // validFrom
  validTo: string,   // validTo
  objectKey: string,
  objectType: number,        // Boat 3 or Resource 4
  objectCategory: number,    // Boat: BoatType, Resource: ResourceType
  tags: string,
  notes: string         // description
}>;

export const ownershipFormModelShape: DeepRequired<OwnershipFormModel> = {
  bkey: '',
  name: '',
  firstName: '',
  lastName: '',
  subjectKey: '',
  subjectCategory: -1,
  subjectType: -1,
  price: 0,
  validFrom: '',
  validTo: '',
  objectKey: '',
  objectType: -1,
  objectCategory: -1,
  tags: '',
  notes: ''
};