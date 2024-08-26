import { Category } from './category-model';

export type ReservationStateCategory = Category;

export enum ReservationState {
  Initial,
  Applied,    // to be confirmed
  Active,     // confirmed, next: pay and execute
  Completed,    // paid and executed
  Cancelled,
  Denied
}

export const ReservationStates: ReservationStateCategory[] = [
  {
    id: ReservationState.Initial,
    abbreviation: 'INIT',
    name: 'initial',
    i18nBase: 'reservation.state.initial',
    icon: 'bulb-outline'
  },
  {
    id: ReservationState.Applied,
    abbreviation: 'APLD',
    name: 'applied',
    i18nBase: 'reservation.state.applied',
    icon: 'help-outline'
  },
  {
    id: ReservationState.Active,
    abbreviation: 'ACTV',
    name: 'active',
    i18nBase: 'reservation.state.active',
    icon: 'thumbs-up-outline'
  },
  {
    id: ReservationState.Completed,
    abbreviation: 'CMPL',
    name: 'completed',
    i18nBase: 'reservation.state.completed',
    icon: 'checkmark-outline'
  },
  {
    id: ReservationState.Cancelled,
    abbreviation: 'CNCL',
    name: 'cancelled',
    i18nBase: 'reservation.state.cancelled',
    icon: 'close-outline'
  },
  {
    id: ReservationState.Denied,
    abbreviation: 'DENY',
    name: 'denied',
    i18nBase: 'reservation.state.denied',
    icon: 'thumbs-down-outline'
  }
]
