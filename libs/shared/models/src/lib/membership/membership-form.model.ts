import { DeepPartial, DeepRequired } from 'ngx-vest-forms';

export type MembershipFormModel = DeepPartial<{
  bkey: string,
  membershipId: string,   // name
  firstName: string,    // subjectName2
  lastName:  string,    // subjectName
  gender: number,       // subjectCategory (if person, else orgtype)
  subjectType: number,         // subjectType:   Person = 0, Org = 2, Group = 5
  price: number,
  dateOfEntry: string,  // validFrom
  dateOfExit: string,   // validTo
  memberKey: string,        // bkey
  memberState: number,    // state
  memberCategory: number,  // subType
  memberUrl: string,      // url, member avatar
  orgName: string,        // objectName
  orgUrl: string,         // objectUrl, org avatar
  orgId: string,         // objectKey
  bexioId: string,      // property: bexioId
  abbreviation: string,  // property: abbreviation
  orgFunction: string,  // property: orgFunction
  nickName: string,     // property: nickName
  dateOfBirth: string,   // property: dateOfBirth
  zipCode: string,      // property: zipCode
  tags: string,
  notes: string         // description
}>;

export const membershipFormModelShape: DeepRequired<MembershipFormModel> = {
  bkey: '',
  membershipId: '',
  firstName: '',
  lastName: '',
  gender: -1,
  subjectType: -1,
  price: 0,
  dateOfEntry: '',
  dateOfExit: '',
  memberKey: '',
  memberState: -1,
  memberCategory: -1,
  memberUrl: '',
  orgName: '',
  orgUrl: '',
  orgId: '',
  bexioId: '',
  abbreviation: '',
  orgFunction: '',
  nickName: '',
  dateOfBirth: '',
  zipCode: '',
  tags: '',
  notes: ''
};
 