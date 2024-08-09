import { Category } from './category-model';

export type TaskStateCategory = Category;

export enum TaskState {
    Initial,
    Planned,
    Doing,
    Done,
    Waiting,
    Cancelled,
    Later    
}

export const TaskStates: TaskStateCategory[] = [
    {
        id: TaskState.Initial,
        abbreviation: 'INIL',
        name: 'initial',
        i18nBase: 'task.state.initial',
        icon: 'checkmark-done-circle-outline'
    },
    {
        id: TaskState.Planned,
        abbreviation: 'PLND',
        name: 'planned',
        i18nBase: 'task.state.planned',
        icon: 'document-text-outline'
    },
    {
        id: TaskState.Doing,
        abbreviation: 'DOIN',
        name: 'doing',
        i18nBase: 'task.state.doing',
        icon: 'document-text-outline'
    },
    {
        id: TaskState.Done,
        abbreviation: 'DONE',
        name: 'done',
        i18nBase: 'task.state.done',
        icon: 'document-text-outline'
    },
    {
        id: TaskState.Waiting,
        abbreviation: 'WAIT',
        name: 'waiting',
        i18nBase: 'task.state.waiting',
        icon: 'alert-circle-outline'
    },
    {
      id: TaskState.Cancelled,
      abbreviation: 'CNCL',
      name: 'cancelled',
      i18nBase: 'task.state.cancelled',
      icon: 'archive-outline'
  },
    {
        id: TaskState.Later,
        abbreviation: 'LATR',
        name: 'later',
        i18nBase: 'task.state.later',
        icon: 'archive-outline'
    }
]

