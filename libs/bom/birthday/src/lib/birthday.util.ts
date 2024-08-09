import { SubjectModel } from "@bk/models";
import { die, getBirthdayDiff } from "@bk/util";

export interface BirthdayInfo {
    firstName: string,
    lastName: string,
    dateOfBirth: string,
    inDays: number,
    url: string,
    index: string,
    bkey: string
}

export function getBirthdayList(persons: SubjectModel[]): BirthdayInfo[] {
    const _birthdayInfo: BirthdayInfo[] = [];
    for (const _person of persons) {
        if (_person.dateOfBirth && _person.dateOfBirth.length > 0 && _person.dateOfDeath.length === 0 &&
            _person.isArchived === false && _person.isTest === false) {
            _birthdayInfo.push({
                firstName: _person.firstName,
                lastName: _person.name,
                dateOfBirth: _person.dateOfBirth,
                inDays: getBirthdayDiff(_person.dateOfBirth),
                url: _person.url,
                index: (_person.firstName + ' ' + _person.name + ' ' + _person.dateOfBirth).toLowerCase(),
                bkey: _person.bkey || die('getBirthdayList: bkey is undefined')
            });
        }
    }
    return sortBirthdays(_birthdayInfo);
}

export function sortBirthdays(birthdays: BirthdayInfo[]): BirthdayInfo[] {
    return birthdays.sort((a, b) => a.inDays - b.inDays);
}