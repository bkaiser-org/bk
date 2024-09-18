import { ModelType, Periodicity } from '@bk/categories';
import { BaseModel } from '../base/base.model';

export class EventModel extends BaseModel {
    // name = title of event
    // category = EventType
    public startDate = '';
    public startTime = '';
    public endDate = '';
    public endTime = '';
    public locationKey = '';
    public periodicity = Periodicity.Once;
    public repeatUntilDate = '';
    public calendarName = '';

    constructor() {
        super();
        this.modelType = ModelType.Event;
    }
}
