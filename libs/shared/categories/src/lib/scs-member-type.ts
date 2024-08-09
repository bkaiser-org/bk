import { SCS_A1_FEE, SCS_A2_FEE, SCS_A3_FEE, SCS_CANDIDATE_FEE, SCS_FREE_FEE, SCS_HONORARY_FEE, SCS_JUNIOR_FEE, SCS_PASSIVE_FEE } from '@bk/util';
import { Category } from './category-model';
import { MembershipState } from './membership-state';

export type ScsMemberTypeCategory = Category;

export enum ScsMemberType
 {
    A1,
    A2,
    A3,
    Junioren,
    Frei,
    Ehren,
    Kandidaten,
    Passiv
}

export function getScsMembershipState(scsMemberType: ScsMemberType): MembershipState {
  return scsMemberType === ScsMemberType.Passiv ? MembershipState.Passive : MembershipState.Active;
  }

export function getScsMembershipPrice(scsMemberType: ScsMemberType): number {
  switch(scsMemberType) {
    case ScsMemberType.A1: return SCS_A1_FEE;
    case ScsMemberType.A2: return SCS_A2_FEE;
    case ScsMemberType.A3: return SCS_A3_FEE;
    case ScsMemberType.Junioren: return SCS_JUNIOR_FEE;
    case ScsMemberType.Frei: return SCS_FREE_FEE;
    case ScsMemberType.Ehren: return SCS_HONORARY_FEE;
    case ScsMemberType.Kandidaten: return SCS_CANDIDATE_FEE;
    case ScsMemberType.Passiv: return SCS_PASSIVE_FEE;
    default: return 0;
  }
}

export const ScsMemberTypes: ScsMemberTypeCategory[] = [
    {
        id: ScsMemberType.A1,
        abbreviation: 'A1',
        name: 'aktive1',
        i18nBase: 'membership.scsType.A1',
        icon: 'person-circle-outline'
    },
    {
        id: ScsMemberType.A2,
        abbreviation: 'A2',
        name: 'aktive2',
        i18nBase: 'membership.scsType.A2',
        icon: 'person-circle-outline'
    },
    {
        id: ScsMemberType.A3,
        abbreviation: 'A3',
        name: 'aktive3',
        i18nBase: 'membership.scsType.A3',
        icon: 'person-circle-outline'
    },
    {
        id: ScsMemberType.Junioren,
        abbreviation: 'J',
        name: 'junioren',
        i18nBase: 'membership.scsType.J',
        icon: 'rocket-outline'
    },
    {
        id: ScsMemberType.Frei,
        abbreviation: 'F',
        name: 'frei',
        i18nBase: 'membership.scsType.F',
        icon: 'person-outline'
    },
    {
        id: ScsMemberType.Ehren,
        abbreviation: 'E',
        name: 'ehren',
        i18nBase: 'membership.scsType.E',
        icon: 'person-outline'
    },
    {
        id: ScsMemberType.Kandidaten,
        abbreviation: 'K',
        name: 'kandidaten',
        i18nBase: 'membership.scsType.kandidaten',
        icon: 'person-add-outline'
    },
    {
        id: ScsMemberType.Passiv,
        abbreviation: 'P',
        name: 'passiv',
        i18nBase: 'membership.scsType.passiv',
        icon: 'person-outline'
    }
]

export const ScsActiveTypes = ScsMemberTypes.slice(0, 7);
