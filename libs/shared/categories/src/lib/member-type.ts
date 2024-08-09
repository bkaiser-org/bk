import { SRV_ACTIVE_FEE, SRV_JUNIOR_FEE } from '@bk/util';
import { Category } from './category-model';
import { MembershipState } from './membership-state';
import { OrgKey } from './org-type';
import { ScsMemberType, ScsMemberTypes } from './scs-member-type';

export type MemberTypeCategory = Category;

// used for category validations
export enum MembershipModelType {
  Person = 0,
  Org = 2,
  Group = 5
}

export enum MemberType {
    Active,
    Junior,
    Double,
    Passiv
}

export const MemberTypes: MemberTypeCategory[] = [
    {
        id: MemberType.Active,
        abbreviation: 'A',
        name: 'active',
        i18nBase: 'membership.type.active',
        icon: 'person-circle-outline'
    },
    {
        id: MemberType.Junior,
        abbreviation: 'J',
        name: 'junior',
        i18nBase: 'membership.type.junior',
        icon: 'rocket-outline'
    },
    {
        id: MemberType.Double,
        abbreviation: 'D',
        name: 'double',
        i18nBase: 'membership.type.double',
        icon: 'copy-outline'
    },
    {
        id: MemberType.Passiv,
        abbreviation: 'P',
        name: 'passiv',
        i18nBase: 'membership.type.passiv',
        icon: 'bed-outline'
    }
]

/**
 * 
 * @param orgId 
 * @param memberCategoryId 
 * @param isArchived 
 * @returns 
 */
export function getMembershipState(orgId: string, memberCategoryId: number): number {
  if (orgId === OrgKey.SCS) {
    return memberCategoryId === ScsMemberType.Passiv ? MembershipState.Passive : MembershipState.Active;
  } else {    // SRV or any other org or group
    return memberCategoryId === MemberType.Passiv ? MembershipState.Passive : MembershipState.Active;
  }
}

export function getMembershipCategories(orgId: string | undefined): Category[] {
  if (!orgId || orgId.length === 0) return [];
  return orgId === OrgKey.SCS ? ScsMemberTypes : MemberTypes;
}

export function getDefaultMembershipCategory(orgId?: string): number {
  return orgId && orgId === OrgKey.SCS ? ScsMemberType.A1 : MemberType.Active;
}

export function getMembershipPrice(memberType: MemberType): number {
  return memberType === MemberType.Active ? SRV_ACTIVE_FEE : SRV_JUNIOR_FEE;
}
