import { Category } from './category-model';

export enum AvatarUsage {
    None,           // default
    GravatarFirst,  // gravatar, photo, default
    NoGravatar,     // photo, default
    PhotoFirst      // photo, gravatar, default
}

export type AvatarUsageCategory = Category;

export const AvatarUsages: AvatarUsageCategory[] = [
  {
    id: AvatarUsage.None,
    abbreviation: 'NONE',
    name: 'none',
    i18nBase: 'categories.avatarUsage.none',
    icon: 'ellipse-outline'
  },
  {
    id: AvatarUsage.GravatarFirst,
    abbreviation: 'GRAV',
    name: 'gravatarFirst',
    i18nBase: 'categories.avatarUsage.gravatarFirst',
    icon: 'person-circle-outline'
  },
  {
    id: AvatarUsage.NoGravatar,
    abbreviation: 'NOGRAV',
    name: 'noGravatar',
    i18nBase: 'categories.avatarUsage.noGravatar',
    icon: 'pause-circle-outline'
  },
  {
    id: AvatarUsage.PhotoFirst,
    abbreviation: 'PHOTO',
    name: 'photoFirst',
    i18nBase: 'categories.avatarUsage.photoFirst',
    icon: 'camera-outline'
  }
]
