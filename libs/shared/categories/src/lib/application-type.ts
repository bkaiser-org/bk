import { Category } from './category-model';

export enum ApplicationType {
    Active,
    Junior,
    Candidate
}

export type ApplicationTypeCategory = Category;

export const ApplicationTypes: ApplicationTypeCategory[] = [
    {
        id: ApplicationType.Active,
        abbreviation: 'ACTV',
        name: 'active',
        i18nBase: 'application.type.active',
        icon: 'person-circle-outline'
    },
    {
        id: ApplicationType.Junior,
        abbreviation: 'JUN',
        name: 'junior',
        i18nBase: 'application.type.junior',
        icon: 'balloon-outline'
    },
    {
        id: ApplicationType.Candidate,
        abbreviation: 'CAND',
        name: 'candidate',
        i18nBase: 'application.type.candidate',
        icon: 'person-outline'
    }
]
