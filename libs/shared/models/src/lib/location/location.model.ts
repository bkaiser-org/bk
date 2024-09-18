import { ModelType } from '@bk/categories';
import { BaseModel } from '../base/base.model';

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
