export type Locale = 'en-US' | 'en-CA' | 'fr-CA';

type LocaleTranslationValues = {
    [key in Locale]: string;
};

export interface TranslationOverrides {
    [key: string]: LocaleTranslationValues;
}

export interface FlatTranslation {
    key: string;
    locale: Locale;
    translation: string;
}

export const joinOverride = (translationOverrides: TranslationOverrides) => (key: string): { key: string; localeTranslationValues: LocaleTranslationValues } => ({
    key,
    localeTranslationValues: translationOverrides[key]
});

export const filterEmptyOverrides = ({ localeTranslationValues }: { localeTranslationValues: LocaleTranslationValues }) => !!localeTranslationValues;

export const extractTranslation = ({ key, localeTranslationValues }: { key: string; localeTranslationValues: LocaleTranslationValues }) =>
    Object.keys(localeTranslationValues)
        .map((locale: Locale) => ({ locale, translation: localeTranslationValues[locale] }))
        .filter(({ translation }) => !!translation)
        .map(({ locale, translation }) => ({ key, locale, translation }));

export const buildTranslation = (module, component) => ({ key, translation }) => ({
    [module]: { [component]: { [key]: translation } }
});

export const buildAndJoinTranslation = (module, component) => ({ key, locale, translation }: { key: string; locale: Locale; translation: string }) => ({
    locale,
    translation: buildTranslation(module, component)({ key, translation })
});

export const initiateTranslationOverride = (translationOverrides: TranslationOverrides): FlatTranslation[][] =>
    Object.keys(translationOverrides)
        .map(joinOverride(translationOverrides))
        .filter(filterEmptyOverrides)
        .map(extractTranslation);

export const findComponentTranslationProperties = (translationOverrides: TranslationOverrides, translationKeys: string[]): TranslationOverrides =>
    Object.keys(translationOverrides)
        .filter(overrideKey => translationKeys.includes(overrideKey))
        .reduce((overrides, overrideKey) => ({ ...overrides, [overrideKey]: translationOverrides[overrideKey] }), {});
