import { GenderType } from '@bk/categories';
import { DeepPartial, DeepRequired} from 'ngx-vest-forms';

export type ProfileFormModel = DeepPartial<{
  bkey: string,
  firstName: string,
  lastName: string,
  gender: GenderType,
  dateOfBirth: string,
  email: string,
  ssn: string,
  iban: string,
  url: string,
  userLanguage: string,
  showDebugInfo: boolean,
  showTestData: boolean,
  showArchivedData: boolean,
  notes: string
}>;

export const profileFormModelShape: DeepRequired<ProfileFormModel> = {
  bkey: '',
  firstName: '',
  lastName  : '',
  gender: 0,
  dateOfBirth: '',
  email: '',
  ssn: '',
  iban: '',
  url: '',
  userLanguage: '',
  showDebugInfo: false,
  showTestData: false,
  showArchivedData: false,
  notes: ''
};