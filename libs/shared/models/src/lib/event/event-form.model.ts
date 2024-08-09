import { DeepPartial, DeepRequired } from 'ngx-vest-forms';

// a form model is always deep partial because angular will create it over time organically
export type EventFormModel = DeepPartial<{
  bkey: string,
  name: string,
  type: number,
  startDate: string,
  startTime: string,
  endDate: string,
  endTime: string,
  locationKey: string,
  periodicity: number,
  repeatUntilDate: string,
  calendarName: string,
  url: string,
  notes: string,
  tags: string,
}>;

export const eventFormModelShape: DeepRequired<EventFormModel> = {
  bkey: '',
  name: '',
  type: -1,
  startDate: '',
  startTime: '',
  endDate: '',
  endTime: '',
  locationKey: '',
  periodicity: -1,
  repeatUntilDate: '',
  calendarName: '',
  url: '',
  notes: '',
  tags: ''
};