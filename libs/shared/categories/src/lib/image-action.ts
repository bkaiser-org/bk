import { Category } from "./category-model";

export enum ImageAction {
  Download,     // download the image
  Zoom,         // show a zoomed version of the image in a modal
  OpenSlider,  // open a slider with all images in the list
  OpenDirectory,  // open a new album section
  FollowLink,  // follow a link
  None
}

export type ImageActionCategory = Category;

export const ImageActions: ImageActionCategory[] = [
  {
    id: ImageAction.Download,
    abbreviation: 'DWNL',
    name: 'download',
    i18nBase: 'categories.imageAction.download',
    icon: 'cloud-download-outline'
  },
  {
    id: ImageAction.Zoom,
    abbreviation: 'ZOOM',
    name: 'zoom',
    i18nBase: 'categories.imageAction.zoom',
    icon: 'move-outline'
  },
  {
    id: ImageAction.OpenSlider,
    abbreviation: 'OPSL',
    name: 'openslider',
    i18nBase: 'categories.imageAction.openslider',
    icon: 'images-outline'
  },
  {
    id: ImageAction.OpenDirectory,
    abbreviation: 'OPDR',
    name: 'opendirectory',
    i18nBase: 'categories.imageAction.opendirectory',
    icon: 'folder-open-outline'
  },
  {
    id: ImageAction.FollowLink,
    abbreviation: 'FOLL',
    name: 'followlink',
    i18nBase: 'categories.imageAction.followlink',
    icon: 'link-outline'
  },
  {
    id: ImageAction.None,
    abbreviation: 'NONE',
    name: 'none',
    i18nBase: 'categories.imageAction.none',
    icon: 'close-outline'
  }
]
