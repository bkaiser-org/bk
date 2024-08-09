import { Category } from './category-model';

export type PeriodicityTypeCategory = Category;

export enum Periodicity {
    Once,
    Daily,
    Workdays,
    Weekly,
    Biweekly,
    Monthly,
    Quarterly,
    Yearly,
    Other
}

export const PeriodicityTypes: PeriodicityTypeCategory[] = [
    {
        id: Periodicity.Once,
        abbreviation: 'ONCE',
        name: 'once',
        i18nBase: 'event.periodicity.once',
        icon: 'help-outline'
    },
    {
        id: Periodicity.Daily,
        abbreviation: 'DAILY',
        name: 'daily',
        i18nBase: 'event.periodicity.daily',
        icon: 'help-outline'
    },
    {
        id: Periodicity.Workdays,
        abbreviation: 'WDAY',
        name: 'workdays',
        i18nBase: 'event.periodicity.workdays',
        icon: 'help-outline'
    },
    {
        id: Periodicity.Weekly,
        abbreviation: 'WEEK',
        name: 'weekly',
        i18nBase: 'event.periodicity.weekly',
        icon: 'help-outline'
    },
    {
        id: Periodicity.Biweekly,
        abbreviation: 'BIWK',
        name: 'biweekly',
        i18nBase: 'event.periodicity.biweekly',
        icon: 'help-outline'
    },
    {
        id: Periodicity.Monthly,
        abbreviation: 'MTH',
        name: 'monthly',
        i18nBase: 'event.periodicity.monthly',
        icon: 'help-outline'
    },
    {
        id: Periodicity.Quarterly,
        abbreviation: 'QTR',
        name: 'quarterly',
        i18nBase: 'event.periodicity.quarterly',
        icon: 'help-outline'
    },
    {
        id: Periodicity.Yearly,
        abbreviation: 'YEAR',
        name: 'yearly',
        i18nBase: 'event.periodicity.yearly',
        icon: 'help-outline'
    },
    {
        id: Periodicity.Other,
        abbreviation: 'OTHR',
        name: 'other',
        i18nBase: 'event.periodicity.other',
        icon: 'help-outline'
    },

]
