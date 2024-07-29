export function createEntityCompositeKey(planCode: string, locale: string): string {
    return `${planCode} | ${locale}`;
}

export function getPlanCodeFromCompositeKey(key: string): string {
    return key.split(' | ')[0];
}

export function normalizeLangToLocale(locale: string): string {
    return locale?.replace('-', '_');
}

const dealSeparator = '<!--separator-->';
export function getDealDescriptionSplitShown(description: string) {
    return description.indexOf(dealSeparator) === -1 ? '' : description.split(dealSeparator)[0];
}
export function getDealDescriptionSplitHidden(description: string) {
    return description.indexOf(dealSeparator) === -1 ? description : description.split(dealSeparator)[1];
}
