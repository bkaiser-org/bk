import { Category } from './category-model';

export type DeliveryTypeCategory = Category;

export enum DeliveryType {
    None,
    Mail,
    EmailAttachment,
    SmsNotification,
    EmailNotification,
    InAppNotification
}

export const DeliveryTypes: DeliveryTypeCategory[] = [
  {
    id: DeliveryType.None,
    abbreviation: 'NONE',
    name: 'none',
    i18nBase: 'delivery.type.none',
    icon: 'radio-button-off-outline'
  },
  {
    id: DeliveryType.Mail,
    abbreviation: 'MAIL',
    name: 'mail',
    i18nBase: 'delivery.type.mail',
    icon: 'mail-outline'
  },
  {
    id: DeliveryType.EmailAttachment,
    abbreviation: 'EMAIL',
    name: 'emailAttachment',
    i18nBase: 'delivery.type.emailAttachment',
    icon: 'at-outline'
  },
  {
    id: DeliveryType.SmsNotification,
    abbreviation: 'SMS',
    name: 'smsNotification',
    i18nBase: 'delivery.type.smsNotification',
    icon: 'send-outline'
  },
  {
    id: DeliveryType.EmailNotification,
    abbreviation: 'EMNO',
    name: 'emailNotification',
    i18nBase: 'delivery.type.emailNotification',
    icon: 'at-outline'
  },
  {
    id: DeliveryType.InAppNotification,
    abbreviation: 'INAPP',
    name: 'inappNotification',
    i18nBase: 'delivery.type.inappNotification',
    icon: 'chatbubble-ellipses-outline'
  }
]
