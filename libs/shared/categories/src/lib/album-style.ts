import { Category } from './category-model';

export enum AlbumStyle {
    Grid,
    Pinterest,
    Imgix,
    List,
    AvatarList
}

export const DefaultAlbumStyle = AlbumStyle.Pinterest;

export type AlbumStyleCategory = Category;

export const AlbumStyles: AlbumStyleCategory[] = [
    {
        id: AlbumStyle.Grid,
        abbreviation: 'GRID',
        name: 'grid',
        i18nBase: 'categories.albumStyle.grid',
        icon: 'grid-outline'
    },
    {
        id: AlbumStyle.Pinterest,
        abbreviation: 'PINT',
        name: 'pinterest',
        i18nBase: 'categories.albumStyle.pinterest',
        icon: 'logo-pinterest'
    },
    {
        id: AlbumStyle.Imgix,
        abbreviation: 'IMGIX',
        name: 'imgix',
        i18nBase: 'categories.albumStyle.imgix',
        icon: 'image-outline'
    },
    {
      id: AlbumStyle.List,
      abbreviation: 'LIST',
      name: 'list',
      i18nBase: 'categories.albumStyle.list',
      icon: 'menu-outline'
  },
  {
    id: AlbumStyle.AvatarList,
    abbreviation: 'AVLI',
    name: 'avatarlist',
    i18nBase: 'categories.albumStyle.avatarlist',
    icon: 'list-outline'
}
]
