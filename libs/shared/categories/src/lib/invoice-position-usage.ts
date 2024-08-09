import { Category } from './category-model';

export type InvoicePositionUsageCategory = Category;

export enum InvoicePositionUsage {
    MembershipFee,
    Beverages,
    Insurance,
    LockerRental,
    BoatPlaceRental,
    License,
    SrvFee,
    Other
}

export const InvoicePositionUsages: InvoicePositionUsageCategory[] = [
    {
        id: InvoicePositionUsage.MembershipFee,
        abbreviation: 'MBRF',
        name: 'membershipFee',
        i18nBase: 'finance.invoicePosition.type.membershipFee',
        icon: 'checkmark-done-circle-outline'
    },
    {
        id: InvoicePositionUsage.Beverages,
        abbreviation: 'BEVG',
        name: 'beverages',
        i18nBase: 'finance.invoicePosition.type.beverages',
        icon: 'document-text-outline'
    },
    {
        id: InvoicePositionUsage.Insurance,
        abbreviation: 'INSU',
        name: 'insurance',
        i18nBase: 'finance.invoicePosition.type.insurance',
        icon: 'alert-circle-outline'
    },
    {
        id: InvoicePositionUsage.LockerRental,
        abbreviation: 'LCKR',
        name: 'lockerRental',
        i18nBase: 'finance.invoicePosition.type.lockerRental',
        icon: 'cash-outline'
    },
    {
        id: InvoicePositionUsage.BoatPlaceRental,
        abbreviation: 'BOAT',
        name: 'boatPlaceRental',
        i18nBase: 'finance.invoicePosition.type.boatPlaceRental',
        icon: 'archive-outline'
    },
    {
        id: InvoicePositionUsage.License,
        abbreviation: 'LICF',
        name: 'license',
        i18nBase: 'finance.invoicePosition.type.license',
        icon: 'archive-outline'
    },
    {
        id: InvoicePositionUsage.SrvFee,
        abbreviation: 'SRVF',
        name: 'srvFee',
        i18nBase: 'finance.invoicePosition.type.srvFee',
        icon: 'archive-outline'
    },
    {
        id: InvoicePositionUsage.Other,
        abbreviation: 'OTHR',
        name: 'other',
        i18nBase: 'finance.invoicePosition.type.other',
        icon: 'archive-outline'
    }
]
