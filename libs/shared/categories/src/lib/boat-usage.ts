import { Category } from './category-model';

export type BoatUsageCategory = Category;

export enum BoatUsage {
    Kandidierende,
    Breitensport,
    Routinierte,
    Leistungssport,
    Private
}

export const BoatUsages: BoatUsageCategory[] = [
  {
    id: BoatUsage.Kandidierende,
    abbreviation: 'Kand',
    name: 'kandidierende',
    i18nBase: 'resource.boat.usage.kandidierende',
    icon: 'boat-outline'
},
    {
        id: BoatUsage.Breitensport,
        abbreviation: 'BSP',
        name: 'breitensport',
        i18nBase: 'resource.boat.usage.breitensport',
        icon: 'boat-outline'
    },
    {
        id: BoatUsage.Routinierte,
        abbreviation: 'ROUT',
        name: 'routinierte',
        i18nBase: 'resource.boat.usage.routinierte',
        icon: 'boat-outline'
    },
    {
        id: BoatUsage.Leistungssport,
        abbreviation: 'LSP',
        name: 'leistungssport',
        i18nBase: 'resource.boat.usage.leistungssport',
        icon: 'boat-outline'
    },
    {
        id: BoatUsage.Private,
        abbreviation: 'PRIV',
        name: 'private',
        i18nBase: 'resource.boat.usage.private',
        icon: 'finger-print-outline'
    }
]
