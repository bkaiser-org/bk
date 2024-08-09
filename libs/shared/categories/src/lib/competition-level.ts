import { Category } from './category-model';

export type CompetitionLevelCategory = Category;

export enum CompetitionLevel {
    U15,
    U17,
    U19,
    U23,
    Elite,
    Masters
}

export const CompetitionLevels: CompetitionLevelCategory[] = [   
    {
        id: CompetitionLevel.U15,
        abbreviation: 'U15',
        name: 'u15',
        i18nBase: 'competitionLevel.type.u15',
        icon: 'medal-outline'
    },
    {
        id: CompetitionLevel.U17,
        abbreviation: 'U17',
        name: 'u17',
        i18nBase: 'competitionLevel.type.u17',
        icon: 'medal-outline'
    },    {
        id: CompetitionLevel.U19,
        abbreviation: 'U19',
        name: 'u19',
        i18nBase: 'competitionLevel.type.u19',
        icon: 'medal-outline'
    },    {
        id: CompetitionLevel.U23,
        abbreviation: 'U23',
        name: 'u23',
        i18nBase: 'competitionLevel.type.u23',
        icon: 'medal-outline'
    },    {
        id: CompetitionLevel.Elite,
        abbreviation: 'Elite',
        name: 'elite',
        i18nBase: 'competitionLevel.type.elite',
        icon: 'medal-outline'
    },    {
        id: CompetitionLevel.Masters,
        abbreviation: 'Masters',
        name: 'masters',
        i18nBase: 'competitionLevel.type.masters',
        icon: 'medal-outline'
    }
]
