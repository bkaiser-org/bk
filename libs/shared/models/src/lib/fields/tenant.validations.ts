import { test, enforce } from 'vest';
import { isArrayOfStrings } from '@bk/util';

export function tenantValidations(tenant: unknown ) {

  test('tenant', 'tenant must be of type string[]', () => {
    enforce(isArrayOfStrings(tenant)).isTruthy();
  });

  test('tenant', 'tenant must contain at least one element', () => {
    enforce((tenant as string[]).length).greaterThan(0);
  });

  // tbd: each tenant id must be a string of length 3-5
  // stringValidations('tenant', tenant, 5);

  // tbd: test for valid tenant ids
  /* test('tenant', 'validTenant', () => {
    enforce(tenant).inside(['scs', 'bka', 'bko', 'bkg', 'p13', 'kwo', 'kwa', 'pzu', 'cwst', 'sc7', 'r65']);
  }); */
}
