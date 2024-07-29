import { spawn } from 'child_process';
import { GherkinMessageFormatter } from './src/formatter';
import { deleteFile, fileExists } from './src/clean-up-utils';
import { Stopwatch } from './src/stopwatch';
const spinner = require('smart-spinner');
const yargs = require('yargs');

/**
 * Example usage
 *
 * npx ts-node tools/scripts/cypress-tools/run-tests.ts --app='care' --tag='@checkoutDigital'
 *
 */
const argv = yargs
    .option('app', {
        description: 'Which app to run coverage for',
        type: 'string',
    })
    .option('tag', {
        description: 'Filter tag to run (use multiple times for more tags)',
        type: 'array',
    })
    .option('debug', {
        description: 'Include debug info in output',
        type: 'boolean',
    })
    .help()
    .alias('help', 'h').argv;
const serveCommand = `serve.${argv.app}.local`;
const project = `apps/e2e-de-${argv.app}`;
const tags = argv.tag || [];
const ndjsonFilePath = `dist/cypress/apps/e2e-de-${argv.app}/results/cucumber.ndjson`;
const debug = argv.debug;
const stopwatch = new Stopwatch();

function printCommand(commandParts: string[]) {
    console.log(`Running command [${commandParts.join(' ')}]`);
}

function killProcess(process: any) {
    process?.stdin?.pause();
    process?.stdout?.destroy();
    process?.stderr?.destroy();
    process?.kill('SIGINT');
}

function runCypressCoverage({ project, tags, onCompleted }: { project: string; tags: string[]; onCompleted: (failedTestCount: number) => void }) {
    const commandParts = [
        'cypress',
        'run',
        `--project=${project}`,
        '--quiet',
        '--env',
        tags.length > 0 ? `tags='${tags.join(' and ')}',filterSpecs=true,omitFiltered=true` : '',
    ];
    if (debug) {
        console.log(`Cypress configuration`);
        console.log(`  Project: ${project}`);
        if (tags.length > 0) {
            console.log(`  Tags: ${tags.join(', ')}`);
        }
        printCommand(['npx', ...commandParts]);
        console.log('\n');
    }
    stopwatch.start();
    const progress = spinner.create('Running Cypress coverage');

    deleteFile(ndjsonFilePath);

    // NOTE:
    // If we are passing in --env args to the Cypress run then we need to
    // spawn using the { shell: true } option, otherwise that needs to be false
    // (it's a super mystery as to why this is happening, but whateves! This fix gets it working)
    const useShell = tags.length > 0;

    const child = spawn('npx', commandParts, {
        shell: useShell,
    });
    child.on('exit', (code: number) => {
        progress(code === 0, `Finished Cypress run. [duration - ${stopwatch.interval()}]`);
        onCompleted(code);
    });
    // TODO: Figure out if we can check for things like "no specs found" error and "(x of X)" to get the total number of specs to run
    //       and possibly even reporting out as each spec is run
    // child.stdout?.on('data', (data) => {
    // });
    return child;
}

function serveApp({ onCompleted }: { onCompleted: () => void }) {
    const commandParts = ['run', serveCommand];
    debug && printCommand(['npm', ...commandParts]);
    const progress = spinner.create('Starting app');
    const child = spawn('npm', commandParts);
    child.stdout?.on('data', (data) => {
        if (data.indexOf('** Angular Live Development Server') >= 0) {
            progress(true, 'App running');
            onCompleted();
        }
        if (data.indexOf('? Port') >= 0) {
            progress(false, 'Cannot serve app, port is already in use.');
            killProcess(child);
        }
    });
    return child;
}

const serveProcess = serveApp({
    onCompleted: () => {
        const cypressProcess = runCypressCoverage({
            project,
            tags,
            onCompleted: (exitCode) => {
                killProcess(serveProcess);
                killProcess(cypressProcess);
                if (fileExists(ndjsonFilePath)) {
                    const gherkinMessageFormatter = new GherkinMessageFormatter(ndjsonFilePath);
                    const results = gherkinMessageFormatter.results();
                    if (results.failed > 0) {
                        console.log(`Failed test count: ${results.failed}`);
                        gherkinMessageFormatter.consoleLogFailed();
                    } else {
                        console.log(`All tests passed!`);
                    }
                } else {
                    console.log(`Failed run with exit code ${exitCode}`);
                }
            },
        });
    },
});
