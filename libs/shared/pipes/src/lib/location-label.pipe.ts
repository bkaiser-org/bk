import { Pipe, PipeTransform } from '@angular/core';

/**
 * Takes a location string in the form of [locationKey]@[locationLabel]
 * and converts it into a human readable label.
 * The label may consist of several location names, but the whole key is shown as is.
 */
@Pipe({
  name: 'locationLabel',
  standalone: true
})
export class LocationLabelPipe implements PipeTransform {
  transform(name: string): string {
    if (name.indexOf('@') === -1) return name;
    const _parts = name.split('@');
    if (_parts.length !== 2) return name;
    return _parts[1] ?? '';
  }
}
