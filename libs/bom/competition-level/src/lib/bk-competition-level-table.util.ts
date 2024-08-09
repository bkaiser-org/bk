// -------------------------------------------------------------------
//        Competition Level Statistics
// -------------------------------------------------------------------
import { CollectionNames } from "@bk/util";

export interface CompetitionLevelStatisticsEntry {
  rowTitle: string,
  m: number,
  f: number,
  total: number
}

export interface CompetitionLevelStatistics {
  label: string,
  collectionName: string,
  entries: CompetitionLevelStatisticsEntry[]
}

export function initializeCLStatistics(): CompetitionLevelStatistics {
  return {
    label: 'competitionLevel.statistics.label',
    collectionName: CollectionNames.Statistics,
    entries: [
      { rowTitle: 'U15', m: 0, f: 0, total: 0 },
      { rowTitle: 'U17', m: 0, f: 0, total: 0 },
      { rowTitle: 'U19', m: 0, f: 0, total: 0 },
      { rowTitle: 'U23', m: 0, f: 0, total: 0 },
      { rowTitle: 'Elite', m: 0, f: 0, total: 0 },
      { rowTitle: 'Masters', m: 0, f: 0, total: 0 }
    ]
  }
}

