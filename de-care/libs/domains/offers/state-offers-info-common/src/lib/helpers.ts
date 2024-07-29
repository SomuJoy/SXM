export function normalizeLangToLocale(locale: string): string {
    return locale?.replace('-', '_');
}

/*
 * Used to remove province suffix from locale string
 * Example: en_CA_QC
 */
export function normalizeLocaleToLanguageAndCountryOnly(locale: string): string {
    const pieces = locale.split('_');
    return pieces.length === 2 ? locale : `${pieces[0]}_${pieces[1]}`;
}

export function normalizeLangToLocaleForServiceCall(locale: string, countryCode: string, province: string | undefined): string {
    const normalizedLocale = normalizeLangToLocale(locale);
    if (countryCode.toLowerCase() === 'ca' && province) {
        return convertLocaleToProvinceSpecific(province, normalizedLocale);
    }
    return normalizedLocale;
}

function convertLocaleToProvinceSpecific(province: string | undefined, locale: string): string {
    // NOTE: for now we are only appending province if it is Quebec, but ideally we would always append province and
    //       let the underlying CMS endpoint that Microservice calls handle falling back if there is no config for a province
    return province && ['qc'].includes(province.toLowerCase()) ? `${locale}_${province.toUpperCase()}` : locale;
}
