import { ModelType } from '@bk/categories';
import { BaseModel } from '../base/base.model';

export class TripModel extends BaseModel {
    // name: a meaningful name for the trip
    // category : not used for trips 
    // url: can be used with a task to link to additional information
    // tags: used to categorize the trips 
    // description: a detailed description of the trip
    public startDateTime = ''; // date when the trip starts
    public endDateTime = ''; // date when the trip ends
    public resourceKey = ''; // resource.bkey: the resource used for the trip
    public locations: string[] = []; // location.bkey: the locations visited during the trip, ordered by visit
    public persons: string[] = []; // person.bkey: the persons participating in the trip

    constructor() {
        super();
        this.modelType = ModelType.Trip;
    }
}

