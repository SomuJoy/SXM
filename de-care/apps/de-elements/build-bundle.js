const path = require('path');
const fs = require('fs');

const buildSourcePath = process.argv[2];
const outputPath = process.argv[3];
const filePrefix = process.argv[4] ? process.argv[4] : 'bundle';

async function bundle(format) {
    const files = await Promise.all([
        readFile(path.join(buildSourcePath, `assets/elements.settings.js`)),
        readFile(path.join(buildSourcePath, `assets/settings.js`)),
        readFile(path.join(buildSourcePath, format ? `runtime-${format}.js` : `runtime.js`)),
        readFile(path.join(buildSourcePath, format ? `polyfills-${format}.js` : `polyfills.js`)),
        readFile(path.join(buildSourcePath, `scripts.js`)),
        readFile(path.join(buildSourcePath, format ? `main-${format}.js` : `main.js`)),
    ]);

    try {
        await writeFile(path.join(outputPath, format ? `${filePrefix}-${format}.js` : `${filePrefix}.js`), files.join('\n'));
    } catch (e) {
        console.error('writeFile() error:', e);
    }
}

async function copyFile(fileName, outFileName) {
    if (!outFileName) {
        outFileName = fileName;
    }
    await fs.copyFile(path.join(buildSourcePath, fileName), path.join(outputPath, `${filePrefix}-${outFileName}`), (e) => {
        if (e) {
            console.error('copyFile() error:', e);
        }
    });
}

async function bundleAll() {
    await rmdirRecursive(outputPath);
    fs.mkdirSync(outputPath);
    await Promise.all([bundle(), copyFile('styles.css')]);
}

async function readFile(filePath) {
    return await new Promise((resolve, reject) => {
        fs.readFile(filePath, { encoding: 'utf-8' }, (err, data) => {
            if (err) {
                reject(`Error reading ${filePath}`);
            }
            resolve(data);
        });
    });
}

async function writeFile(filePath, data) {
    await new Promise((resolve, reject) => {
        fs.writeFile(filePath, data, (err, data) => {
            if (err) {
                reject(`Error writing ${filePath}`);
            }
            resolve(data);
        });
    });
}

async function rmdirRecursive(dirPath) {
    if (fs.existsSync(dirPath)) {
        fs.readdirSync(dirPath).forEach((file, index) => {
            const curPath = path.join(dirPath, file);
            if (fs.lstatSync(curPath).isDirectory()) {
                rmdirRecursive(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(dirPath);
    }
}

bundleAll();
