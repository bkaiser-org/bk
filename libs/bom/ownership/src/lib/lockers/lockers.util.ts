import { ModelType, RelationshipType, ResourceType } from '@bk/categories';
import { ExportFormat, EXPORT_FORMATS } from '@bk/core';
import { RelationshipModel } from '@bk/models';
import { exportXlsx, generateRandomString, name2numbers } from '@bk/util';

/**
 * 
 * @param ownerships 
 * @param tableName 
 */
export async function exportLockers(ownerships: RelationshipModel[], tableName: string): Promise<void> {
    const _table: string[][] = [];
    const _fn = generateRandomString(10) + '.' + EXPORT_FORMATS[ExportFormat.XLSX].abbreviation;
    _table.push(['Kasten Nr.', 'Schlüssel-Nr.', 'Name', 'Vorname', 'Mitglied', 'SC-Stäfa', 'Bemerkungen']);
    for (const _ownership of ownerships) {
        const _dataRow = convertToLockerRow(_ownership);
        if (_dataRow !== undefined) _table.push(_dataRow);
    }
    await exportXlsx(_table, _fn, tableName);
}

/**
 * 
 * @param ownership 
 * @returns 
 */
function convertToLockerRow(ownership: RelationshipModel): string[] {
  let _doubleNumber = name2numbers(ownership.objectName);
  const _lockerNr = _doubleNumber.number1 + '';
  const _keyNr = _doubleNumber.number2 + '';
  let _name = ownership.subjectName; // check for Seeclub
  if (_name === 'Seeclub Stäfa') _name = '';
  const _firstName = ownership.subjectName2;
  _doubleNumber = name2numbers(ownership.count);
  const _nrMember = _doubleNumber.number1 + '';
  const _nrClub = _doubleNumber.number2 + '';
  const _desc = ownership.description; // tbd: add resource description
  return [_lockerNr, _keyNr, _name, _firstName, _nrMember, _nrClub, _desc];
}

export function isLocker(rel: RelationshipModel): boolean {
  return (rel.category === RelationshipType.Ownership &&
    rel.objectType === ModelType.Resource &&
    (rel.objectCategory === ResourceType.FemaleLocker || rel.objectCategory === ResourceType.MaleLocker));
}
