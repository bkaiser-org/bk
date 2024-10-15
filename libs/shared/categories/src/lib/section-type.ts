import { Category } from './category-model';

export type SectionTypeCategory = Category;

export enum SectionType {
  Album,
  Article,
  Chart,
  Gallery,
  Hero,
  Map,
  PeopleList,
  Slider,
  List,
  Video,
  Form,
  Calendar,
  Model,
  Button,
  Table,
  Iframe,
  Accordion,
  Chat
}

export const SectionTypes: SectionTypeCategory[] = [
  {
    id: SectionType.Album,
    abbreviation: 'ALBUM',
    name: 'album',
    i18nBase: 'content.type.album',
    icon: 'reorder-two-outline'
  }, 
  {
    id: SectionType.Article,
    abbreviation: 'ARTCL',
    name: 'article',
    i18nBase: 'content.type.article',
    icon: 'reorder-two-outline'
  },
  {
    id: SectionType.Chart,
    abbreviation: 'CHART',
    name: 'chart',
    i18nBase: 'content.type.chart',
    icon: 'reorder-two-outline'
  },
  {
    id: SectionType.Gallery,
    abbreviation: 'GLRY',
    name: 'gallery',
    i18nBase: 'content.type.gallery',
    icon: 'reorder-two-outline'
  },
  {
    id: SectionType.Hero,
    abbreviation: 'HERO',
    name: 'hero',
    i18nBase: 'content.type.hero',
    icon: 'reorder-two-outline'
  },
  {
    id: SectionType.Map,
    abbreviation: 'MAP',
    name: 'map',
    i18nBase: 'content.type.map',
    icon: 'reorder-two-outline'
  },
  {
    id: SectionType.PeopleList,
    abbreviation: 'PPLL',
    name: 'peopleList',
    i18nBase: 'content.type.peopleList',
    icon: 'reorder-two-outline'
  },
  {
    id: SectionType.Slider,
    abbreviation: 'SLIDER',
    name: 'slider',
    i18nBase: 'content.type.slider',
    icon: 'reorder-two-outline'
  },
  {
    id: SectionType.List,
    abbreviation: 'LIST',
    name: 'list',
    i18nBase: 'content.type.list',
    icon: 'reorder-two-outline'
  },
  {
    id: SectionType.Video,
    abbreviation: 'VIDEO',
    name: 'video',
    i18nBase: 'content.type.video',
    icon: 'reorder-two-outline'
  },
  {
    id: SectionType.Form,
    abbreviation: 'FORM',
    name: 'form',
    i18nBase: 'content.type.form',
    icon: 'person-circle-outline'
  },
  {
    id: SectionType.Calendar,
    abbreviation: 'CAL',
    name: 'calendar',
    i18nBase: 'content.type.calendar',
    icon: 'calendar-outline'
  },
  {
    id: SectionType.Model,
    abbreviation: 'MDL',
    name: 'model',
    i18nBase: 'content.type.model',
    icon: 'flower-outline'
  },
  {
    id: SectionType.Button,
    abbreviation: 'BTN',
    name: 'button',
    i18nBase: 'content.type.button',
    icon: 'download'
  },
  {
    id: SectionType.Table,
    abbreviation: 'TBL',
    name: 'table',
    i18nBase: 'content.type.table',
    icon: 'grid-outline'
  },
  {
    id: SectionType.Iframe,
    abbreviation: 'IFR',
    name: 'iframe',
    i18nBase: 'content.type.iframe',
    icon: 'browsers-outline'
  },
  { 
    id: SectionType.Accordion,
    abbreviation: 'ACCR',
    name: 'accordion',
    i18nBase: 'content.type.accordion',
    icon: 'chevron-forward-circle-outline'
  },
  { 
    id: SectionType.Chat,
    abbreviation: 'CHAT',
    name: 'chat',
    i18nBase: 'content.type.chat',
    icon: 'chat-outline'
  }
];
