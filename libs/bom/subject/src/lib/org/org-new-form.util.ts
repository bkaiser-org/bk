import { OrgNewFormModel, SubjectModel } from '@bk/models';
import { ModelType, OrgType } from '@bk/categories';
import { formatMwst } from '@bk/util';

export function getOrgNewFormModel(): OrgNewFormModel {
  return {
    orgName: '',
    orgType: OrgType.LegalEntity,
    dateOfFoundation: '',
    dateOfLiquidation: '',
    street: '',
    countryCode: '',
    zipCode: '',
    city: '',
    phone: '',
    email: '',
    taxId: '',
    notes: '',
    tags: '',
    modelType: ModelType.Org
  }
}

export function convertNewFormToOrg(vm: OrgNewFormModel): SubjectModel {
  const _subject = new SubjectModel();
  _subject.name = vm.orgName ?? '';
  _subject.category = vm.orgType || OrgType.LegalEntity;
  _subject.dateOfBirth = vm.dateOfFoundation ?? '';
  _subject.fav_street = vm.street ?? '';
  _subject.fav_zip = vm.zipCode ?? '';
  _subject.fav_city = vm.city ?? '';
  _subject.fav_country = vm.countryCode ?? 'CH';
  _subject.fav_phone = vm.phone ?? '';
  _subject.fav_email = vm.email ?? '';
  _subject.taxId = formatMwst(vm.taxId ?? '');
  _subject.description = vm.notes ?? '';
  _subject.tags = vm.tags ?? '';
  _subject.modelType = ModelType.Org;
  return _subject;
}


