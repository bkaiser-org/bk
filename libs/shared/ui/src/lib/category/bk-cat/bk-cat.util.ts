import { AddressChannels, AddressUsages, BoatTypes, Category, GenderTypes, MembershipStates, OrgTypes, getMembershipCategories } from '@bk/categories';
import { warn } from '@bk/util';

export function getCategoriesByName(name: string, key?: string): Category[] {
  switch (name) {
    case 'boatType': return BoatTypes;
    case 'channel': return AddressChannels;
    case 'memberState': return MembershipStates;
    case 'memberCategory': return getMembershipCategories(key);
    case 'gender': return GenderTypes;
    case 'orgType': return OrgTypes;
    case 'usage': return AddressUsages;
    default:
      warn('bk-cat.util.getCategoriesByName: unknown name ' + name);
      return [];
  }
}

/**
 * Compare two Categories.
 * Return true if they are the same.
 */
export function compareCategories(cat1: Category, cat2: Category): boolean {
  return cat1 && cat2 ? cat1.id === cat2.id : cat1 === cat2;
}
