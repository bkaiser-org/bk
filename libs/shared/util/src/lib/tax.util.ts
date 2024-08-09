import { Pipe, PipeTransform } from '@angular/core';

/**
 * CH VAT number format is CHE-123.456.789 MWST. That is how it is stored in the database.
 * The number can be inserted as 123456789, 123.456.789, as CHE123456789, as CHE-123.123.123
 * This function converts the inserted string (sourceVat) into the formatted string.
 * e.g. CHE123456789 -> CHE-123.456.789 MWST
 * @param sourceVat the inserted string
 * @returns the formatted VAT number
 */
export function formatMwst(sourceVat: string): string {
    let _src = sourceVat.trim().replace(/[\s-.]/g, '').toUpperCase();
    if (_src.startsWith('CHE')) _src = _src.substring(3);
    if (_src.endsWith('MWST')) _src = _src.substring(0, _src.length-4);
    if (_src.length === 9) return `CHE-${_src.substring(0,3)}.${_src.substring(3,6)}.${_src.substring(6,9)} MWST`;
    else return _src;
}

@Pipe({ 
    name: 'cheVatMask',
    standalone: true
  })
  export class CheVatMaskPipe implements PipeTransform {
  transform(value: string): string {
    return formatMwst(value);
  }
  }
  