import { GenderType, ModelType, OrgType } from '@bk/categories';
import { BASE_FIELDS, BaseModel, FieldDescription } from '../base/base.model';

export class SubjectModel extends BaseModel {
    public firstName = '';
    // lastName = name
    // category : Gender | OrgType
    public taxId = '';
    public dateOfBirth = '';
    public dateOfDeath = '';
    public fav_email = '';
    public fav_phone = '';
    public fav_street = '';
    public fav_zip = '';
    public fav_city = '';
    public fav_country = '';
    public bexioId = '';

    constructor() {
        super();
        this.modelType = ModelType.Subject;
    }
}

export const SUBJECT_FIELDS: FieldDescription[] = [
  { name: 'firstName',     label: 'firstName',   value: true },
  { name: 'taxId',           label: 'taxid',     value: false },
  { name: 'dateOfBirth',   label: 'dateOfBirth',   value: true },
  { name: 'dateOfDeath',   label: 'dateOfDeath',   value: false },
  { name: 'fav_email', label: 'email', value: true },
  { name: 'fav_phone', label: 'phone', value: false },
  { name: 'fav_street', label: 'street', value: true },
  { name: 'fav_zip', label: 'zip', value: true },
  { name: 'fav_city', label: 'city', value: true },
  { name: 'fav_country', label: 'country', value: true },
];
export const ALL_SUBJECT_FIELDS = BASE_FIELDS.concat(SUBJECT_FIELDS);

export interface MemberInfo {
  orgId: string | undefined,
  dateOfEntry: string,
  dateOfExit: string,
  memberCategory: number,
  function: string,
  abbreviation: string,
  nickName: string
}

/**
 * Create a new organization with default values.
 * @returns the new organisation subject
 */
export function newOrgModel(): SubjectModel {
  const _org = new SubjectModel();
  _org.category = OrgType.Association as number;
  _org.modelType = ModelType.Org;
  return _org;
}

/**
 * Create a new person with default values.
 * @returns the new person subject
 */
export function newPersonModel(): SubjectModel {
  const _org = new SubjectModel();
  _org.category = GenderType.Male as number;
  _org.modelType = ModelType.Person;
  return _org;
}

/**
 * Create a new group with default values.
 * @returns the new group subject
 */
export function newGroupModel(): SubjectModel {
  const _org = new SubjectModel();
  _org.category = OrgType.Group as number;
  _org.modelType = ModelType.Org;
  return _org;
}
