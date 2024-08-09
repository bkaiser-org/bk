import { test, enforce } from 'vest';
import { stringValidations } from '../primitive-validations/string.validations';

export function tenantValidations(tenant: unknown ) {

  stringValidations('tenant', tenant, 10, 1, true);

  test('tenant', 'validTenant', () => {
    enforce(tenant).inside(['scs', 'bk', 'coalist', 'sps', 'k83b', 'pz', 'p13']);
  });
}
