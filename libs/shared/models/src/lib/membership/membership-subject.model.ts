import { ModelType } from '@bk/categories';
import { RelationshipModel } from '../relationship/relationship.model';

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
