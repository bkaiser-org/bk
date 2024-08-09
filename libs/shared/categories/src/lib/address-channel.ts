import { Category } from './category-model';

export enum AddressChannel {
    Phone,
    Email,
    Web,
    Twitter,
    Linkedin,
    Facebook,
    Xing,
    Skype,
    Custom,
    Postal,
    Instagram,
    Signal,
    Wire,
    Github,
    Threema,
    Telegram,
    Whatsapp,
    BankAccount
}

export type AddressChannelCategory = Category; 

export const AddressChannels: AddressChannelCategory[] = [{
  id: AddressChannel.Phone,
  abbreviation: 'TEL',
  name: 'phone',
  i18nBase: 'subject.address.channel.phone',
  icon: 'call-outline'
},
{
  id: AddressChannel.Email,
  abbreviation: 'EMAIL',
  name: 'email',
  i18nBase: 'subject.address.channel.email',
  icon: 'at-outline'
},
{
  id: AddressChannel.Web,
  abbreviation: 'WEB',
  name: 'web',
  i18nBase: 'subject.address.channel.web',
  icon: 'globe-outline'
},
{
  id: AddressChannel.Twitter,
  abbreviation: 'TWT',
  name: 'twitter',
  i18nBase: 'subject.address.channel.twitter',
  icon: 'logo-twitter'
},
{
  id: AddressChannel.Linkedin,
  abbreviation: 'LKD',
  name: 'linkedin',
  i18nBase: 'subject.address.channel.linkedin',
  icon: 'logo-linkedin'
},
{
  id: AddressChannel.Facebook,
  abbreviation: 'FB',
  name: 'facebook',
  i18nBase: 'subject.address.channel.facebook',
  icon: 'logo-facebook'
},
{
  id: AddressChannel.Xing,
  abbreviation: 'XING',
  name: 'xing',
  i18nBase: 'subject.address.channel.xing',
  icon: 'logo-xing'
},
{
  id: AddressChannel.Skype,
  abbreviation: 'SKP',
  name: 'skype',
  i18nBase: 'subject.address.channel.skype',
  icon: 'logo-skype'
},
{
  id: AddressChannel.Custom,
  abbreviation: 'CUST',
  name: 'custom',
  i18nBase: 'subject.address.channel.custom',
  icon: 'logo-reddit'
},
{
  id: AddressChannel.Postal,
  abbreviation: 'POST',
  name: 'postal',
  i18nBase: 'subject.address.channel.postal',
  icon: 'mail-open-outline'
},
{
  id: AddressChannel.Instagram,
  abbreviation: 'INSTA',
  name: 'instagram',
  i18nBase: 'subject.address.channel.instagram',
  icon: 'logo-instagram'
},
{
  id: AddressChannel.Signal,
  abbreviation: 'SIGNL',
  name: 'signal',
  i18nBase: 'subject.address.channel.signal',
  icon: 'chatbubble-outline'
},
{
  id: AddressChannel.Wire,
  abbreviation: 'WIRE',
  name: 'wire',
  i18nBase: 'subject.address.channel.wire',
  icon: 'chatbox-ellipses-outline'
},
{
  id: AddressChannel.Github,
  abbreviation: 'GITH',
  name: 'github',
  i18nBase: 'subject.address.channel.github',
  icon: 'logo-github'
},
{
  id: AddressChannel.Threema,
  abbreviation: 'THRMA',
  name: 'threema',
  i18nBase: 'subject.address.channel.threema',
  icon: 'chatbox-ellipses-outline'
},
{
  id: AddressChannel.Telegram,
  abbreviation: 'TLGR',
  name: 'telegram',
  i18nBase: 'subject.address.channel.telegram',
  icon: 'chatbox-ellipses-outline'
},
{
  id: AddressChannel.Whatsapp,
  abbreviation: 'WHAT',
  name: 'whatsapp',
  i18nBase: 'subject.address.channel.whatsapp',
  icon: 'chatbox-ellipses-outline'
},
{
  id: AddressChannel.BankAccount,
  abbreviation: 'ACCT',
  name: 'bankaccount',
  i18nBase: 'subject.address.channel.bankaccount',
  icon: 'cash-outline'
}
];
