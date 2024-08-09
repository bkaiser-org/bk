import { Category } from './category-model';

export interface ShipmentTypeCategory extends Category {
    xsltTemplateUrl: string;
}
export enum ShipmentType {
    Letter,
    AddressOnly,
    MembershipFee,
    FreeInvoice
}

export const ShipmentTypes: ShipmentTypeCategory[] = [
    {
        id: ShipmentType.Letter,
        abbreviation: 'LETTER',
        name: 'letter',
        i18nBase: 'delivery.shipment.type.letter',
        icon: 'create-outline',
        xsltTemplateUrl: ''
    },
    {
        id: ShipmentType.AddressOnly,
        abbreviation: 'ADDR',
        name: 'addressOnly',
        i18nBase: 'delivery.shipment.type.addressOnly',
        icon: 'location-outline',
        xsltTemplateUrl: ''
    },
    {
        id: ShipmentType.MembershipFee,
        abbreviation: 'MSHP',
        name: 'membershipFee',
        i18nBase: 'delivery.shipment.type.membershipFee',
        icon: 'cash-outline',
        xsltTemplateUrl: ''
    },
    {
        id: ShipmentType.FreeInvoice,
        abbreviation: 'INV',
        name: 'freeInvoice',
        i18nBase: 'delivery.shipment.type.freeInvoice',
        icon: 'gift-outline',
        xsltTemplateUrl: ''
    }
]
