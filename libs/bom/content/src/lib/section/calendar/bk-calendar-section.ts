import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit, inject, input } from '@angular/core';
import { SectionModel } from '@bk/models';
import { IonCard, IonCardContent } from '@ionic/angular/standalone';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import deLocal from '@fullcalendar/core/locales/de';
import { EventService } from '@bk/event';
import { Observable, firstValueFrom, map } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { warn } from '@bk/util';

@Component({
  selector: 'bk-calendar-section',
  standalone: true,
  styles: [`
  ion-card-content { padding: 0px; }
  ion-card { padding: 0px; margin: 0px; border: 0px; box-shadow: none !important;}
  full-calendar {
    width: 100%;
  height: 800px;
}
  `],
  imports: [
    AsyncPipe,
    FullCalendarModule,
    IonCard, IonCardContent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    @if(section(); as section) {
      <ion-card>
        <ion-card-content>
          <ion-item>
            @if(events$ | async; as events) {
              <full-calendar 
                [options]="calendarOptions"
                [events]="events"
              />
            }
          </ion-item>
        </ion-card-content>
      </ion-card>
    }
  `
})
export class CalendarSectionComponent implements OnInit {
  private eventService = inject(EventService);

  public section = input<SectionModel>();

  public hasLoaded = false;
  public events$: Observable<EventInput[]> | undefined;

  calendarOptions: CalendarOptions = {
    initialView: 'timeGridWeek',
    locale: deLocal,
    slotMinTime: '05:00:00',
    slotMaxTime: '22:00:00',
    editable: true,
    dateClick: (arg) => { this.onDateClick(arg); },
    eventClick: (arg) => { this.onEventClick(arg); },
    headerToolbar: {
      left: 'prev,next today',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin]
  };

 /*  events: [
    { title: 'event 1', date: '2024-03-25' },
    { title: 'event 2', date: '2024-03-27' },
    { title: 'test 1', start: '2024-03-26T14:30:00', end: '2024-03-26T16:45:00', backgroundColor: 'green'},
    { title: 'test 2', start: '2024-03-26T13:30:00', end: '2024-03-26T15:30:00', backgroundColor: 'red'},
  ]
 */

  async ngOnInit() {
    // load and convert the events here
    this.events$ = this.eventService.getAllEvents().pipe(map(events => {
      return events.map(_event => {
        return this.eventService.convertEventModelToCalendarEvent(_event);
      });
    }));

    // angular component calls render() from ngAfterViewInit() which is too early for fullcalendar in Ionic (should be in ionViewDidLoad())
    // the calendar renders correctly if render() is called after the page is loaded, e.g. by resizing the window.
    // that's what this hack is doing: trigger resize window after 1ms
    setTimeout( function() {
      window.dispatchEvent(new Event('resize'))
    }, 1);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onDateClick(arg: any) {
    console.log('date selected: ', arg);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async onEventClick(arg: any) {
    const _eventKey = arg.event.extendedProps.eventKey;
    console.log('event selected: ' + _eventKey);
    const _event = await firstValueFrom(this.eventService.readEvent(_eventKey));
    if (!_event) {
      warn('CalendarSectionComponent.onEventClick: event ' + _eventKey + ' not found');
    } else {
      await this.eventService.editEvent(_event);
    }
  }
}