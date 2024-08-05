import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';

import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    ...nxE2EPreset(__filename, {
      cypressDir: 'src',
      webServerCommands: {
        default: 'nx run sps:serve:development',
        production: 'nx run sps:serve:production',
      },
      ciWebServerCommand: 'nx run sps:serve-static',
    }),
    baseUrl: 'http://localhost:4200',
  },
});
