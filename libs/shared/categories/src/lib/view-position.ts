import { Category } from './category-model';

export type ViewPositionCategory = Category;

export enum ViewPosition {
    None,
    Top,
    Bottom,
    Left,
    Right
}

// later: TopLeft, TopRight, Center, BottomLeft, BottomRight etc. Background, FullScreen, etc.

export const ViewPositions: ViewPositionCategory[] = [
    {
        id: ViewPosition.None,
        abbreviation: 'NONE',
        name: 'none',
        i18nBase: 'categories.view-position.none',
        icon: 'close-outline'
    },
    {
        id: ViewPosition.Top,
        abbreviation: 'TOP',
        name: 'top',
        i18nBase: 'categories.view-position.top',
        icon: 'chevron-up-outline'
    },
    {
        id: ViewPosition.Bottom,
        abbreviation: 'BOTTOM',
        name: 'bottom',
        i18nBase: 'categories.view-position.bottom',
        icon: 'chevron-down-outline'
    },
    {
        id: ViewPosition.Left,
        abbreviation: 'LEFT',
        name: 'left',
        i18nBase: 'categories.view-position.left',
        icon: 'chevron-back-outline'
    },
    {
        id: ViewPosition.Right,
        abbreviation: 'RIGHT',
        name: 'right',
        i18nBase: 'categories.view-position.right',
        icon: 'chevron-forward-outline'
    }
]

export type HorizontalPositionCategory = Category;
export enum HorizontalPosition {
  None,
  Left,
  Right
}

export const HorizontalPositions: HorizontalPositionCategory[] = [
  {
      id: HorizontalPosition.None,
      abbreviation: 'NONE',
      name: 'none',
      i18nBase: 'categories.view-position.none',
      icon: 'close-outline'
  },
  {
      id: HorizontalPosition.Left,
      abbreviation: 'LEFT',
      name: 'left',
      i18nBase: 'categories.view-position.left',
      icon: 'chevron-back-outline'
  },
  {
      id: HorizontalPosition.Right,
      abbreviation: 'RIGHT',
      name: 'right',
      i18nBase: 'categories.view-position.right',
      icon: 'chevron-forward-outline'
  }
]

export type VerticalPositionCategory = Category;
export enum VerticalPosition {
  None,
  Top,
  Bottom
}

export const VerticalPositions: VerticalPositionCategory[] = [
  {
      id: VerticalPosition.None,
      abbreviation: 'NONE',
      name: 'none',
      i18nBase: 'categories.view-position.none',
      icon: 'close-outline'
  },
  {
      id: VerticalPosition.Top,
      abbreviation: 'TOP',
      name: 'top',
      i18nBase: 'categories.view-position.top',
      icon: 'chevron-up-outline'
  },
  {
      id: VerticalPosition.Bottom,
      abbreviation: 'BOTTOM',
      name: 'bottom',
      i18nBase: 'categories.view-position.bottom',
      icon: 'chevron-down-outline'
  }
]