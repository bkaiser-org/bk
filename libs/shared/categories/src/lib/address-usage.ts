import { Category } from './category-model';

export enum AddressUsage {
    Home,
    Work,
    Mobile,
    Custom
}

export type AddressUsageCategory = Category; 

export const AddressUsages: AddressUsageCategory[] = [{
  id: AddressUsage.Home,
  abbreviation: 'HOME',
  name: 'home',
  i18nBase: 'subject.address.usage.home',
  icon: 'home-outline'
},
{
  id: AddressUsage.Work,
  abbreviation: 'WORK',
  name: 'work',
  i18nBase: 'subject.address.usage.work',
  icon: 'briefcase-outline'
},
{
  id: AddressUsage.Mobile,
  abbreviation: 'MOB',
  name: 'mobile',
  i18nBase: 'subject.address.usage.mobile',
  icon: 'call-outline'
},
{
  id: AddressUsage.Custom,
  abbreviation: 'CSTM',
  name: 'custom',
  i18nBase: 'subject.address.usage.custom',
  icon: 'logo-reddit'
}
]
