// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

const webpack = require('@cypress/webpack-preprocessor');
const os = require('os');
const path = require('path');
const dotenv = require('dotenv');
const tsconfig = require('../../tsconfig');

// This function is called when a project is opened or re-opened (e.g. due to the project's config changing)
module.exports = (on, config) => {
    // Outputs the remote-debugging-port when the test launches in browser so that we can use it in our IDE to debug
    on('before:browser:launch', (browser, launchOptions) => {
        if (browser?.name === 'chrome') {
            const foundIndex = launchOptions.args.findIndex(item => item.indexOf('--remote-debugging-port') === 0);
            if (foundIndex !== -1) {
                console.log(`\n\n\n${launchOptions.args[foundIndex]}\n\n\n`);
            }
        }
        return launchOptions;
    });

    // add cucumber support (via Webpack)
    const webpackOptions = {
        resolve: { extensions: ['.ts', '.js'] },
        node: { fs: 'empty', child_process: 'empty', readline: 'empty' },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    exclude: [/node_modules/],
                    use: [{ loader: 'ts-loader' }]
                },
                {
                    test: /\.feature$/,
                    use: [{ loader: 'cypress-cucumber-preprocessor/loader' }]
                },
                {
                    test: /\.features$/,
                    use: [{ loader: 'cypress-cucumber-preprocessor/lib/featuresLoader' }]
                }
            ]
        }
    };
    // Since the Webpack bundler does not know about the path aliases in tsconfig.json we nee to
    //  tell Webpack how to alias modules by prefix. We will do this by reading our tsconfig.json
    //  to be able to configure these in there and then use those in the webpack resolve.
    if (tsconfig.compilerOptions.paths) {
        const alias = Object.keys(tsconfig.compilerOptions.paths).reduce((alias, key) => {
            if (!tsconfig.compilerOptions.paths[key][0]) {
                return alias;
            }
            return { ...alias, [key]: path.resolve(config.projectRoot, tsconfig.compilerOptions.paths[key][0]) };
        }, {});
        webpackOptions.resolve = { ...webpackOptions.resolve, alias };
    }
    on('file:preprocessor', webpack({ webpackOptions }));

    // Change site host URL if needed
    dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });
    const localHostname = process.env.SXM_hostname || os.hostname();
    const baseUrlDomain = `${localHostname}.corp.siriusxm.com`;
    if (config.baseUrl.indexOf('localhost:') >= 0) {
        config.baseUrl = config.baseUrl.replace('localhost:', `${baseUrlDomain}:`);
    }

    return config;
};
