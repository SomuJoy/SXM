const { exec } = require('child_process');
const fs = require('fs');

const base = process.argv[2]; // Example: remotes/origin/project/CARE_RELEASE_0047000
const head = process.argv[3]; // Example: remotes/origin/feature/DEX-18403-fix-rtc-prod-bug
const file = process.argv[4];
const verbose = process.argv.includes('--verbose');

const command = `nx affected:lint run-many --base=${base} --head=${head} --parallel -- --format json`;
if (verbose) {
    console.log('Executing command:');
    console.log(command);
}

const child = exec(command);

let results = [];
child.stdout.on('data', data => {
    // TODO: if data is large (lots of lint errors)) the buffer will kick in and this stdout will only contain partial json...need to support that scenario
    if (data.startsWith('[') && !data.startsWith('[]')) {
        const errors = getNewErrors(results, JSON.parse(data));
        if (errors.length > 0) {
            results = [...results, ...errors];
            if (verbose) {
                errors.forEach(outputError);
            }
        }
    } else if (data.toLowerCase().match('failed')) {
        console.warn(data);
    }
});

child.on('exit', function(code) {
    if (file) {
        fs.writeFileSync(file, JSON.stringify(results));
        console.log(`Results written to ${file}`);
    }
    console.warn(`Exiting with code ${code}`);
    process.exit(code);
});

function getNewErrors(currentErrors, newErrors) {
    const resultsAsStrings = currentErrors.map(result => JSON.stringify(result));
    return newErrors.filter(error => !resultsAsStrings.includes(JSON.stringify(error)));
}

function outputError({ failure, name }) {
    console.log(failure);
    console.log(`File: ${name}`);
    console.log();
}
