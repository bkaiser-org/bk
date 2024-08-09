import { Category } from './category-model';

export type BoatUsageCategory = Category;

export enum BoatUsage {
    CGig,
    Breitensport1E,
    Breitensport2E,
    BreitensportSkiff,
    Regattierende,
    Private
}

export const BoatUsages: BoatUsageCategory[] = [
    {
        id: BoatUsage.CGig,
        abbreviation: 'CGig',
        name: 'cGig',
        i18nBase: 'resource.boat.usage.cGig',
        icon: 'boat-outline'
    },
    {
        id: BoatUsage.Breitensport1E,
        abbreviation: 'BS1E',
        name: 'breitensport1E',
        i18nBase: 'resource.boat.usage.breitensport1E',
        icon: 'boat-outline'
    },
    {
        id: BoatUsage.Breitensport2E,
        abbreviation: 'BS2E',
        name: 'breitensport2E',
        i18nBase: 'resource.boat.usage.breitensport2E',
        icon: 'boat-outline'
    },
    {
        id: BoatUsage.BreitensportSkiff,
        abbreviation: 'BSS',
        name: 'breitensportSkiff',
        i18nBase: 'resource.boat.usage.breitensportSkiff',
        icon: 'boat-outline'
    },
    {
        id: BoatUsage.Regattierende,
        abbreviation: 'LS',
        name: 'regattierende',
        i18nBase: 'resource.boat.usage.regattierende',
        icon: 'medal-outline'
    },
    {
        id: BoatUsage.Private,
        abbreviation: 'PRIV',
        name: 'private',
        i18nBase: 'resource.boat.usage.private',
        icon: 'finger-print-outline'
    }
]
