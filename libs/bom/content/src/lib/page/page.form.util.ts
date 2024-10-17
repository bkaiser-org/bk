import { PageFormModel, PageModel } from '@bk/models';

export function convertPageToForm(page: PageModel | undefined): PageFormModel | undefined {
  if (!page) return undefined;
  return {
      bkey: page.bkey,
      name: page.name,
      tags: page.tags,
      notes: page?.description,
      sections: page.sections,
      tenant: page.tenant
  };
}

export function convertFormToPage(page: PageModel | undefined, vm: PageFormModel): PageModel {
  if (!page) page = new PageModel();
  page.name = vm.name ?? '';
  page.bkey = (!vm.bkey || vm.bkey.length === 0) ? vm.name : vm.bkey; // we want to use the name as the key of the menu item in the database
  page.tags = vm.tags ?? '';
  page.description = vm.notes ?? '';
  page.sections = vm.sections ?? [];
  page.tenant = vm.tenant ?? [];
  return page;
}
