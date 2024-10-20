import { Category } from "./category-model";

export enum ButtonAction {
  Download,     // download referenced file from Firebase storage
  Navigate,     // navigate to a new page (url must be a valid route)
  Browse,       // browse to an external URL
  Zoom,         // show a zoomed version of the referenced file in Firebase storage (typically an image)
  None
}

export type ButtonActionCategory = Category;

export const ButtonActions: ButtonActionCategory[] = [
  {
    id: ButtonAction.Download,
    abbreviation: 'DWNL',
    name: 'download',
    i18nBase: 'categories.buttonAction.download',
    icon: 'cloud-download-outline'
  },
  {
    id: ButtonAction.Navigate,
    abbreviation: 'NAV',
    name: 'navigate',
    i18nBase: 'categories.buttonAction.navigate',
    icon: 'navigate-outline'
  },
  {
    id: ButtonAction.Browse,
    abbreviation: 'BRSW',
    name: 'browse',
    i18nBase: 'categories.buttonAction.browse',
    icon: 'link-outline'
  },
  {
    id: ButtonAction.Zoom,
    abbreviation: 'ZOOM',
    name: 'zoom',
    i18nBase: 'categories.buttonAction.zoom',
    icon: 'move-outline'
  },
  {
    id: ButtonAction.None,
    abbreviation: 'NONE',
    name: 'none',
    i18nBase: 'categories.buttonAction.none',
    icon: 'close-outline'
  }
]
