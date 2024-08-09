import { addIndexElement } from '@bk/base';
import { EventTypes, getCategoryAbbreviation } from '@bk/categories';
import { BaseModel, isEvent } from '@bk/models';


/* ---------------------- Index operations -------------------------*/
/**
 * Create an index entry for a given event based on its values.
 * @param event 
 * @returns the index string
 */
export function getEventIndex(event: BaseModel): string {
  let _index = '';
  if (isEvent(event)) {
    _index = addIndexElement(_index, 'n', event.name);
    _index = addIndexElement(_index, 'sd', event.startDate);
    // tbd: calendar name
    _index = addIndexElement(_index, 'et', getCategoryAbbreviation(EventTypes, event.category));
  }
  return _index;
}

/**
 * Returns a string explaining the structure of the index.
 * This can be used in info boxes on the GUI.
 */
export function getEventIndexInfo(): string {
  return 'n:name sd:startDate et:eventType';
}

