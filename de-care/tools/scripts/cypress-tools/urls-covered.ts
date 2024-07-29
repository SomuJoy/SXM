import { findInFiles } from './src/find-in-files';
const yargs = require('yargs');
const fs = require('fs');

/**
 * Example usage
 *
 * npx ts-node tools/scripts/cypress-tools/urls-covered.ts --app='care' --output='./dist/cypress/apps/e2e-de-care/results'
 *
 */
const argv = yargs
    .option('app', {
        description: 'Which app to run coverage for',
        type: 'string',
        required: true,
    })
    .option('output', {
        description: 'Where to write the results file to',
        type: 'string',
        required: true,
    })
    .help()
    .alias('help', 'h').argv;

const path = `apps/e2e-de-${argv.app}/src/e2e/**/*.ts`;
const outputPath = `${argv.output}/covered-urls.json`;

findInFiles(path, /cy.visit\(([^;]*)\);/gim, (results) => {
    console.log('Files found: ', results.filesFound);
    console.log('URLS found: ', results.urlsFound);
    try {
        fs.writeFileSync(outputPath, results.json);
        console.log('Wrote results to: ', outputPath);
    } catch (error: any) {
        console.log(error);
    }
});
