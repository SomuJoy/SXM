import { strings } from '@angular-devkit/core';
import { generateFiles, joinPathFragments, Tree } from '@nrwl/devkit';

interface Schema {
    testName: string;
    useCaseName: 'checkout' | 'account' | 'subscription' | 'onboarding' | 'third-party-billing' | 'third-party-linking' | 'do-not-call';
    featureName: string;
    scenarioPath?: string;
    tag: 'checkoutDigital' | 'checkoutSatellite' | 'myAccount' | 'onboarding' | 'retain';
}

export default async function (tree: Tree, schema: Schema) {
    await cypressTestGenerator(tree, schema);
}

export async function cypressTestGenerator(tree: Tree, schema: Schema) {
    generateFiles(tree, joinPathFragments(__dirname, './files'), 'apps/e2e-de-care/src', {
        testName: strings.dasherize(schema.testName),
        useCaseName: strings.dasherize(schema.useCaseName),
        featureName: strings.dasherize(schema.featureName),
        scenarioPath: strings.dasherize(schema.scenarioPath || '/'),
        tag: schema.tag,
    });
}
