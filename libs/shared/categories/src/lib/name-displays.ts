import { NameDisplay } from '@bk/util';
import { Category } from './category-model';

export type NameDisplayCategory = Category;

export const NameDisplays: NameDisplayCategory[] = [
  {
    id: NameDisplay.FirstLast,
    abbreviation: 'FL',
    name: 'firstLast',
    i18nBase: 'categories.nameDisplay.firstLast',
    icon: 'arrow-forward-circle-outline'
  },
  {
    id: NameDisplay.LastFirst,
    abbreviation: 'LF',
    name: 'lastFirst',
    i18nBase: 'categories.nameDisplay.lastFirst',
    icon: 'arrow-back-circle-outline'
  },
  {
    id: NameDisplay.FirstOnly,
    abbreviation: 'FO',
    name: 'firstOnly',
    i18nBase: 'categories.nameDisplay.firstOnly',
    icon: 'arrow-up-circle-outline'
  },
  {
    id: NameDisplay.LastOnly,
    abbreviation: 'LO',
    name: 'lastOnly',
    i18nBase: 'categories.nameDisplay.lastOnly',
    icon: 'arrow-down-circle-outline'
  }
]
