import { ModelType, Periodicity } from '@bk/categories';
import { BaseModel } from '../base/base.model';

export class EventModel extends BaseModel {
    // name = title of event
    // category = EventType
    public startDate = '';
    public startTime = '';
    public endDate = '';
    public endTime = '';
    public locationKey = '';  // name@key, e.g. 'Bucharest@qwerlkjqrw869sdf'
    public periodicity = Periodicity.Once;
    public repeatUntilDate = '';
    public calendarName = '';
    public responsiblePersons = '';  // [personKey[,personKey,...]]@[personName[,personName,...]]

    constructor() {
        super();
        this.modelType = ModelType.Event;
    }
}
