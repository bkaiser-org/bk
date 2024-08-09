// -------------------------------------------------------------------
//        Age by Gender Statistics
// -------------------------------------------------------------------
import { GenderType, ScsMemberType } from '@bk/categories';
import { CollectionNames, DateFormat, getAge, getTodayStr } from '@bk/util';
import { GenderRow } from './gender-row';

export interface AgeByGenderStatistics {
  label: string,
  lastUpdate: string,
  collectionName: string,
  entries: GenderRow[]
}

export function initializeAgeByGenderStatistics(): AgeByGenderStatistics {
  return {
    label: 'aoc.adminops.ageByGender.label',
    lastUpdate: getTodayStr(DateFormat.StoreDateTime),
    collectionName: CollectionNames.Statistics,
    entries: [
      { rowTitle: '1-9', m: 0, f: 0, total: 0 },
      { rowTitle: '10-19', m: 0, f: 0, total: 0 },
      { rowTitle: '20-29', m: 0, f: 0, total: 0 },
      { rowTitle: '30-39', m: 0, f: 0, total: 0 },
      { rowTitle: '40-49', m: 0, f: 0, total: 0 },
      { rowTitle: '50-59', m: 0, f: 0, total: 0 },
      { rowTitle: '60-69', m: 0, f: 0, total: 0 },
      { rowTitle: '70-79', m: 0, f: 0, total: 0 },
      { rowTitle: '80-89', m: 0, f: 0, total: 0 },
      { rowTitle: '90-99', m: 0, f: 0, total: 0 },
      { rowTitle: 'Total', m: 0, f: 0, total: 0 }
    ]
  }
}

export function updateAgeByGenderStats(ageByGenderStats: AgeByGenderStatistics, gender: number, dateOfBirth: string | undefined): void {
  if (dateOfBirth === undefined) return;
  const _index = getAge(dateOfBirth, true);
  if (_index === -1) return;
  if (gender === GenderType.Male) {
    ageByGenderStats.entries[_index].m++;
    ageByGenderStats.entries[ageByGenderStats.entries.length -1].m++; // total
  } else {
    ageByGenderStats.entries[_index].f++;
    ageByGenderStats.entries[ageByGenderStats.entries.length -1].f++; // total
  }
  ageByGenderStats.entries[_index].total++;
  ageByGenderStats.entries[ageByGenderStats.entries.length -1].total++;
}

// -------------------------------------------------------------------
//        Category by Gender Statistics
// -------------------------------------------------------------------
export interface CategoryByGenderStatistics {
  label: string,
  lastUpdate: string,
  collectionName: string,
  entries: GenderRow[]
}

export function initializeCategoryByGenderStatistics(): CategoryByGenderStatistics {
  return {
    label: 'aoc.adminops.categoryByGender.label',
    lastUpdate: getTodayStr(DateFormat.StoreDateTime),
    collectionName: CollectionNames.Statistics,
    entries: [
      { rowTitle: 'A', m: 0, f: 0, total: 0 },
      { rowTitle: 'F', m: 0, f: 0, total: 0 },
      { rowTitle: 'E', m: 0, f: 0, total: 0 },
      { rowTitle: 'J', m: 0, f: 0, total: 0 },
      { rowTitle: 'K', m: 0, f: 0, total: 0 },
      { rowTitle: 'Total', m: 0, f: 0, total: 0 }
    ]
  }
}

export function updateCategoryByGenderStats(categoryByGenderStats: CategoryByGenderStatistics, gender: number, memberCategory: number): void {
  switch(memberCategory) {
    case ScsMemberType.A1:
    case ScsMemberType.A2:
    case ScsMemberType.A3:          return(updateSingleCategory(categoryByGenderStats, gender, 0));
    case ScsMemberType.Frei:        return(updateSingleCategory(categoryByGenderStats, gender, 1));
    case ScsMemberType.Ehren:       return(updateSingleCategory(categoryByGenderStats, gender, 2));
    case ScsMemberType.Junioren:    return(updateSingleCategory(categoryByGenderStats, gender, 3));
    case ScsMemberType.Kandidaten:  return(updateSingleCategory(categoryByGenderStats, gender, 4));
  }
}

function updateSingleCategory(categoryByGenderStats: CategoryByGenderStatistics, gender: number, index: number): void {
  if (gender === GenderType.Male) {
    categoryByGenderStats.entries[index].m++;
    categoryByGenderStats.entries[categoryByGenderStats.entries.length -1].m++; // total
  } else {
    categoryByGenderStats.entries[index].f++;
    categoryByGenderStats.entries[categoryByGenderStats.entries.length -1].f++; // total
  }
  categoryByGenderStats.entries[index].total++;
  categoryByGenderStats.entries[categoryByGenderStats.entries.length -1].total++;
}
