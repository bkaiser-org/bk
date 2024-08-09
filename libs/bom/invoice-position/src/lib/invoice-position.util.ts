import { addIndexElement } from "@bk/base";
import { getCategoryAbbreviation, InvoicePositionTypes } from "@bk/categories";
import { BaseModel, isInvoicePosition } from "@bk/models";

/* ---------------------- Index operations -------------------------*/
/**
 * Create a new index for an InvoicePosition based on its values.
 * @param invoicePosition 
 * @returns the index
 */
export function getInvoicePositionIndex(invoicePosition: BaseModel): string {
  let _index = '';
  if (isInvoicePosition(invoicePosition)) {
    _index = addIndexElement(_index, 'n', invoicePosition.firstName + ' ' + invoicePosition.name);
    _index = addIndexElement(_index, 'y', invoicePosition.year);
    _index = addIndexElement(_index, 'c',  getCategoryAbbreviation(InvoicePositionTypes, invoicePosition.category));
  }
  return _index;
}

/**
 * Returns a string explaining the structure of the index.
 * This can be used in info boxes on the GUI.
 */
export function getInvoicePositionIndexInfo(): string {
  return 'n:name y:year c:category';
}
