import { Injectable, inject } from '@angular/core';
import { BaseService, checkKey } from '@bk/base';
import { CollectionNames, die } from '@bk/util';
import { Observable } from 'rxjs';
import { BaseModel, EventModel, isEvent } from '@bk/models';
import { getEventIndex, getEventIndexInfo } from './event.util';
import { EventInput } from '@fullcalendar/core';
import { ModalController } from '@ionic/angular/standalone';
import { EventEditModalComponent } from './event-edit.modal';


@Injectable({
  providedIn: 'root'
})
export class EventService extends BaseService {
  private modalController = inject(ModalController);

  /*-------------------------- CRUD operations --------------------------------*/
  public async createEvent(event: EventModel | undefined): Promise<void> {
    if (event) {
      event.index = getEventIndex(event);
      const _eventKey = await this.dataService.createModel(CollectionNames.Event, event, `@event.operation.create`);

      if (_eventKey) {
        event = checkKey(event, _eventKey) as EventModel; // make sure the key is set
        if (event.bkey) {
          await this.saveComment(CollectionNames.Event, event.bkey, '@comment.operation.initial.conf');
        }
      }
    }
  }
  
  public readEvent(key: string): Observable<EventModel | undefined> {
    this.currentKey$.next(key);
    return this.dataService.readModel(CollectionNames.Event, key) as Observable<EventModel>;
  }

  public async updateEvent(event: EventModel): Promise<void> {
    event.index = getEventIndex(event);
    await this.dataService.updateModel(CollectionNames.Event, event, `@event.operation.update`);
  }

  public async deleteEvent(event: EventModel): Promise<void> {
    event.isArchived = true;
    await this.dataService.updateModel(CollectionNames.Event, event, `@event.operation.update`);
  }

  /*-------------------------- edit modal  --------------------------------*/
  public async editEvent(event?: EventModel): Promise<void> {
    let _event = event;
    if (!_event) {
      _event = new EventModel();
    }
    const _modal = await this.modalController.create({
      component: EventEditModalComponent,
      componentProps: {
        event: _event
      }
    });
    _modal.present();
    const { data, role } = await _modal.onDidDismiss();
    if (role === 'confirm') {
      if (isEvent(data)) {
        await (!data.bkey) ? this.createEvent(data) : this.updateEvent(data);
      }
    }
  }

  /*-------------------------- search  --------------------------------*/
  public getAllEvents(): Observable<EventModel[]> {
    return this.dataService.listAllModels(CollectionNames.Event) as Observable<EventModel[]>;
  }

  public getEventsOfCalendar(calendarName: string): Observable<EventModel[]> {
    return this.dataService.listModelsBySingleQuery(CollectionNames.Event, 'calendarName', calendarName) as Observable<EventModel[]>;
  }

  /*-------------------------- search index --------------------------------*/
  public getSearchIndex(item: BaseModel): string {
    return getEventIndex(item);
  }

  public getSearchIndexInfo(): string {
    return getEventIndexInfo();
  }

  /*-------------------------- event helpers --------------------------------*/
  public convertEventModelToCalendarEvent(event: EventModel): EventInput {
    if (!event.startDate || event.startDate.length !== 8) die('EventService.convertEventModelToCalendarEvent: event ' + event.bkey + ' has invalid start date: ' + event.startDate);
    if (!event.startTime || event.startTime.length !== 4) {   // fullDay events have no startTime
      if (!event.endDate || event.endDate.length !== 8) { // same day event
        return {
          title: event.name,
          start: this.getIsoDate(event.startDate),
          eventKey: event.bkey
        };
      } else {    // multi day event
        return {
          title: event.name,
          start: this.getIsoDate(event.startDate),
          end: this.getIsoDate(event.endDate),
          eventKey: event.bkey
        };
      }
    } else {      // not a fullday event
      const _endTime = (!event.endTime || event.endTime.length !== 4) ? this.getDefaultEndTime(event.startTime) : event.endTime;
      if (!event.endDate || event.endDate.length !== 8) { // same day event
        return {
          title: event.name,
          start: this.getIsoDateTime(event.startDate, event.startTime),
          end: this.getIsoDateTime(event.startDate, _endTime),
          eventKey: event.bkey
        };
      } else {
        return {
          title: event.name,
          start: this.getIsoDateTime(event.startDate, event.startTime),
          end: this.getIsoDateTime(event.endDate, _endTime),
          eventKey: event.bkey
        };
      }
    }
  }

  private getIsoDate(dateStr: string): string {
    return dateStr.substring(0, 4) + '-' + dateStr.substring(4, 6) + '-' + dateStr.substring(6, 8)
  }

  private getIsoTime(timeStr: string): string {
    return timeStr.substring(0, 2) + ':' + timeStr.substring(2, 4) + ':00';
  }

  private getIsoDateTime(dateStr: string, timeStr: string): string {
    return this.getIsoDate(dateStr) + 'T' + this.getIsoTime(timeStr);
  }

  private getDefaultEndTime(startTime: string): string {
    const _startTime = parseInt(startTime);
    let _endTime = _startTime + 100;
    if (_endTime >= 2400) _endTime = _endTime - 2400; 
    return _endTime + '';
  }
}
