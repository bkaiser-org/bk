import { ModelType } from '@bk/categories';
import { BASE_FIELDS, BaseModel, FieldDescription } from '../base/base.model';

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

export const TRIP_FIELDS: FieldDescription[] = [
  { name: 'startDateTime',   label: 'startDateTime',   value: true },
  { name: 'endDateTime',     label: 'endDateTime',   value: true },
  { name: 'resourceKey',     label: 'resourceKey',   value: true },
  { name: 'locations',     label: 'locations',   value: true },
  { name: 'persons',     label: 'persons',   value: true },

];
export const ALL_TRIP_FIELDS = BASE_FIELDS.concat(TRIP_FIELDS);
