import { Category } from './category-model';

export type InvoiceStateCategory = Category;

export enum InvoiceState {
    Created,
    Synched,
    Free,
    Billed,
    Reminded,
    Paid,
    Closed,
    Cancelled
}

export const InvoiceStates: InvoiceStateCategory[] = [
    {
        id: InvoiceState.Created,
        abbreviation: 'CRTD',
        name: 'created',
        i18nBase: 'finance.invoice.state.created',
        icon: 'checkmark-done-circle-outline'
    },
    {
        id: InvoiceState.Synched,
        abbreviation: 'SYNC',
        name: 'synched',
        i18nBase: 'finance.invoice.state.synched',
        icon: 'document-text-outline'
    },
    {
        id: InvoiceState.Free,
        abbreviation: 'FREE',
        name: 'free',
        i18nBase: 'finance.invoice.state.free',
        icon: 'document-text-outline'
    },
    {
        id: InvoiceState.Billed,
        abbreviation: 'BLLD',
        name: 'billed',
        i18nBase: 'finance.invoice.state.billed',
        icon: 'document-text-outline'
    },
    {
        id: InvoiceState.Reminded,
        abbreviation: 'RMND',
        name: 'reminded',
        i18nBase: 'finance.invoice.state.reminded',
        icon: 'alert-circle-outline'
    },
    {
        id: InvoiceState.Paid,
        abbreviation: 'PAID',
        name: 'paid',
        i18nBase: 'finance.invoice.state.paid',
        icon: 'cash-outline'
    },
    {
        id: InvoiceState.Closed,
        abbreviation: 'CLSD',
        name: 'closed',
        i18nBase: 'finance.invoice.state.closed',
        icon: 'archive-outline'
    },
    {
        id: InvoiceState.Cancelled,
        abbreviation: 'CNCL',
        name: 'cancelled',
        i18nBase: 'finance.invoice.state.cancelled',
        icon: 'archive-outline'
    }
]

