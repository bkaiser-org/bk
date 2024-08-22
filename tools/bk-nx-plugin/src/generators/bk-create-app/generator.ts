import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  Tree,
} from '@nx/devkit';
import * as path from 'path';
import { BkCreateAppGeneratorSchema } from './schema';
import { format } from 'date-fns';

// precondition: write the configuration according to the schema in schema.json into a config file called bk-config.ts and export config object.

export async function bkCreateAppGenerator(
  tree: Tree,
  options: BkCreateAppGeneratorSchema
) {
  const _todayDate = format(new Date(), 'yyyyMMdd');
  const resolvedOptions = {
    ...options,
    today: _todayDate
  };

  const projectRoot = `apps/${resolvedOptions.tenant_id}`;
  addProjectConfiguration(tree, resolvedOptions.tenant_id, {
    root: projectRoot,
    projectType: 'application',
    sourceRoot: `${projectRoot}/src`,
    targets: {},
  });
  console.log('projectRoot', projectRoot);
  console.log('resolvedOptions', resolvedOptions);
  console.log('path.join(__dirname, files)', path.join(__dirname, 'files'));
  generateFiles(tree, path.join(__dirname, 'files'), projectRoot, resolvedOptions);
  await formatFiles(tree);
}

export default bkCreateAppGenerator;
