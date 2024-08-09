import { Category } from './category-model';

export type QuadBoolCategory = Category;

export enum QuadBoolType {
    True,
    False,
    Both,
    None
}

export const QuadBoolTypes: QuadBoolCategory[] = [
    {
        id: QuadBoolType.True,
        abbreviation: 'TRUE',
        name: 'true',
        i18nBase: 'categories.quad-bool.true',
        icon: 'add-circle-outline'
    },
    {
        id: QuadBoolType.False,
        abbreviation: 'FALSE',
        name: 'false',
        i18nBase: 'categories.quad-bool.false',
        icon: 'remove-circle-outline'
    },
    {
        id: QuadBoolType.Both,
        abbreviation: 'BOTH',
        name: 'both',
        i18nBase: 'categories.quad-bool.both',
        icon: 'radio-button-on-outline'
    },
    {
        id: QuadBoolType.None,
        abbreviation: 'NONE',
        name: 'none',
        i18nBase: 'categories.quad-bool.none',
        icon: 'radio-button-off-outline'
    }
]
