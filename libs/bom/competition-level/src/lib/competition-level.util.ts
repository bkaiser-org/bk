import { addIndexElement } from "@bk/base";
import { CompetitionLevel, CompetitionLevels, GenderType, getCategoryAbbreviation } from "@bk/categories";
import { BaseModel, CompetitionLevelModel, RelationshipModel, isCompetitionLevel } from "@bk/models";
import { die, getAge } from "@bk/util";

export function getCompetitionLevel(dateOfBirth: string): CompetitionLevel {
  const _age = getAge(dateOfBirth);
  if (_age < 15) return CompetitionLevel.U15;
  if (_age < 17) return CompetitionLevel.U17;
  if (_age < 19) return CompetitionLevel.U19;
  if (_age < 23) return CompetitionLevel.U23;
  if (_age <= 27) return CompetitionLevel.Elite;
  return CompetitionLevel.Masters;
}

export function createCompetitionLevelFromScsMembership(scsMember: RelationshipModel, dateOfBirth: string): CompetitionLevelModel {
  if (!scsMember) die('CompetitionLevelUtil.createCompetitionLevelFromScsMembership: scsMember is mandatory');
  if (!dateOfBirth) die('CompetitionLevelUtil.createCompetitionLevelFromScsMembership: dateOfBirth is mandatory');
  const _clModel = new CompetitionLevelModel();
  _clModel.bkey = scsMember.bkey;
  _clModel.firstName = scsMember.subjectName2;
  _clModel.name = scsMember.subjectName;
  _clModel.category = scsMember.subjectCategory;
  _clModel.personKey = scsMember.subjectKey;
  _clModel.dateOfBirth = dateOfBirth;
  _clModel.competitionLevel = getCompetitionLevel(dateOfBirth);
  _clModel.scsMembershipKey = scsMember.bkey ?? die('CompetitionLevelUtil.createCompetitionLevelFromScsMembership: scsMember.bkey is mandatory');
  _clModel.scsMemberType = scsMember.subType;
  _clModel.index = getCompetitionLevelIndex(_clModel);
  return _clModel;
}

/* ---------------------- Index operations -------------------------*/
export function getCompetitionLevelIndex(competitionLevel: BaseModel): string {
  let _index = '';
  if (isCompetitionLevel(competitionLevel)) {
    _index = addIndexElement(_index, 'n', competitionLevel.firstName + ' ' + competitionLevel.name);
    _index = addIndexElement(_index, 'c', getCategoryAbbreviation(CompetitionLevels, competitionLevel.category));
    _index = addIndexElement(_index, 'g', competitionLevel.category === Number(GenderType.Female) ? 'f' : 'm');
    _index = addIndexElement(_index, 'dob', competitionLevel.dateOfBirth);
  }
  return _index;
}

/**
 * Returns a string explaining the structure of the index.
 * This can be used in info boxes on the GUI.
 */
export function getCompetitionLevelIndexInfo(): string {
  return 'n:name c:competitionLevel g:m|f dob:dateOfBirth';
}


