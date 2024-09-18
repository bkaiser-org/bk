import { CategoryType, ModelType } from '@bk/categories';
import { BaseModel } from '../base/base.model';

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
