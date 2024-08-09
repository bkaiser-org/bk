import { Category } from './category-model';

export enum EventType {
    GeneralAssembly,
    BoardMeeting,
    ProjectMeeting,
    Training,
    Competition,
    SocialEvent,
    SportEvent,
    BusinessEvent,
    Todo,
    Offtime,
    Reservation,
    Retrospective,
    Daily,
    Planning,
    Grooming,
    Sync,
    Presentation,
    Teammeeting,
    Other
}

export type EventTypeCategory = Category;

export const EventTypes: EventTypeCategory[] = [
  {
    id: EventType.GeneralAssembly,
    abbreviation: 'GA',
    name: 'generalAssembly',
    i18nBase: 'event.type.generalAssembly',
    icon: 'help-outline'
  },
  {
    id: EventType.BoardMeeting,
    abbreviation: 'BRD',
    name: 'boardMeeting',
    i18nBase: 'event.type.boardMeeting',
    icon: 'help-outline'
  },
  {
    id: EventType.ProjectMeeting,
    abbreviation: 'PROJ',
    name: 'projectMeeting',
    i18nBase: 'event.type.projectMeeting',
    icon: 'help-outline'
  },
  {
    id: EventType.Training,
    abbreviation: 'TRAIN',
    name: 'training',
    i18nBase: 'event.type.training',
    icon: 'help-outline'
  },
  {
    id: EventType.Competition,
    abbreviation: 'COMP',
    name: 'competition',
    i18nBase: 'event.type.competition',
    icon: 'help-outline'
  },
  {
    id: EventType.SocialEvent,
    abbreviation: 'SOC',
    name: 'socialEvent',
    i18nBase: 'event.type.socialEvent',
    icon: 'help-outline'
  },
  {
    id: EventType.SportEvent,
    abbreviation: 'SPORT',
    name: 'sportEvent',
    i18nBase: 'event.type.sportEvent',
    icon: 'help-outline'
  },
  {
    id: EventType.BusinessEvent,
    abbreviation: 'BIZ',
    name: 'businessEvent',
    i18nBase: 'event.type.businessEvent',
    icon: 'help-outline'
  },
  {
    id: EventType.Todo,
    abbreviation: 'TODO',
    name: 'todo',
    i18nBase: 'event.type.todo',
    icon: 'help-outline'
  },
  {
    id: EventType.Offtime,
    abbreviation: 'OFF',
    name: 'off',
    i18nBase: 'event.type.off',
    icon: 'help-outline'
  },
  {
    id: EventType.Reservation,
    abbreviation: 'RES',
    name: 'reservation',
    i18nBase: 'event.type.reservation',
    icon: 'help-outline'
  },
  {
    id: EventType.Retrospective,
    abbreviation: 'RETRO',
    name: 'retro',
    i18nBase: 'event.type.retro',
    icon: 'help-outline'
  },
  {
    id: EventType.Daily,
    abbreviation: 'DAILY',
    name: 'daily',
    i18nBase: 'event.type.daily',
    icon: 'help-outline'
  },
  {
    id: EventType.Planning,
    abbreviation: 'PLAN',
    name: 'planning',
    i18nBase: 'event.type.planning',
    icon: 'help-outline'
  },
  {
    id: EventType.Grooming,
    abbreviation: 'GROOM',
    name: 'grooming',
    i18nBase: 'event.type.grooming',
    icon: 'help-outline'
  },
  {
    id: EventType.Sync,
    abbreviation: 'SYNC',
    name: 'sync',
    i18nBase: 'event.type.sync',
    icon: 'help-outline'
  },
  {
    id: EventType.Presentation,
    abbreviation: 'PRES',
    name: 'presentation',
    i18nBase: 'event.type.presentation',
    icon: 'help-outline'
  },
  {
    id: EventType.Teammeeting,
    abbreviation: 'TM',
    name: 'team',
    i18nBase: 'event.type.team',
    icon: 'help-outline'
  },
  {
    id: EventType.Other,
    abbreviation: 'OTHR',
    name: 'other',
    i18nBase: 'event.type.other',
    icon: 'help-outline'
  }
]
