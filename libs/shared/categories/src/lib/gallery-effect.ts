import { Category } from './category-model';

export enum GalleryEffect {
  Slide,
  Fade,
  Cube,
  Coverflow,
  Flip,
  Creative,
  Cards
}

export type GalleryEffectCategory = Category;

export const GalleryEffects: GalleryEffectCategory[] = [
  {
    id: GalleryEffect.Slide,
    abbreviation: 'slide',
    name: 'slide',
    i18nBase: 'categories.galleryEffect.slide',
    icon: 'albums-outline'
  },
  {
    id: GalleryEffect.Fade,
    abbreviation: 'fade',
    name: 'fade',
    i18nBase: 'categories.galleryEffect.fade',
    icon: 'shuffle-outline'
  },
  {
    id: GalleryEffect.Cube,
    abbreviation: 'cube',
    name: 'cube',
    i18nBase: 'categories.galleryEffect.cube',
    icon: 'cube-outline'
  },
  {
    id: GalleryEffect.Coverflow,
    abbreviation: 'cflow',
    name: 'coverflow',
    i18nBase: 'categories.galleryEffect.coverflow',
    icon: 'logo-stackoverflow'
  },
  {
    id: GalleryEffect.Flip,
    abbreviation: 'flip',
    name: 'flip',
    i18nBase: 'categories.galleryEffect.flip',
    icon: 'swap-horizontal-outline'
  },
  {
    id: GalleryEffect.Creative,
    abbreviation: 'crtv',
    name: 'creative',
    i18nBase: 'categories.galleryEffect.creative',
    icon: 'sparkles-outline'
  },
  {
    id: GalleryEffect.Cards,
    abbreviation: 'cards',
    name: 'cards',
    i18nBase: 'categories.galleryEffect.cards',
    icon: 'id-card-outline'
  }
]
