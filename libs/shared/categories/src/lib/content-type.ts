import { Category } from './category-model';

export interface ContentTypeCategory extends Category {
    isSection: boolean;
    isPage: boolean;
}

export enum ContentType {
    Article,
    Category,
    Footer,
    Help,
    Hero,
    Link,
    Page,
    Picture,
    TextBlock
}

export const ContentTypes: ContentTypeCategory[] = [
  {
    id: ContentType.Article,
    abbreviation: 'ART',
    name: 'article',
    i18nBase: 'content.type.article',
    icon: 'document-text-outline',
    isSection: true,
    isPage: false
  },
  {
    id: ContentType.Category,
    abbreviation: 'CAT',
    name: 'category',
    i18nBase: 'content.type.category',
    icon: 'pricetag-outline',
    isSection: false,
    isPage: false
  },
  {
    id: ContentType.Footer,
    abbreviation: 'FTR',
    name: 'footer',
    i18nBase: 'content.type.footer',
    icon: 'cloud-download-outline',
    isSection: true,
    isPage: false
  },
  {
    id: ContentType.Help,
    abbreviation: 'HELP',
    name: 'help',
    i18nBase: 'content.type.help',
    icon: 'help-circle-outline',
    isSection: false,
    isPage: true
  },
  {
    id: ContentType.Hero,
    abbreviation: 'HERO',
    name: 'hero',
    i18nBase: 'content.type.hero',
    icon: 'alert-circle-outline',
    isSection: true,
    isPage: false
  },
  {
    id: ContentType.Link,
    abbreviation: 'LINK',
    name: 'link',
    i18nBase: 'content.type.link',
    icon: 'link-outline',
    isSection: false,
    isPage: false
  },
  { 
    id: ContentType.Page,
    abbreviation: 'PAGE',
    name: 'page',
    i18nBase: 'content.type.page',
    icon: 'newspaper-outline',
    isSection: false,
    isPage: true
  },
  {
    id: ContentType.Picture,
    abbreviation: 'PICT',
    name: 'picture',
    i18nBase: 'content.type.picture',
    icon: 'logo-instagram',
    isSection: false,
    isPage: false
  },
  {
    id: ContentType.TextBlock,
    abbreviation: 'TXTB',
    name: 'textblock',
    i18nBase: 'content.type.textblock',
    icon: 'create-outline',
    isSection: true,
    isPage: false
  }
]
