import { Category } from './category-model';

export type TripleBoolCategory = Category;

export enum TripleBoolType {
    True,
    False,
    Both
}

export const TripleBoolTypes: TripleBoolCategory[] = [
    {
        id: TripleBoolType.True,
        abbreviation: 'TRUE',
        name: 'true',
        i18nBase: 'categories.triple-bool.true',
        icon: 'add-circle-outline'
    },
    {
        id: TripleBoolType.False,
        abbreviation: 'FALSE',
        name: 'false',
        i18nBase: 'categories.triple-bool.false',
        icon: 'remove-circle-outline'
    },
    {
        id: TripleBoolType.Both,
        abbreviation: 'BOTH',
        name: 'both',
        i18nBase: 'categories.triple-bool.both',
        icon: 'infinite-outline'
    }
]
