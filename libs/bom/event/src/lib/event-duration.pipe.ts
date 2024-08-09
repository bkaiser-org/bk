import { Pipe, PipeTransform } from '@angular/core';
import { EventModel } from '@bk/models';
import { DateFormat, convertDateFormatToString } from '@bk/util';

@Pipe({
  name: 'eventDuration',
  standalone:true
})
export class EventDurationPipe implements PipeTransform {

  transform(event: EventModel): string {
    let _fromDateTime = '';
    if (event.startDate && event.startDate.length > 0) {
      _fromDateTime = convertDateFormatToString(event.startDate, DateFormat.StoreDate, DateFormat.ViewDate, false);
    }
    if (event.startTime && event.startTime.length > 0) {
      _fromDateTime =  _fromDateTime.length > 0 ? _fromDateTime + ' ' + event.startTime : event.startTime;
    }

    let _toDateTime = '';
    if (event.endDate && event.endDate.length > 0 && !event.startDate.startsWith(event.endDate)) {
      _toDateTime = convertDateFormatToString(event.endDate, DateFormat.StoreDate, DateFormat.ViewDate, false);
    }
    if (event.endTime && event.endTime.length > 0) {
      _toDateTime = _toDateTime.length > 0 ? _toDateTime + ' ' + event.endTime : event.endTime;
    }
    return _fromDateTime + ' - ' + _toDateTime;
  }
}