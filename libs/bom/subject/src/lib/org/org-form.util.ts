import { OrgFormModel, SubjectModel } from '@bk/models';
import { ModelType, OrgType } from '@bk/categories';
import { formatMwst } from '@bk/util';

export function convertSubjectToOrgForm(subject: SubjectModel | undefined): OrgFormModel | undefined {
  if (!subject) return undefined;
  return {
      bkey: subject.bkey ?? '',
      orgName: subject.name,
      orgType: subject.category,
      dateOfFoundation: subject.dateOfBirth,
      dateOfLiquidation: subject.dateOfDeath,
      taxId: subject.taxId,
      notes: subject.description,
      url: subject.url,
      bexioId: subject.bexioId,
      tags: subject.tags,
      modelType: subject.modelType ?? ModelType.Org
  };
}

export function convertOrgFormToSubject(subject: SubjectModel, form: OrgFormModel): SubjectModel {
  subject.bkey = form.bkey ?? '';
  subject.firstName = '';
  subject.name = form.orgName ?? '';
  subject.category = form.orgType ?? OrgType.LegalEntity;
  subject.dateOfBirth = form.dateOfFoundation ?? '';
  subject.dateOfDeath = form.dateOfLiquidation ?? '';
  subject.taxId = formatMwst(form.taxId ?? '');
  subject.description = form.notes ?? '';
  subject.url = form.url ?? '';
  subject.bexioId = form.bexioId ?? '';
  subject.tags = form.tags ?? '';
  subject.modelType = form.modelType ?? ModelType.Org;
  return subject;
}

export function getOrgNameByOrgType(orgType?: number): string {
  if (orgType === undefined) return '';
  switch(orgType) {
    case OrgType.Association: return 'orgName.association';
    case OrgType.Group: return 'orgName.group';
    case OrgType.Authority: return 'orgName.authority';
    case OrgType.LegalEntity: return 'orgName.company'; 
    default: return 'orgName'; 
  }
}
