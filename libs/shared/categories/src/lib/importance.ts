import { Category } from './category-model';

export enum Importance {
  Low,
  Medium,
  High
}

export type ImportanceCategory = Category;

export const Importances: ImportanceCategory[] = [
  {
    id: Importance.Low,
    abbreviation: 'L',
    name: 'low',
    i18nBase: 'categories.importance.low',
    icon: 'chevron-down-outline'
  },
  {
    id: Importance.Medium,
    abbreviation: 'M',
    name: 'medium',
    i18nBase: 'categories.importance.medium',
    icon: 'chevron-expand-outline'
  },
  {
    id: Importance.High,
    abbreviation: 'H',
    name: 'high',
    i18nBase: 'categories.importance.high',
    icon: 'chevron-up-outline'
  }
]
