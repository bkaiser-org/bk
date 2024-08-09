import { Category } from './category-model';

export type OrgTypeCategory = Category;

export enum OrgType {
    Association,
    LegalEntity,
    Authority,
    Other,
    Group
}

export enum OrgKey {
  SCS = 'QxiuR1vcj0aQfQmYqFgy',
  SRV = 'H0a0BDoPd7lPUhayhrYO',
  Other = ''
}

export const PrimaryOrgKey = 'QxiuR1vcj0aQfQmYqFgy';

export const OrgTypes: OrgTypeCategory[] = [
    {
        id: OrgType.Association,
        abbreviation: 'ASSOC',
        name: 'association',
        i18nBase: 'subject.org.type.association',
        icon: 'people-circle-outline'
    },
    {
        id: OrgType.LegalEntity,
        abbreviation: 'LE',
        name: 'legalEntity',
        i18nBase: 'subject.org.type.legalEntity',
        icon: 'business-outline'
    },
    {
        id: OrgType.Authority,
        abbreviation: 'AUTH',
        name: 'authority',
        i18nBase: 'subject.org.type.authority',
        icon: 'school-outline'
    },
    {
        id: OrgType.Other,
        abbreviation: 'OTHR',
        name: 'other',
        i18nBase: 'subject.org.type.other',
        icon: 'shapes-outline'
    },
    {
        id: OrgType.Group,
        abbreviation: 'GRP',
        name: 'group',
        i18nBase: 'subject.org.type.group',
        icon: 'people-outline'
    }
]


export function getOrgNameAbbreviation(orgKey: OrgKey, orgName: string): string {
  switch (orgKey) {
    case OrgKey.SCS: return 'SCS';
    case OrgKey.SRV: return 'SRV';
    default: return orgName;
  }
}
