import { Category } from './category-model';

export enum BoatType {
    b1x,
    b2m,
    b2x,
    b2p,
    b2mx,
    b3x,
    b4m,
    b4x,
    b5x,
    b8p
}

export type BoatTypeCategory = Category;

export const BoatTypes: BoatTypeCategory[] = [
    {
        id: BoatType.b1x,
        abbreviation: '1x',
        name: 'b1x',
        i18nBase: 'resource.boat.type.b1x',
        icon: 'boat-outline'
    },
    {
        id: BoatType.b2m,
        abbreviation: '2-',
        name: 'b2m',
        i18nBase: 'resource.boat.type.b2m',
        icon: 'boat-outline'
    },
    {
        id: BoatType.b2x,
        abbreviation: '2x',
        name: 'b2x',
        i18nBase: 'resource.boat.type.b2x',
        icon: 'boat-outline'
    },
    {
        id: BoatType.b2p,
        abbreviation: '2+',
        name: 'b2p',
        i18nBase: 'resource.boat.type.b2p',
        icon: 'boat-outline'
    },
    {
        id: BoatType.b2mx,
        abbreviation: '2-/2x',
        name: 'b2mx',
        i18nBase: 'resource.boat.type.b2mx',
        icon: 'boat-outline'
    },
    {
        id: BoatType.b3x,
        abbreviation: '3x',
        name: 'b3x',
        i18nBase: 'resource.boat.type.b3x',
        icon: 'boat-outline'
    },
    {
        id: BoatType.b4m,
        abbreviation: '4-',
        name: 'b4m',
        i18nBase: 'resource.boat.type.b4m',
        icon: 'boat-outline'
    },
    {
        id: BoatType.b4x,
        abbreviation: '4x',
        name: 'b4x',
        i18nBase: 'resource.boat.type.b4x',
        icon: 'boat-outline'
    },
    {
        id: BoatType.b5x,
        abbreviation: '5x',
        name: 'b5x',
        i18nBase: 'resource.boat.type.b5x',
        icon: 'boat-outline'
    },
    {
        id: BoatType.b8p,
        abbreviation: '8+',
        name: 'b8p',
        i18nBase: 'resource.boat.type.b8p',
        icon: 'boat-outline'
    },

]
