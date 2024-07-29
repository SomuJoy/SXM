export function createEntityCompositeKey(planCode: string, locale: string): string {
    return `${planCode} | ${locale}`;
}

export function getPlanCodeFromCompositeKey(key: string): string {
    return key.split(' | ')[0];
}

export function normalizeLocaleToLang(locale: string): string {
    return locale?.replace('_QC', '').replace('_', '-');
}
