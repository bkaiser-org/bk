import { Category } from './category-model';

export type LocationTypeCategory = Category;

export enum LocationType {
    Address,
    Logbuch,
    Geomarker,
    Other
}

export const LocationTypes: LocationTypeCategory[] = [
    {
        id: LocationType.Address,
        abbreviation: 'ADDR',
        name: 'address',
        i18nBase: 'location.type.address',
        icon: 'location-outline'
    },
    {
        id: LocationType.Logbuch,
        abbreviation: 'LOGB',
        name: 'logbuch',
        i18nBase: 'location.type.logbuch',
        icon: 'document-text-outline'
    },
    {
        id: LocationType.Geomarker,
        abbreviation: 'GEO',
        name: 'geomarker',
        i18nBase: 'location.type.geomarker',
        icon: 'locate-outline'
    },
    {
        id: LocationType.Other,
        abbreviation: 'OTHR',
        name: 'other',
        i18nBase: 'location.type.other',
        icon: 'navigate-circle-outline'
    }
]
