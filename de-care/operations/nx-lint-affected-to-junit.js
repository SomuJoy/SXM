const { exec } = require('child_process');
const fs = require('fs');

const base = process.argv[2]; // Example: remotes/origin/project/CARE_RELEASE_0047000
const head = process.argv[3]; // Example: remotes/origin/feature/DEX-18403-fix-rtc-prod-bug
const file = process.argv[4] || 'coverage/lint/affected.junit.xml';
const quiet = process.argv.includes('--quiet');

const outFile = 'coverage/lint/temp.xml';

const command = `nx affected:lint run-many --parallel --skip-nx-cache --base=${base} --head=${head} -- --format junit --output-file="${outFile}"`;
if (!quiet) {
    console.log('Executing command:');
    console.log(command);
}

const child = exec(command);

function getTestSuiteNodes(data) {
    let nodes = data.replace('<?xml version="1.0" encoding="utf-8"?>', '');
    nodes = nodes.replace('<testsuites>', '');
    nodes = nodes.replace('<testsuites package="tslint">', '');
    nodes = nodes.replace('</testsuites>', '');
    nodes = nodes.trim();
    return nodes;
}

function deleteFile(file) {
    if (fs.existsSync(file)) {
        fs.unlinkSync(file);
    }
}

let errorHeadlineExists = false;
function dataHasImportantNxMessaging(data) {
    if (data.indexOf('Running target "lint" failed') >= 0) {
        errorHeadlineExists = true;
    }
    return data.indexOf('Running target lint') >= 0 || errorHeadlineExists;
}

let testSuites = '';
child.stdout.on('data', data => {
    if (!quiet && dataHasImportantNxMessaging(data)) {
        console.log(data);
    }
    // Aggregate outfile data together
    if (fs.existsSync(outFile)) {
        const previous = fs.readFileSync(outFile).toString();
        testSuites = `${testSuites}${getTestSuiteNodes(previous.toString())}`;
    }
});

child.on('exit', function(code) {
    if (file) {
        deleteFile(file);
        if (testSuites.length > 0) {
            fs.writeFileSync(file, `<?xml version="1.0" encoding="utf-8"?><testsuites>${testSuites}</testsuites>`);
            if (!quiet) {
                console.log(`Results written to ${file}`);
            }
        }
    }
    deleteFile(outFile);
    console.warn(`Exiting with code ${code}`);
    process.exit(code);
});
