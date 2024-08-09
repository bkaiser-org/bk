import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom, Observable, of } from 'rxjs';

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

// this is called by a cloud function, the cloud function needs to read the token from a secret
export async function getRandomUser(http: HttpClient, apiNinjaBaseUrl: string, apiNinjaToken: string): Promise<RandomUser | null> {
  const httpOptions = {
    headers: new HttpHeaders({
      'X-Api-Key': apiNinjaToken
    })
  }
  try {
      const _user = await firstValueFrom(http.get<RandomUser>(new URL('v1/randomuser', apiNinjaBaseUrl).toString(), httpOptions));
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

// this is called by a cloud function, the cloud function needs to read the token from a secret
export function getWhoIsInfo(http: HttpClient, domain: string, apiNinjaBaseUrl: string, apiNinjaToken: string): Observable<WhoIsInfo[]> {
  const httpOptions = {
    headers: new HttpHeaders({
      'X-Api-Key': apiNinjaToken
    })
  }
  //     params: new HttpParams().set('domain', domain)
  try {
    console.log('calling ' + new URL('v1/whois?domain=' + domain, apiNinjaBaseUrl).toString() + ' with options:', httpOptions);
    return http.get<WhoIsInfo[]>(new URL('v1/whois?domain=' + domain, apiNinjaBaseUrl).toString(), httpOptions);
  }
  catch(_ex) {
    console.error('ApiNinjaUtil.getWhoIsInfo: ', _ex);
    return of([]);
  }
}

