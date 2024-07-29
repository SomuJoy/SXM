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
import { hostname } from 'os';

// tslint:disable-next-line nx-enforce-module-boundaries
import { environment as usEnv } from '../../../de-care/src/environments/environment';
// tslint:disable-next-line nx-enforce-module-boundaries
import { environment as caEnv } from '../../../de-care/src/environments/environment.canada';

import { Settings } from '@de-care/settings';

const DEFAULT_MICROSERVICES_URL = 'https://dex-dev.corp.siriusxm.com/dvgllvdexoac05-17650-care';

// We can place a .env file at the root of the workspace (/de-care) to pass env arguments
const pathToDotEnvConfig = resolve(__dirname, '../../../../.env');
require('dotenv').config({ path: pathToDotEnvConfig });

export default (on: any, config: any) => {
    /**
     * Outputs the remote-debugging-port when the test launches in browser so that we can use it in our IDE to debug
     */
    on('before:browser:launch', (browser: any, launchOptions: { args: string[] }) => {
        if (browser?.name === 'chrome') {
            const foundIndex = launchOptions.args.findIndex(item => item.indexOf('--remote-debugging-port') === 0);

            if (foundIndex !== -1) {
                console.log(`\n\n\n${launchOptions.args[foundIndex]}\n\n\n`);
            }
        }

        return launchOptions;
    });

    // Preprocess Typescript file using Nx helper
    on(
        'file:preprocessor',
        preprocessTypescript(config, wpConfig => {
            wpConfig.node = {
                fs: 'empty',
                child_process: 'empty',
                readline: 'empty'
            };
            wpConfig.module.rules.push({
                test: /\.feature$/,
                use: [
                    {
                        loader: 'cypress-cucumber-preprocessor/loader'
                    }
                ]
            });
            return wpConfig;
        })
    );

    const localHostname = process.env.CYPRESS_hostname || hostname();
    const baseUrlDomain = `http://${localHostname}.corp.siriusxm.com`;

    // We are hard-coding the ports here as they don't change frequently
    config.baseUrl = process.env.CYPRESS_BASE_URL_OVERRIDE || (config.env.isCanada ? `${baseUrlDomain}:4201` : `${baseUrlDomain}:4200`);

    const appMicroserviceURL = getMicroserviceURLFromAppEnvFile(config.env.isCanada ? caEnv.settings : usEnv.settings);

    config.env.microservicesEndpoint = process.env.CYPRESS_MICROSERVICES_URL_OVERRIDE || appMicroserviceURL || DEFAULT_MICROSERVICES_URL;

    // allow screenshots to be collected for failed tests in CI
    if (config.env.allowScreenshots) {
        Cypress.Screenshot.defaults({ screenshotOnRunFailure: true });
    }

    return config;
};

function getMicroserviceURLFromAppEnvFile(settings: Settings) {
    return settings.apiUrl;
}
