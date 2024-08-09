import { Category } from '@bk/categories';
import { FieldDescription } from '@bk/models';

export type ExportCategory = Category;

export enum ExportFormat {
    JSON = 0,
    XML = 1,
    XLSX = 2,
    CSV = 3
}

export interface ExportConfig {
  exportFormat: ExportFormat;
  isSelection: boolean;
  isCustom: boolean;
  model: string;
  listName: string;
  fields: FieldDescription[];
  nrOfFields: number;
}

/* abbreviation contains the file extension
   name contains the format name
*/
export const EXPORT_FORMATS: ExportCategory[] = [
    {
        id: ExportFormat.JSON,
        abbreviation: 'json',
        name: 'json',
        i18nBase: 'core.export.json',
        icon: 'barcode-outline'
    },
    {
        id: ExportFormat.XML,
        abbreviation: 'xml',
        name: 'xml',
        i18nBase: 'core.export.xml',
        icon: 'code-outline'
    },
    {
        id: ExportFormat.XLSX,
        abbreviation: 'xlsx',
        name: 'xlsx',
        i18nBase: 'core.export.xlsx',
        icon: 'grid-outline'
    },
    {
        id: ExportFormat.CSV,
        abbreviation: 'csv',
        name: 'csv',
        i18nBase: 'core.export.csv',
        icon: 'reorder-four-outline'
    }
]
