export const PersonTags = 'advertiser, jstrainer, bexio, business, family, friend, important, review, selectable, sponsor, tent20, test';
export const OrgTags = 'advertiser, bexio, business, private, employer, important, review, selectable, sponsor, tent20, test';
export const GroupTags = 'important, review, selectable, test';
export const DocumentTags = 'important, review, test, selectable, cancelled, draft, invalid, old, new, business, private, offering, pending, planned';
export const EventTags = 'important, review, selectable, test, business, private, planned, public, reserved, marketing, social, training, regatta';
export const YearlyEventTags = 'history,museum,carriage,culture,sport,military,tour,jubilee,industry,nature,religion';
export const LocationTags = 'important, review, selectable, test';
export const ResourceTags = 'important, review, selectable, test, billable, old, new, lost, pending, planned, repairing, reserved, unavailable, unpaid, valid';
export const RoleTags = 'important, review, selectable, test';
export const UserTags = 'important, review, selectable, test';
export const MenuTags = 'important, review, selectable, test';
export const PageTags = 'important, review, selectable, test';
export const SectionTags = 'important, review, selectable, test';
export const MenuItemTags = 'important, review, selectable, test';
export const BoatTags = 'important, review, selectable, test, cgig, jole, liteboat, offering, reserved, repair, tourboat';
export const MembershipTags = 'important, review, selectable, test, familyrebate, edurebate';
export const OwnershipTags = 'important, review, selectable, test';
export const ReservationTags = 'important, review, selectable, test';
export const InvoicePositionTags = 'important, review, selectable, test, paid, unpaid, draft, cancelled, invalid, old, new, pending, planned';
export const AddressTags = 'important, review, selectable, test';
export const TaskTags = 'important, review, selectable, test';
export const TripTags = 'important, review, selectable, test';

/**
 * Conventions:
 * 
 * Users can select any tag from the available tags.
 * Selected tags are stored in the database as a list of tag names (string[]).
 * Tag names can be translated.
 */

export function getNonSelectedTags(availableTags: string[], selectedTags: string[]): string[] {
  const _nonSelectedTags: string[] = [];
  for (const _tag of availableTags) {
    if (!selectedTags.includes(_tag)) {
      _nonSelectedTags.push(_tag);
    }
  }
  return _nonSelectedTags;
}

/**
 * This method can be used as a compare method in filters.
 * @param storedTags the value from the database, consisting of a comma-separated list of tag names 
 * @param selectedTag the tag to be checked 
 * @returns true if selectedTag is either undefined or matches the storedTags
 */
export function tagMatches(storedTags: string, selectedTag: string | undefined | null): boolean {
  if (selectedTag === undefined || selectedTag === null || selectedTag.length === 0) return true;
  if (!storedTags || storedTags.length === 0) return false;
  return storedTags.toLowerCase().includes(selectedTag.toLowerCase());
}


