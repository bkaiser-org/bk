import { ColorIonic, ModelType, SectionType, SectionTypes, ViewPosition } from "@bk/categories";
import { Avatar, Button, Icon, DefaultImageConfig, SectionModel, ModelInfo } from "@bk/models";
import { NameDisplay, bkTranslate } from "@bk/util";

/**
 * Convenience function to create a new SectionModel with given values.
 * @param category 
 * @returns 
 */
export function createSection(categoryId: number, tenantId: string): SectionModel {
  const _section = new SectionModel();
  _section.category = categoryId;
  _section.name = SectionTypes[categoryId].name;
  _section.colSize = 4;
  _section.color = ColorIonic.Primary;
  _section.imagePosition = ViewPosition.Top;
  _section.url = '';
  _section.tenant = [tenantId];
  _section.roleNeeded = 'privileged';
  switch(categoryId) {
    case SectionType.Album:
      _section.properties.imageList = [];
      break;
    case SectionType.Article:
      _section.content = bkTranslate('@content.section.default.content');
      _section.url = bkTranslate('@content.section.default.url');
      break;
    case SectionType.PeopleList:
      _section.properties.personList = [];
      _section.properties.avatar = newAvatar();
      _section.color = ColorIonic.Light;
      break;
    case SectionType.Model: 
      _section.properties.modelInfo = newModelInfo();
      break;
    case SectionType.Button:
      _section.colSize = 2;
      _section.content = 'Download';
      _section.imagePosition = ViewPosition.Left;
      _section.properties.button = newButton();
      _section.properties.icon = newIcon();
      break;
  }
  return _section;
}

export function newModelInfo(): ModelInfo {
  return {
    bkey: '',
    modelType: ModelType.Subject,
    visibleAttributes: []
  }
}

export function newButton(): Button {
  return {
    label: '',
    shape: 'round',
    fill: 'clear',
    width: '60px',
    height: '60px',
    color: ColorIonic.Primary
  }
}

export function newIcon(): Icon {
  return {
    name: 'pdf',
    size: '40px',
    slot: 'icon-only'
  }
}

export function newAvatar(): Avatar {
  return {
    cols: 1,
    showName: true,
    showLabel: false,
    nameDisplay: NameDisplay.FirstLast,
    altText: 'avatar',
    title: '',
    linkedSection: ''
  }
}

export function newDefaultImageConfig(): DefaultImageConfig {
  return {
    imgIxParams: '',
    width: 160,
    height: 90,
    albumStyle: 'grid',
    borderRadius: 4,
    isZoomable: true,
    zoomFactor: 2,
    isThumbnail: false,
    slot: 'start'
  }
}
