import { ModelType } from '@bk/categories';
import { FieldDescription } from '../base/base.model';
import { RELATIONSHIP_FIELDS, RelationshipModel } from '../relationship/relationship.model';

/**
 * This model represents a joined membership and subject model.
 */
export class MembershipSubjectModel extends RelationshipModel {
    public subjectDateOfBirth = '';
    public subjectDateOfDeath = '';
    public subjectPhone = '';
    public subjectEmail = '';
    public subjectStreet = '';
    public subjectZipCode = '';
    public subjectCity = '';

    constructor() {
      super();
      this.modelType = ModelType.MembershipSubject;
    }
}

export const MEMBERSHIP_SUBJECT_FIELDS: FieldDescription[] = [
    { name: 'subjectDateOfBirth',   label: 'dateOfBirth',  value: true },
    { name: 'subjectDateOfDeath',  label: 'dateOfDeath', value: true },
    { name: 'subjectPhone',  label: 'phone', value: true },
    { name: 'subjectEmail',  label: 'email', value: true },
    { name: 'subjectStreet',  label: 'street', value: true },
    { name: 'subjectZipCode',  label: 'zipCode', value: true },
    { name: 'subjectCity',  label: 'city', value: true }
  ];
  export const ALL_MEMBERSHIP_SUBJECT_FIELDS = RELATIONSHIP_FIELDS.concat(MEMBERSHIP_SUBJECT_FIELDS);

