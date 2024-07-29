const yargs = require('yargs');
const fs = require('fs');
const { spawn } = require('child_process');

// TODO: move this out into a utilities file for re-use
const https = require('https');
const httpsAsync = async (url) => {
    const result = await new Promise((resolve) => {
        let data = '';
        https.get(url, (res) => {
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                resolve(data);
            });
        });
    });
    return JSON.parse(result.toString());
};

const argv = yargs
    .option('environmentNumber', {
        alias: 'ci',
        description: 'Which CI environment number to use',
        type: 'number',
    })
    .option('performance', {
        alias: 'perf',
        description: 'Run for performance testing (production build)',
        type: 'boolean',
    })
    .option('port', {
        alias: 'p',
        description: 'Override port to use',
        type: 'number',
    })
    .option('configurationModifier', {
        alias: 'cm',
        description: 'Apply modifier name to serve configuration name (example: "atlas" to use the "local-atlas" configuration)',
        type: 'string',
    })
    .help()
    .alias('help', 'h').argv;
const environmentNumber = argv.environmentNumber;
const runForPerformance = argv.performance;
const configurationModifier = argv.configurationModifier;
const port = argv.port;
const url = 'https://desk-de-api.ingress.devtest.corp.siriusxm.com/api/environments/care-oac';

const doWork = async (url, environmentNumber) => {
    const json = await httpsAsync(url);
    if (Array.isArray(json)) {
        const envs = environmentNumber ? json.filter(({ id }) => id == environmentNumber) : json;
        const data = mapEnvData('de-care', envs);
        // create temp proxy files
        createProxyFiles('.proxies/angular', data);
        // call serve with path to temp proxy file
        serve(data[0].proxyConfigFileName, data[0].isCanada);
    }
};
doWork(url, environmentNumber);

const mapEnvData = (appName, environmentEntries) => {
    return environmentEntries.map(({ id, country, hostname, microservicesPort }) => ({
        id,
        isCanada: country.trim().toUpperCase() === 'CANADA',
        proxyConfigFileName: `${appName}.env${id}-proxy.config.json`,
        proxyConfig: {
            '/microservices': {
                target: 'https://dex-dev.corp.siriusxm.com',
                secure: true,
                changeOrigin: true,
                pathRewrite: {
                    '^/microservices': `${hostname}-${microservicesPort}-care`,
                },
                logLevel: 'debug',
            },
        },
    }));
};

// TODO: change this to async/await
const createProxyFiles = (filePath, data) => {
    fs.mkdirSync(filePath, { recursive: true });
    data.forEach(({ proxyConfigFileName, proxyConfig }) => {
        const fileName = `${filePath}/${proxyConfigFileName}`;
        fs.writeFileSync(fileName, JSON.stringify(proxyConfig));
    });
};

// TODO: change this to async/await
const serve = (proxyConfigFileName, isCanada) => {
    const configurationSuffixPieces = [];
    if (configurationModifier) {
        configurationSuffixPieces.push(configurationModifier);
    }
    if (isCanada) {
        configurationSuffixPieces.push('canada');
    }
    if (runForPerformance) {
        configurationSuffixPieces.push('perf');
    }
    const configuration = configurationSuffixPieces.length > 0 ? `local-${configurationSuffixPieces.join('-')}` : `local`;
    const commandParts = [
        'ng',
        'serve',
        `--configuration=${configuration}`,
        `--proxyConfig=.proxies/angular/${proxyConfigFileName}`,
        '--disable-host-check',
        '--host=0.0.0.0',
    ];
    if (port) {
        commandParts.push(`--port=${port}`);
    }
    const child = spawn('npx', commandParts, {
        stdio: 'inherit',
        shell: true,
    });
    child.stdout?.on('data', (data) => {
        console.log(`${data}`);
    });
    child.stderr?.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });
};
