import { listAllObjects } from '@bk/base';
import { CollectionNames, bkTranslate } from '@bk/util'
import { Firestore } from 'firebase/firestore';
import { Observable, map } from 'rxjs'

export const CH_ZIPCODE_LENGTH = 4;

export interface SwissCity {
    zipCode: number,
    name: string,
    stateCode: string,
    countryCode: string
}

export function loadSwissCities(firestore: Firestore): Observable<SwissCity[]> {
  return listAllObjects(firestore, CollectionNames.SwissCities, 'zipCode', 'asc') as unknown as Observable<SwissCity[]>;
}

export function filterCitiesByZipCode(allCities$: Observable<SwissCity[]>, searchTerm: string): Observable<SwissCity[]> {
    return allCities$.pipe(map(_cities => _cities.filter(_city => (_city.zipCode+'').startsWith(searchTerm))));
}

export function filterCitiesByName(allCities$: Observable<SwissCity[]>, searchTerm: string): Observable<SwissCity[]> {
  return allCities$.pipe(map(_cities => _cities.filter(_city => (_city.name.toLowerCase()).startsWith(searchTerm.toLowerCase()))));
}

export function convertCountryCode(countryCode: string): string {
  return bkTranslate('@general.countries.' + countryCode.toUpperCase());
}

export function convertStateCode(stateCode: string): string {
  return bkTranslate('@general.states.CH.' + stateCode.toUpperCase());
}