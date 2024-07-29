const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const mf = require('@angular-architects/module-federation/webpack');
const path = require('path');

const share = mf.share;

const sharedMappings = new mf.SharedMappings();
sharedMappings.register(path.join(__dirname, '../../../tsconfig.base.json'), [
    /* mapped paths to share */
    '@de-care/shared/adobe-target-provider',
    '@de-care/shared/state-settings',
    '@de-care/shared/de-microservices-common',
]);

module.exports = {
    output: {
        uniqueName: 'de_care_use_cases_onboarding',
        publicPath: 'auto',
    },
    optimization: {
        runtimeChunk: false,
        minimize: false,
    },
    resolve: {
        alias: {
            ...sharedMappings.getAliases(),
        },
    },
    plugins: [
        new ModuleFederationPlugin({
            name: 'de_care_use_cases_onboarding',
            filename: 'remoteEntry.js',
            exposes: {
                './Module': 'apps/de-care-use-cases/onboarding/src/app/remote-entry/entry.module.ts',
            },
            shared: share({
                '@angular/core': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
                '@angular/router': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
                '@angular/common': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
                '@angular/common/http': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
                '@ngrx/store': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
                '@ngrx/effects': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
                'ngx-cookie-service': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
                '@ngx-translate/core': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
                ...sharedMappings.getDescriptors(),
            }),
        }),
        sharedMappings.getPlugin(),
    ],
};
