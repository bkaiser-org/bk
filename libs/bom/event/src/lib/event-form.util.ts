import { Periodicity } from '@bk/categories'
import { EventFormModel, EventModel } from '@bk/models'
import { DateFormat, getTodayStr } from '@bk/util';

export function newEventFormModel(): EventFormModel {
  return {
    bkey: '',
    name: '',
    type: -1,
    startDate: getTodayStr(DateFormat.StoreDate),
    endDate: getTodayStr(DateFormat.StoreDate),
    startTime: '',
    endTime: '',
    repeatUntilDate: '',
    locationKey: '',
    calendarName: '',
    periodicity: Periodicity.Once,
    url: '',
    notes: '',
    tags: ''
  }
}

export function convertEventToForm(event: EventModel | undefined): EventFormModel {
  if (!event) return newEventFormModel();
  return {
    bkey: event.bkey,
    name: event.name,
    type: event.category,
    startDate: event.startDate,
    startTime: event.startTime,
    endDate: event.endDate,
    endTime: event.endTime,
    locationKey: event.locationKey,
    calendarName: event.calendarName,
    periodicity: event.periodicity,
    repeatUntilDate: event.repeatUntilDate,
    url: event.url,
    notes: event.description,
    tags: event.tags,
  }
}

export function convertFormToEvent(vm: EventFormModel): EventModel {
  const _event = new EventModel();
  _event.bkey = vm.bkey ?? '';
  _event.category = vm.type ?? -1;
  _event.name = vm.name ?? '';
  _event.startDate = vm.startDate ?? '';
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  _event.startTime = vm.startTime!;
  _event.endDate = vm.endDate ?? _event.startDate;
  _event.endTime = vm.endTime ?? '';
  _event.locationKey = vm.locationKey ?? '';
  _event.calendarName = vm.calendarName ?? '';
  _event.periodicity = vm.periodicity ?? Periodicity.Once;
  _event.repeatUntilDate = vm.repeatUntilDate ?? '';
  _event.url = vm.url ?? '';
  _event.description = vm.notes ?? '';
  _event.tags = vm.tags ?? '';
  return _event;
}



