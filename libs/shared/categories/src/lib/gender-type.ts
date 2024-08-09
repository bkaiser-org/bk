import { Category } from './category-model';
import { getCategoryStringField } from './category.util';

// used for category validations
export enum SubjectModelTypes {
  Person = 0,
  Org = 2,
  Group = 5
}

export enum GenderType {
  Male,
  Female,
  Other
}

export type GenderTypeCategory = Category;

export const GenderTypes: GenderTypeCategory[] = [
  {
    id: GenderType.Male,
    abbreviation: 'M',
    name: 'male',
    i18nBase: 'subject.person.gender.male',
    icon: 'man-outline'
  },
  {
    id: GenderType.Female,
    abbreviation: 'F',
    name: 'female',
    i18nBase: 'subject.person.gender.female',
    icon: 'woman-outline'
  },
  {
    id: GenderType.Other,
    abbreviation: 'O',
    name: 'other',
    i18nBase: 'subject.person.gender.other',
    icon: 'transgender-outline'
  }
]

export function getSalutation(gender: GenderType): string {
  return `@${getCategoryStringField(GenderTypes, gender, 'i18nBase')}.salutation`;
}
export function getGreeting(gender: GenderType): string {
  return `@${getCategoryStringField(GenderTypes, gender, 'i18nBase')}.greeting`;
}

export function getFormalSalutation(gender: GenderType): string {
  return `@${getCategoryStringField(GenderTypes, gender, 'i18nBase')}.formal`;
}
