import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration } from '@nx/devkit';

import { bkCreateAppGenerator } from './generator';
import { BkCreateAppGeneratorSchema } from './schema';

describe('bk-create-app generator', () => {
  let tree: Tree;
  const options: BkCreateAppGeneratorSchema = {
    app_domain: 'test.com',
    app_name: 'test application',
    app_reldate: '20240808',
    app_version: '1.0.0',
    imgix_baseurl: 'https://test.imgix.net',
    tenant_id: 'tst',
    tenant_name: 'testapp',
    dpo_name: 'DPO_NAME',
    dpo_email: 'DPO_EMAIL',
    dpa_version: 'DPA_VERSION',
    dpa_date: 'DPA_DATE',
    git_org: 'GIT_ORG',
    git_repo: 'GIT_REPO',
    gmap_key: 'GMAP_API_KEY',
    op_name: 'OP_NAME',
    op_email: 'OP_EMAIL',
    op_street: 'OP_STREET',
    op_zipcode: 'OP_ZIPCODE',
    op_city: 'OP_CITY',
    op_uid: 'OP_UID',
    op_url: 'OP_URL'
  };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await bkCreateAppGenerator(tree, options);
    const config = readProjectConfiguration(tree, 'test');
    expect(config).toBeDefined();
  });
});
