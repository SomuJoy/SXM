import { defineConfig } from 'cypress';
import * as webpack from '@cypress/webpack-preprocessor';
import { addCucumberPreprocessorPlugin } from '@badeball/cypress-cucumber-preprocessor';

export async function setupNodeEvents(on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions): Promise<Cypress.PluginConfigOptions> {
    await addCucumberPreprocessorPlugin(on, config);

    on(
        'file:preprocessor',
        webpack({
            webpackOptions: {
                resolve: {
                    extensions: ['.ts', '.js'],
                },
                module: {
                    rules: [
                        {
                            test: /\.ts$/,
                            exclude: [/node_modules/],
                            use: [
                                {
                                    loader: 'ts-loader',
                                },
                            ],
                        },
                        {
                            test: /\.feature$/,
                            use: [
                                {
                                    loader: '@badeball/cypress-cucumber-preprocessor/webpack',
                                    options: config,
                                },
                            ],
                        },
                    ],
                },
            },
        })
    );

    // Make sure to return the config object as it might have been modified by the plugin.
    return config;
}

export default defineConfig({
    fileServerFolder: '.',
    fixturesFolder: './src/fixtures',
    video: false,
    videosFolder: '../../dist/cypress/apps/e2e-de-care/videos',
    screenshotsFolder: '../../dist/cypress/apps/e2e-de-care/screenshots',
    chromeWebSecurity: false,
    blockHosts: ['*adobedtm.com', '*amazon.com'],
    e2e: {
        baseUrl: 'http://localhost:4200',
        setupNodeEvents,
        specPattern: '**/*.feature',
        supportFile: './src/support/index.ts',
    },
    reporterOptions: {
        reportDir: '../../dist/cypress/apps/e2e-de-care/results',
        overwrite: false,
        html: false,
        json: true,
    },
});
