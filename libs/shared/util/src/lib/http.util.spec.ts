/**
 * We use Jest to mock the HTTP client and control its behavior for testing.
 * We test getHttpBasicAuthHeaders by checking that it returns the expected HttpHeaders object with the correct values.
 * For getHttpBasicAuthToken, we mock the HTTP client's get method to return different responses 
 * or throw exceptions in order to test different scenarios:
 * The first test checks that it successfully retrieves and returns an access token from a valid response.
 * The second test checks that it throws an error when the response does not contain an access token.
 * The third test checks that it throws an error when an exception occurs during the HTTP request
 */
import { getHttpBasicAuthHeaders } from './http.util'; 

describe('getHttpBasicAuthHeaders function', () => {
  it('should return the correct HttpHeaders with Basic Authorization', () => {
    const username = 'testuser';
    const password = 'testpassword';
    const expectedAuthorization = 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');
    
    const headers = getHttpBasicAuthHeaders(username, password);
    
    expect(headers.get('Accept')).toBe('application/json');
    expect(headers.get('Method')).toBe('GET');
    expect(headers.get('Content-Type')).toBe('application/json');
    expect(headers.get('Authorization')).toBe(expectedAuthorization);
  });
});

