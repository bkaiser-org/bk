import { Category } from './category-model';

export type PersonSortCriteriaCategory = Category;

export enum PersonSortCriteria {
    Firstname,
    Lastname,       
    Fullname, // default
    DateOfBirth,
    Key
}

// name can also be used as the fieldName for the sort
export const PersonSortCriterias: PersonSortCriteriaCategory[] = [
  {
    id: PersonSortCriteria.Firstname,
    abbreviation: 'FN',
    name: 'firstName',
    i18nBase: 'categories.sortCriteria.firstname',
    icon: 'arrow-back-circle-outline'
  },
  {
    id: PersonSortCriteria.Lastname,
    abbreviation: 'LN',
    name: 'lastName',
    i18nBase: 'categories.sortCriteria.lastname',
    icon: 'arrow-forward-circle-outline'
  },
  {
    id: PersonSortCriteria.Fullname,
    abbreviation: 'FU',
    name: 'name',
    i18nBase: 'categories.sortCriteria.fullname',
    icon: 'arrow-up-circle-outline'
  },
  {
    id: PersonSortCriteria.DateOfBirth,
    abbreviation: 'DOB',
    name: 'dateOfBirth',
    i18nBase: 'categories.sortCriteria.dob',
    icon: 'egg-outline'
  },
  {
    id: PersonSortCriteria.Key,
    abbreviation: 'KEY',
    name: 'bkey',
    i18nBase: 'categories.sortCriteria.key',
    icon: 'key-outline'
  }
]
