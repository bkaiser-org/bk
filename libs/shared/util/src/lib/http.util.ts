import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { die } from './log.util';

/**
 *  HttpToken is used as the result from a BasicAuth authentication (with username and password).
 *  access_token contains the Access Token that can be used for authenticating follow-up requests.
 *  token_type will typically be 'bearer' and can be ignored.
 * */ 
export interface HttpToken {
    access_token: string,
    token_type: string
}

export function getHttpBasicAuthHeaders(username: string, password: string): HttpHeaders {
    return new HttpHeaders({
        'Accept': 'application/json',
        'Method': 'GET',
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64'),
    });
}

export async function getHttpBasicAuthToken(http: HttpClient, tokenUrl: string, username: string, password: string): Promise<string> {
  try {
    const _header = getHttpBasicAuthHeaders(username, password);
    const _response = await lastValueFrom(http.get<HttpToken>(tokenUrl, { headers: _header }));
    const _token = _response.access_token;
    if (!_token) die('HttpUtil.getHttpBasicAuthToken: invalid access token');
    return _token;
  }
  catch(_ex) {
    die('HttpUtil.getHttpBasicAuthToken: error reading the access token: ' + JSON.stringify(_ex));
  }
}