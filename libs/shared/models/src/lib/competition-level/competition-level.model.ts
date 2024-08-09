import { CategoryType, ModelType } from '@bk/categories';
import { BASE_FIELDS, BaseModel, FieldDescription } from '../base/base.model';

export class CompetitionLevelModel extends BaseModel {
    public firstName = '';
    // lastName = name
    // url = avatar url / portrait photo
    // category : Gender
    public personKey = '';
    public dateOfBirth = '';
    public competitionLevel = CategoryType.Undefined as number; // derived from dateOfBirth
    public scsMembershipKey = '';
    public scsMemberType = CategoryType.Undefined as number;  // only active members are kept in this collection
    public srvMembershipKey = '';
    public srvMemberId = '';
    public srvMemberType = CategoryType.Undefined as number;    // for consistency checks
    public srvLicenseOwnershipKey = '';
    public srvLicenseValidUntil = '';

    constructor() {
        super();
        this.modelType = ModelType.CompetitionLevel;
    }
}

export const COMPETITION_LEVEL_FIELDS: FieldDescription[] = [
  { name: 'firstName',     label: 'firstName',   value: true },
  { name: 'personKey',   label: 'personKey',   value: true },
  { name: 'dateOfBirth',         label: 'dateOfBirth',   value: true },
  { name: 'competitionLevel',           label: 'competitionLevel',     value: true },
  { name: 'scsMembershipKey',   label: 'scsMembershipKey',   value: true },
  { name: 'scsMemberType',   label: 'scsMemberType',   value: true },
  { name: 'srvMembershipKey', label: 'srvMembershipKey', value: true },
  { name: 'srvMemberId', label: 'srvMemberId', value: true },
  { name: 'srvMemberType', label: 'srvMemberType', value: true },
  { name: 'srvLicenseOwnershipKey', label: 'srvLicenseOwnershipKey', value: true },
  { name: 'srvLicenseValidUntil', label: 'srvLicenseValidUntil', value: true }
];
export const ALL_COMPETITION_LEVEL_FIELDS = BASE_FIELDS.concat(COMPETITION_LEVEL_FIELDS);
