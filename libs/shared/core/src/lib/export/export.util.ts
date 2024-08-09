import { bkTranslate, getProperty, generateRandomString, exportXlsx } from '@bk/util';
import { ExportConfig, ExportFormat, EXPORT_FORMATS } from './export-format';
import { FieldDescription } from '@bk/models';

export function newExportConfig(): ExportConfig {
    return {
        exportFormat: ExportFormat.XLSX,
        isSelection: false,
        isCustom: false,
        model: '',
        listName: '',
        fields: [],
        nrOfFields: 0
    }
}

export async function export2excel(
    items: unknown[], 
    tableDescription: FieldDescription[], 
    tableName: string): Promise<void> {
    const _fn = generateRandomString(10) + '.' + EXPORT_FORMATS[ExportFormat.XLSX].abbreviation;
    const _table: string[][] = convertToTable(items, tableDescription);
    exportXlsx(_table, _fn, tableName);
}

/**
 * Convert data into a table. The generated header and rows are
 * defined with the table description. 
 * @param items$ the data to convert
 * @param tableDescription the description of headers and fields in a row
 */
export function convertToTable(data: unknown[], tableDescription: FieldDescription[]): string[][] {
    const _table: string[][] = [];
    const _fields: string[] = getFields(tableDescription);
    const _headers: string[] = getLabels(tableDescription);
    _table.push(convertToHeaderRow(_fields, _headers));
    for (const _value of data) {
        _table.push(convertToDataRow(_value, _fields));
    }
    return _table;
}

/**
* Generate a data row containing the field values given in fields.
* @param item the source data
* @param fields an array of field names selecting the chosen fields of boat
*/
function convertToDataRow(item: unknown, fields: string[]): string[] {
    const _row: string[] = [];
    for (const field of fields) {
        const _value = getProperty(item, field as keyof typeof item);
        if (!_value) {
            _row.push('');
        } else {
            _row.push(_value as string);
        }
    }
    return _row;
}

/**
 * Generate the header row.
 * If headers are not given, use the field names as the header fields.
 * @param fields
 * @param headers
 */
function convertToHeaderRow(fields: string[], headers: string[]): string[] {
    return !headers ? fields : headers;
}

export function getFields(tableDescription: FieldDescription[], all = false): string[] {
    const _fields: string[] = [];
    for (const _field of tableDescription) {
        if (all === true || _field.value === true) {
            _fields.push(_field.name);
        }
    }
    return _fields;
}

export function getLabels(tableDescription: FieldDescription[], all = false): string[] {
    const _labels: string[] = [];
    for (const _field of tableDescription) {
        if (all === true || _field.value === true) {
            _labels.push(bkTranslate(_field.label));
        }
    }
    return _labels;
}
