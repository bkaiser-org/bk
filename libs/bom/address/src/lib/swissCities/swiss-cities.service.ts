import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SwissCity } from './swiss-cites.util';
import { collection, query, where } from 'firebase/firestore';
import { CollectionNames, getNextString } from '@bk/util';
import { collectionData } from 'rxfire/firestore';
import { FIRESTORE } from '@bk/util';

@Injectable({
    providedIn: 'root'
  })
export class SwissCityService {
  private firestore = inject(FIRESTORE);

  public filterCitiesByZipCode(searchTerm: number): Observable<SwissCity[]> {
      const _queryRef = query(collection(this.firestore, CollectionNames.SwissCities), 
      where('zipCode', '>=', this.getZipCodeNumber(searchTerm)), 
      where('zipCode', '<', this.getZipCodeNumber(searchTerm + 1)));
    return collectionData(_queryRef) as Observable<SwissCity[]>;

  }

    public filterCitiesByName(searchTerm: string): Observable<SwissCity[]> {
      // tbd solve with lowercase
      const _queryRef = query(collection(this.firestore, CollectionNames.SwissCities), 
        where('name', '>=', searchTerm), 
        where('name', '<', getNextString(searchTerm)));
      return collectionData(_queryRef) as Observable<SwissCity[]>;
    }

    private getZipCodeNumber(searchTerm: number): number {
      if (searchTerm < 10) return searchTerm * 1000;
      if (searchTerm < 100) return searchTerm * 100;
      if (searchTerm < 1000) return searchTerm * 10;
      return searchTerm % 10000;
    }
  }
