import { CategoryType, ModelType } from '@bk/categories';
import { BASE_FIELDS, BaseModel, FieldDescription } from '../base/base.model';
import { END_FUTURE_DATE_STR } from '@bk/util';
import { SubjectModel } from '../subject/subject.model';

export interface RelationshipProperties {
  bexioId?: string,
  dateOfBirth?: string,
  dateOfDeath?: string,
  zipCode?: string,
  abbreviation?: string,
  orgFunction?: string,
  nickName?: string,
  participants?: string,
  startTime?: string,
  endTime?: string,
  area?: string,
  reservationRef?: string,
  note?: string
}

export class RelationshipModel extends BaseModel {
  // bkey
  // category: RelationshipType (Ownership, Membership...)
  // url: = subjectUrl (typically the person avatar)
  // name: name of Relationship, this can also be the id (e.g. member ID)
  // but normally it is subjectName/objectName
    public subject?: SubjectModel;
    public dateOfDeath?: string;
    public subjectKey = '';
    public subjectName = '';  // name of subject, e.g. lastname
    public subjectName2 = ''; // e.g. firstname of subject
    public subjectType = ModelType.Person; // modeltype of subject
    public subjectCategory = CategoryType.Undefined as number; // category from subject -> gender (for Person)
    public objectKey = '';
    public objectName = ''; // name of object, e.g. lastname
    public objectName2 = ''; // e.g. firstname of object
    public objectUrl = ''; // e.g. image of boat or resource
    public objectType = ModelType.Resource; // modeltype of object
    public objectCategory = CategoryType.Undefined as number; // category from object (e.g. orgType for orgs)
    public price = CategoryType.Undefined as number;    // tbd: convert to Price object (with currency, tax, periodicity)
    public validFrom = ''; // membership: entryDate
    public validTo = END_FUTURE_DATE_STR;   // membership: exitDate
    public count = '1';  // e.g. how many same keys are owned
    public priority = CategoryType.Undefined as number;  // e.g. relevant for reservations (waiting list)
    public state = CategoryType.Undefined as number; // depending on category/relationshipType: membership-state, ownership-state
    public subType = CategoryType.Undefined as number;  // the subType of a relationship, e.g. MemberType for Memberships
    public properties: RelationshipProperties = {};
    public relLog = ''; // log of changes in the relationship  (e.g. for memberships:   20200715:K->A->P)
    public relIsLast = true; // is this the last relationship of the same kind ? (building a linked list of relationships, ordered by priority)
  // index
  // isArchived
  // isTest
  // tags
  // modelType:  ModelType.Relationship
    // description

    constructor() {
      super();
      this.modelType = ModelType.Relationship;
    }
}

export const RELATIONSHIP_FIELDS: FieldDescription[] = [
    { name: 'subjectKey',   label: 'subjectKey',  value: true },
    { name: 'subjectName',  label: 'subjectName', value: true },
    { name: 'subjectName2',  label: 'subjectName2', value: true },
    { name: 'subjectType',  label: 'subjectType', value: true },
    { name: 'subjectCategory',  label: 'subjectCategory', value: true },
    { name: 'objectKey',    label: 'objectKey',   value: true },
    { name: 'objectName',   label: 'objectName',  value: true },
    { name: 'objectName2',   label: 'objectName2',  value: true },
    { name: 'objectUrl',    label: 'objectUrl',   value: true },
    { name: 'objectType',   label: 'objectType',  value: true },
    { name: 'objectCategory',   label: 'objectCategory',  value: true },
    { name: 'price',        label: 'price',       value: true },
    { name: 'validFrom',    label: 'validFrom',   value: true },
    { name: 'validTo',      label: 'validTo',     value: true },
    { name: 'count',        label: 'count',       value: true },
    { name: 'priority',     label: 'priority',    value: true },
    { name: 'state',        label: 'state',       value: true },
    { name: 'subType',        label: 'subType',       value: true }
  ];
  export const ALL_RELATIONSHIP_FIELDS = BASE_FIELDS.concat(RELATIONSHIP_FIELDS);

