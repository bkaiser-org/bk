import { SectionFormModel, SectionModel } from '@bk/models';
import { ColorIonic, SectionType, ViewPosition } from '@bk/categories';
import { convertRoleEnumToName, convertRoleNameToEnum } from '../../menu/menu.util';

export function convertSectionToForm(section: SectionModel | undefined): SectionFormModel | undefined {
  if (!section) return undefined;
  return {
      bkey: section.bkey,
      name: section.name,
      type: section.category,
      url: section.url,
      imagePosition: section.imagePosition,
      colSize: section.colSize,
      content: section.content,
      tags: section.tags,
      color: section.color,
      notes: section?.description,
      roleNeeded: convertRoleNameToEnum(section.roleNeeded),
      properties: section.properties
  };
}

export function convertFormToSection(section: SectionModel | undefined, vm: SectionFormModel): SectionModel {
  if (!section) section = new SectionModel();
  section.name = vm.name ?? '';
  section.bkey = (!vm.bkey || vm.bkey.length === 0) ? vm.name : vm.bkey; // we want to use the name as the key of the menu item in the database
  section.category = vm.type ?? SectionType.Article;
  section.url = vm.url ?? '';
  section.imagePosition = vm.imagePosition ?? ViewPosition.Left;
  section.colSize = vm.colSize ?? 4;
  section.content = vm.content ?? '<p></p>';
  section.tags = vm.tags ?? '';
  section.color = vm.color ?? ColorIonic.Primary;
  section.description = vm.notes ?? '';
  section.roleNeeded = convertRoleEnumToName(vm.roleNeeded) ?? 'privileged';  // be on the safe side, restrict access by default
  section.properties = vm.properties ?? {};
  return section;
}
