const fs = require('fs');
const glob = require('glob');

const normalizeUrl = (url: string) => {
    return url.startsWith('/') ? url : `/${url}`;
};

export const findInFiles = (globPattern: string, regexPattern: RegExp, callback: (results: { filesFound: number; urlsFound: number; json: string }) => void) => {
    glob(globPattern, {}, (er: Error | null, files: string[]) => {
        // files is an array of filenames.
        if (files.length > 0) {
            const results = files.reduce((set: string[], next: string): string[] => {
                const urlsFound = findInFile(next, regexPattern);
                return [...set, ...urlsFound];
            }, []);
            const unique = [...new Set(results)].map(normalizeUrl).sort();
            const data = unique.reduce((set: { basePath: string; urls: string[] }[], url: string) => {
                const basePath = url.split('?')?.[0];
                const existingRecord = set.find((i) => i.basePath === basePath);
                if (existingRecord) {
                    existingRecord.urls = [...existingRecord.urls, url];
                } else {
                    set.push({
                        basePath,
                        urls: [url],
                    });
                }
                return set;
            }, []);
            callback({ filesFound: files.length, urlsFound: unique.length, json: JSON.stringify({ urlsFound: unique.length, coveredUrls: data }) });
        }
    });
};

const findInFile = (filePath: string, regexPattern: RegExp): string[] => {
    const file = fs.readFileSync(filePath, { encoding: 'utf8' });
    const match = Array.from(file?.matchAll(regexPattern), (m: string[]) => m[1]);
    if (match?.length > 0) {
        return [match[0].replace("'", '').replace('`', '')];
    }
    return [];
};
