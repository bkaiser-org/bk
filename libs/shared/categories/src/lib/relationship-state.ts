import { Category } from './category-model';

export type RelationshipStateCategory = Category;

export enum RelationshipState {
    Applied,
    Active
}

export const RelationshipStates: RelationshipStateCategory[] = [
  {
    id: RelationshipState.Applied,
    abbreviation: 'APLD',
    name: 'applied',
    i18nBase: 'ownership.state.applied',
    icon: 'log-in-outline'
  },{
    id: RelationshipState.Active,
    abbreviation: 'ACT',
    name: 'active',
    i18nBase: 'ownership.state.active',
    icon: 'checkmark-circle-outline'
  }
]
