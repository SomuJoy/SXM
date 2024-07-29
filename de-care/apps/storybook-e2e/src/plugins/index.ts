// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

import { preprocessTypescript } from '@nrwl/cypress/plugins/preprocessor';
import { resolve } from 'path';

// We can place a .env file at the root of the workspace (/de-care) to pass env arguments
const pathToDotEnvConfig = resolve(__dirname, '../../../../.env');
require('dotenv').config({ path: pathToDotEnvConfig });

export default (on: any, config: any) => {
    // Preprocess Typescript file using Nx helper

    // display the remote debugging port for Chrome to allow IDEs to set breakpoints
    on('before:browser:launch', () => {
        if (process.env.CYPRESS_REMOTE_DEBUGGING_PORT) {
            console.log(`\n\nYou can connect to port ${process.env.CYPRESS_REMOTE_DEBUGGING_PORT} to debug remotely\n\n`);
        }
    });

    return config;
};
