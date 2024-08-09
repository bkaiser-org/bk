/**
 * This defines which filters are shown in a list toolbar.
 * none: no filter is shown
 * category: a category filter is shown
 * year: a year filter is shown
 * both: both filters are shown (category and year))
 */

export enum FilterType {
  None = 0,
  Category = 1,
  Year = 2,
  Both = 3
}