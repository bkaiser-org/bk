import { DeepPartial, DeepRequired } from 'ngx-vest-forms';

export type PersonFormModel = DeepPartial<{
  bkey: string,
  firstName: string,
  lastName: string,
  gender: number,
  dateOfBirth: string,
  dateOfDeath: string,
  ssn: string,
  url: string,
  notes: string,
  tags: string,
  modelType: number,
  bexioId: string
}>;

export const personFormModelShape: DeepRequired<PersonFormModel> = {
  bkey: '',
  firstName: '',
  lastName: '',
  gender: -1,
  dateOfBirth: '',
  dateOfDeath: '',
  ssn: '',
  url: '',
  notes: '',
  tags: '',
  modelType: -1,
  bexioId: ''
};