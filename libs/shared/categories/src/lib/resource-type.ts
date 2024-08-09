import { Category } from './category-model';

export type ResourceTypeCategory = Category;

// used for category validations
export enum ResourceModelType {
  Boat = 3,
  Resource = 4
}

export enum ResourceType {
    Undefined,
    RowingBoat,
    Other,
    MotorBoat,
    Vehicle,
    MaleLocker,
    FemaleLocker,
    HouseKey,
    License,
    Contract,
    Document,
    RealEstate
}

export const ResourceTypes: ResourceTypeCategory[] = [
  {
    id: ResourceType.Undefined,
    abbreviation: 'UNDEF',
    name: 'undefined',
    i18nBase: 'resource.type.undefined',
    icon: 'help-outline'
  },
  {
    id: ResourceType.RowingBoat,
    abbreviation: 'ROWB',
    name: 'rowingBoat',
    i18nBase: 'resource.type.rowingBoat',
    icon: 'boat-outline'
  },
  {
    id: ResourceType.Other,
    abbreviation: 'OTHR',
    name: 'other',
    i18nBase: 'resource.type.other',
    icon: 'logo-electron'
  },
  {
    id: ResourceType.MotorBoat,
    abbreviation: 'MOBT',
    name: 'motorBoat',
    i18nBase: 'resource.type.motorBoat',
    icon: 'boat-outline'
  },
  {
    id: ResourceType.Vehicle,
    abbreviation: 'VHCL',
    name: 'vehicle',
    i18nBase: 'resource.type.vehicle',
    icon: 'car-outline'
  },
  {
    id: ResourceType.MaleLocker,
    abbreviation: 'MLKR',
    name: 'maleLocker',
    i18nBase: 'resource.type.maleLocker',
    icon: 'male-outline'
  },
  {
    id: ResourceType.FemaleLocker,
    abbreviation: 'FLKR',
    name: 'femaleLocker',
    i18nBase: 'resource.type.femaleLocker',
    icon: 'female-outline'
  },
  {
    id: ResourceType.HouseKey,
    abbreviation: 'KEY',
    name: 'houseKey',
    i18nBase: 'resource.type.houseKey',
    icon: 'key-outline'
  },
  {
    id: ResourceType.License,
    abbreviation: 'LIC',
    name: 'license',
    i18nBase: 'resource.type.license',
    icon: 'shield-checkmark-outline'
  },
  {
    id: ResourceType.Document,
    abbreviation: 'DOC',
    name: 'document',
    i18nBase: 'resource.type.document',
    icon: 'document-outline'
  },
  {
    id: ResourceType.RealEstate,
    abbreviation: 'RE',
    name: 'realEstate',
    i18nBase: 'resource.type.realEstate',
    icon: 'house-outline'
  }
]
