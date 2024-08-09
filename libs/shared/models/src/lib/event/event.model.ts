import { ModelType, Periodicity } from '@bk/categories';
import { BASE_FIELDS, BaseModel, FieldDescription } from '../base/base.model';

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

export const EVENT_FIELDS: FieldDescription[] = [
  { name: 'startDate',     label: 'startDate',   value: true },
  { name: 'endDate',     label: 'endDate',   value: true },
  { name: 'startTime',     label: 'startTime',   value: true },
  { name: 'endTime',     label: 'endTime',   value: true },
  { name: 'locationKey',     label: 'locationKey',   value: true },
  { name: 'periodicity',     label: 'periodicity',   value: true },
  { name: 'repeatUntilDate',     label: 'repeatUntilDate',   value: true },
  { name: 'calendarName',     label: 'calendarName',   value: true },
];
export const ALL_EVENT_FIELDS = BASE_FIELDS.concat(EVENT_FIELDS);
