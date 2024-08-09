import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom, Observable, of } from 'rxjs';
import { ApiNinjaToken, ApiNinjaBaseUrl } from '@bk/env';

/**
 * Helper functions to access APIs on api-ninjas.com.
 */

//------------------------------------------------------------------
// RandomUser
//------------------------------------------------------------------
export interface RandomUser {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selected: boolean;
  username: string,
  sex: string,
  address: string,
  name: string,
  email: string,
  birthday: string,
  }

  // add additionally supported types here to make them usable in the funcitons below
export type ApiNinjaType = RandomUser | WhoIsInfo;

export async function getRandomUser(http: HttpClient): Promise<RandomUser | null> {
  const httpOptions = {
    headers: new HttpHeaders({
      'X-Api-Key': ApiNinjaToken
    })
  }
  try {
      const _user = await firstValueFrom(http.get<RandomUser>(new URL('v1/randomuser', ApiNinjaBaseUrl).toString(), httpOptions));
      _user.selected = false;
      return _user;
  }
  catch(_ex) {
    console.error('ApiNinjaUtil.getRandomUsers: ', _ex);
    return null;
  }
}

//------------------------------------------------------------------
// WhoIs
//------------------------------------------------------------------
export interface WhoIsInfo {
  domain_name: string,
  registrar: string,
  whois_server: string,
  updated_date: number,
  creation_date: number,
  expiration_date: number,
  name_servers: string[],
  dnssec: string
}

export function getWhoIsInfo(http: HttpClient, domain: string): Observable<WhoIsInfo[]> {
  const httpOptions = {
    headers: new HttpHeaders({
      'X-Api-Key': ApiNinjaToken
    })
  }
  //     params: new HttpParams().set('domain', domain)
  try {
    console.log('calling ' + new URL('v1/whois?domain=' + domain, ApiNinjaBaseUrl).toString() + ' with options:', httpOptions);
    return http.get<WhoIsInfo[]>(new URL('v1/whois?domain=' + domain, ApiNinjaBaseUrl).toString(), httpOptions);
  }
  catch(_ex) {
    console.error('ApiNinjaUtil.getWhoIsInfo: ', _ex);
    return of([]);
  }
}

