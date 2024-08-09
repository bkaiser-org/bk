import { Category } from './category-model';

export enum Priority {
  Low,
  Medium,
  High
}

export type PriorityCategory = Category;

export const Priorities: PriorityCategory[] = [
  {
    id: Priority.Low,
    abbreviation: 'L',
    name: 'low',
    i18nBase: 'categories.priority.low',
    icon: 'chevron-down-outline'
  },
  {
    id: Priority.Medium,
    abbreviation: 'M',
    name: 'medium',
    i18nBase: 'categories.priority.medium',
    icon: 'chevron-expand-outline'
  },
  {
    id: Priority.High,
    abbreviation: 'H',
    name: 'high',
    i18nBase: 'categories.priority.high',
    icon: 'chevron-up-outline'
  }
]
