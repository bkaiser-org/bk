import { Category } from './category-model';

export type DeliveryStateCategory = Category;

export enum DeliveryState {
    Created,
    ReadyToReview,
    ReadyToSend,
    Sent,
    Completed,
    Archived
}

export const DeliveryStates: DeliveryStateCategory[] = [
    {
        id: DeliveryState.Created,
        abbreviation: 'CREA',
        name: 'created',
        i18nBase: 'delivery.state.created',
        icon: 'checkmark-circle-outline'
    },
    {
        id: DeliveryState.ReadyToReview,
        abbreviation: 'RTR',
        name: 'readyToReview',
        i18nBase: 'delivery.state.readyToReview',
        icon: 'checkmark-done-outline'
    },
    {
        id: DeliveryState.ReadyToSend,
        abbreviation: 'RTS',
        name: 'readyToSend',
        i18nBase: 'delivery.state.readyToSend',
        icon: 'mail-outline'
    },
    {
        id: DeliveryState.Sent,
        abbreviation: 'SENT',
        name: 'sent',
        i18nBase: 'delivery.state.sent',
        icon: 'at-outline'
    },
    {
        id: DeliveryState.Completed,
        abbreviation: 'FIN',
        name: 'completed',
        i18nBase: 'delivery.state.completed',
        icon: 'checkmark-done-outline'
    },
    {
        id: DeliveryState.Archived,
        abbreviation: 'ARCH',
        name: 'archived',
        i18nBase: 'delivery.state.archived',
        icon: 'archive-outline'
    }
]
