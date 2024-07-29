import { Envelope } from '@cucumber/messages';
import { readFileSync } from 'fs';

export const loadEnvelopesFromFile = (file: string): Envelope[] => {
    const envelopesFileData = readFileSync(file, 'utf8');
    const jsonEntries: string[] = envelopesFileData.split(/\n/gi);
    // TODO: reduce to be able to remove empty entries
    return jsonEntries.map((entry) => (entry ? JSON.parse(entry) : entry));
};
