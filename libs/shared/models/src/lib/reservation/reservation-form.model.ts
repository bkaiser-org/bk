import { ReservationState, ReservationType } from "@bk/categories";
import { DeepPartial, DeepRequired } from 'ngx-vest-forms';

export type ReservationFormModel = DeepPartial<{
  bkey: string,
  name: string,   // name = title of the event or resource
  firstName: string,    // subjectName2
  lastName:  string,    // subjectName
  subjectKey: string,      // foreign key to the subject
  subjectCategory: number,       // person: gender, org: orgtype, group: OrgType.Group = 4
  subjectType: number,         // subjectType:   Person = 0, Org = 2, Group = 5
  price: number,       
  validFrom: string,  // validFrom
  validTo: string,   // validTo
  objectKey: string,
  objectType: number,        // Boat 3 or Resource 4
  objectCategory: number,    // Boat: BoatType, Resource: ResourceType
  state: ReservationState,
  type: ReservationType,
  startTime: string,         // Zeit, Nachmittag, Abend, ganztägig
  endTime: string,
  // resource properties
  participants: string,
  area: string,            // Areal, z.B. Halle, Werkstatt, Küche
  reference: string,   // Referenz auf die Reservierung, z.B. Email:Datum
  confirmed: boolean,
  load: string,
  currentValue: number,
  hexColor: string,
  tenant: string,
  tags: string,
  notes: string         // description
}>;

export const reservationFormModelShape: DeepRequired<ReservationFormModel> = {
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
  state: 0,
  type: 0,
  startTime: '',
  endTime: '',
  participants: '',
  area: '',
  reference: '',
  confirmed: false,
  load: '',
  currentValue: 0,
  hexColor: '',
  tenant: '',
  tags: '',
  notes: ''
};
