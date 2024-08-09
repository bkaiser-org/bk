import { ProfileFormModel, SubjectModel, UserModel } from '@bk/models';
import { AhvFormat, die, formatAhv } from '@bk/util';

export function convertSubjectAndUserToProfileForm(subject: SubjectModel, user: UserModel): ProfileFormModel {
    return {
        // subject
        bkey: subject.bkey,                 // readonly
        firstName: subject.firstName,       // readonly
        lastName: subject.name,             // readonly
        gender: subject.category,           // readonly
        dateOfBirth: subject.dateOfBirth,
        ssn: formatAhv(subject.taxId, AhvFormat.Friendly),
        url: subject.url,                   // show the avatar, later: select avatar image

        // user
        userLanguage: user.userLanguage,
        showDebugInfo: user.showDebugInfo,
        showTestData: user.showTestData,
        showArchivedData: user.showArchivedData,
        email: user.loginEmail
    };
  }

  export function convertProfileFormToSubject(subject: SubjectModel, form: ProfileFormModel): SubjectModel {
    subject.dateOfBirth = form.dateOfBirth || '';
    subject.taxId = formatAhv(form.ssn ?? '', AhvFormat.Electronic);
    subject.url = form.url ?? subject.url;
    return subject;
  }

  export function convertProfileFormToUser(user: UserModel | undefined, form: ProfileFormModel): UserModel {
    if (!user) die('ProfileFormUtil.convertProfileFormToUser: user is mandatory.');
    user.userLanguage = form.userLanguage ?? user.userLanguage;
    user.showDebugInfo = form.showDebugInfo ?? user.showDebugInfo;
    user.showTestData = form.showTestData ?? user.showTestData;
    user.showArchivedData = form.showArchivedData ?? user.showArchivedData;
    return user;
  }

