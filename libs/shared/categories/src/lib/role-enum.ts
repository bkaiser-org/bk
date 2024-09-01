import { Category } from "./category-model";

export enum RoleEnum {
  None,
  Anonymous,
  Registered,
  Privileged,
  ContentAdmin,
  ResourceAdmin,
  MemberAdmin,
  EventAdmin,
  Treasurer,
  Admin,
  Public
}



export type RoleEnumCategory = Category;

export const RoleEnums: RoleEnumCategory[] = [
  {
    id: RoleEnum.None,
    abbreviation: 'NONE',
    name: 'none',
    i18nBase: 'auth.roles.none',
    icon: 'ban-outline'
  },
  {
      id: RoleEnum.Anonymous,
      abbreviation: 'ANON',
      name: 'anonymous',
      i18nBase: 'auth.roles.anonymous',
      icon: 'person-remove-outline'
  },
  {
      id: RoleEnum.Registered,
      abbreviation: 'REG',
      name: 'registered',
      i18nBase: 'auth.roles.registered',
      icon: 'person-outline'
  },
  {
      id: RoleEnum.Privileged,
      abbreviation: 'PRIV',
      name: 'privileged',
      i18nBase: 'auth.roles.privileged',
      icon: 'person-add-outline'
  },
  {
    id: RoleEnum.ContentAdmin,
    abbreviation: 'CA',
    name: 'contentAdmin',
    i18nBase: 'auth.roles.contentAdmin',
    icon: 'documents-outline'
  },
  {
    id: RoleEnum.ResourceAdmin,
    abbreviation: 'RA',
    name: 'resourceAdmin',
    i18nBase: 'auth.roles.resourceAdmin',
    icon: 'car-outline'
  },
  {
    id: RoleEnum.MemberAdmin,
    abbreviation: 'MA',
    name: 'memberAdmin',
    i18nBase: 'auth.roles.memberAdmin',
    icon: 'people-outline'
},
{
  id: RoleEnum.EventAdmin,
  abbreviation: 'EA',
  name: 'eventAdmin',
  i18nBase: 'auth.roles.eventAdmin',
  icon: 'calendar-number-outline'
},
{
  id: RoleEnum.Treasurer,
  abbreviation: 'TRSR',
  name: 'treasurer',
  i18nBase: 'auth.roles.treasurer',
  icon: 'cash-outline'
},
{
  id: RoleEnum.Admin,
  abbreviation: 'ADM',
  name: 'admin',
  i18nBase: 'auth.roles.admin',
  icon: 'person-circle-outline'
},
{
  id: RoleEnum.Public,
  abbreviation: 'PBL',
  name: 'public',
  i18nBase: 'auth.roles.public',
  icon: 'lock-open-outline'
}
]
