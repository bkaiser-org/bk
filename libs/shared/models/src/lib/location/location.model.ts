import { ModelType } from '@bk/categories';
import { BASE_FIELDS, BaseModel, FieldDescription } from '../base/base.model';

export class LocationModel extends BaseModel {
    // url: google
    // name = place address
    // category = LocationType
    public latitude = 0;
    public longitude = 0;
    public placeId = '';
    public what3words = '';
    public height = 406; // meters above sea level
    public speed = 0; // m/s
    public direction = 0; // degrees

    constructor() {
        super();
        this.modelType = ModelType.Location;
    }
}

export const LOCATION_FIELDS: FieldDescription[] = [
  { name: 'latitude',     label: 'latitude',   value: true },
  { name: 'longitude',     label: 'longitude',   value: true },
  { name: 'placeId',     label: 'placeId',   value: true },
  { name: 'what3words',     label: 'what3words',   value: true },
];
export const ALL_LOCATION_FIELDS = BASE_FIELDS.concat(LOCATION_FIELDS);
