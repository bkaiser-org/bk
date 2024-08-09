import { PersonFormModel, SubjectModel } from '@bk/models';
import { AhvFormat, die, formatAhv } from '@bk/util';
import { GenderType, ModelType } from '@bk/categories';

export function convertSubjectToPersonForm(subject: SubjectModel | undefined): PersonFormModel {
  if (!subject) die('PersonFormUtil.convertSubjectToPersonForm: subject is mandatory.');
  return {
      bkey: subject.bkey,                     // readonly
      firstName: subject.firstName,
      lastName: subject.name,
      gender: subject.category,
      dateOfBirth: subject.dateOfBirth,
      dateOfDeath: subject.dateOfDeath,
      ssn: formatAhv(subject.taxId, AhvFormat.Friendly),
      url: subject.url,
      bexioId: subject.bexioId,
      notes: subject.description,
      tags: subject.tags,
      modelType: ModelType.Person
  };
}

  /**
   * Only convert back the fields that can be changed by the user.
   * @param subject  the subject to be updated.
   * @param form  the view model, ie. the form data with the updated values.
   * @returns the updated subject.
   */
export function convertPersonFormToSubject(subject: SubjectModel, form: PersonFormModel): SubjectModel {
  if (!subject) die('PersonFormUtil.convertPersonFormToSubject: subject is mandatory.');
  subject.firstName = form.firstName ?? '';
  subject.name = form.lastName ?? die('PersonFormUtil.convertPersonFormToSubject: lastName is mandatory.');
  subject.category = Number(form.gender ?? GenderType.Female);
  subject.dateOfBirth = form.dateOfBirth ?? '';
  subject.dateOfDeath = form.dateOfDeath ?? '';
  subject.taxId = formatAhv(form.ssn ?? '', AhvFormat.Electronic);
  subject.description = form.notes ?? '';
  subject.url = form.url ?? '';
  subject.bexioId = form.bexioId ?? '';
  subject.tags = form.tags ?? '';
  return subject;
}
