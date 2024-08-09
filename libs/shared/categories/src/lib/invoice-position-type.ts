import { Category } from './category-model';

export type InvoicePositionTypeCategory = Category;

export enum InvoicePositionType {
    Fix,
    Unit,
    Hours,
    Days,
    Deduction,
    Rebate
}

export const InvoicePositionTypes: InvoicePositionTypeCategory[] = [
    {
        id: InvoicePositionType.Fix,
        abbreviation: 'FIX',
        name: 'fix',
        i18nBase: 'delivery.position.type.fix',
        icon: 'location-outline'
    },
    {
        id: InvoicePositionType.Unit,
        abbreviation: 'UNIT',
        name: 'unit',
        i18nBase: 'delivery.position.type.unit',
        icon: 'cellular-outline'
    },
    {
        id: InvoicePositionType.Hours,
        abbreviation: 'HRS',
        name: 'hours',
        i18nBase: 'delivery.position.type.hours',
        icon: 'alarm-outline'
    },
    {
        id: InvoicePositionType.Days,
        abbreviation: 'DAYS',
        name: 'days',
        i18nBase: 'delivery.position.type.days',
        icon: 'calendar-number-outline'
    },
    {
        id: InvoicePositionType.Deduction,
        abbreviation: 'DED',
        name: 'deduction',
        i18nBase: 'delivery.position.type.deduction',
        icon: 'remove-circle-outline'
    },
    {
        id: InvoicePositionType.Rebate,
        abbreviation: 'REB',
        name: 'rebate',
        i18nBase: 'delivery.position.type.rebate',
        icon: 'cash-outline'
    }
]
