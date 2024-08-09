import { Category } from './category-model';

export type ReservationTypeCategory = Category;

export enum ReservationType {
    SocialEvent,
    Maintenance,
    SportsEvent,
    BusinessEvent,
    PrivateEvent,
    PublicEvent,
    StoragePlace,
    ClubEvent
}

export const ReservationTypes: ReservationTypeCategory[] = [
    {
        id: ReservationType.SocialEvent,
        abbreviation: 'SOC',
        name: 'socialEvent',
        i18nBase: 'reservation.type.socialEvent',
        icon: 'people-outline'
    },
    {
        id: ReservationType.Maintenance,
        abbreviation: 'MAINT',
        name: 'maintenance',
        i18nBase: 'reservation.type.maintenance',
        icon: 'build-outline'
    },
    {
        id: ReservationType.SportsEvent,
        abbreviation: 'SPORT',
        name: 'sportsEvent',
        i18nBase: 'reservation.type.sportsEvent',
        icon: 'barbell-outline'
    },
    {
        id: ReservationType.BusinessEvent,
        abbreviation: 'BIZ',
        name: 'businessEvent',
        i18nBase: 'reservation.type.businessEvent',
        icon: 'calendar-outline'
    },
    {
        id: ReservationType.PrivateEvent,
        abbreviation: 'PRIV',
        name: 'privateEvent',
        i18nBase: 'reservation.type.privateEvent',
        icon: 'lock-closed-outline'
    },
    {
        id: ReservationType.PublicEvent,
        abbreviation: 'PUB',
        name: 'publicEvent',
        i18nBase: 'reservation.type.publicEvent',
        icon: 'lock-open-outline'
    },
    {
        id: ReservationType.StoragePlace,
        abbreviation: 'STORE',
        name: 'storagePlace',
        i18nBase: 'reservation.type.storagePlace',
        icon: 'location-outline'
    },
    {
      id: ReservationType.ClubEvent,
      abbreviation: 'CLUB',
      name: 'clubEvent',
      i18nBase: 'reservation.type.clubEvent',
      icon: 'medal-outline'
  }
]
