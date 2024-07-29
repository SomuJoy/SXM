import { STORAGE_KEY_PREFIX } from './constants';

export function buildStorageKey(key: string): string {
    return `${STORAGE_KEY_PREFIX}_${key}`;
}
