import { Category } from './category-model';

export type MembershipStateCategory = Category;

export enum MembershipState {
    Applied,
    Active,
    Passive
}

export const MembershipStates: MembershipStateCategory[] = [
    {
        id: MembershipState.Applied,
        abbreviation: 'APPL',
        name: 'applied',
        i18nBase: 'membership.state.applied',
        icon: 'finger-print-outline'
    },
    {
        id: MembershipState.Active,
        abbreviation: 'ACTV',
        name: 'active',
        i18nBase: 'membership.state.active',
        icon: 'heart-circle-outline'
    },
    {
        id: MembershipState.Passive,
        abbreviation: 'PSSV',
        name: 'passive',
        i18nBase: 'membership.state.passive',
        icon: 'heart-dislike-circle-outline'
    }
]
