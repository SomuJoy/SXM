import { PackageDescriptionLocales, PackageDescriptionModel } from '../data-services/data-package-descriptions.service';
import { locales } from './models';
import { TranslateService } from '@ngx-translate/core';

export function normalizeLocaleToLangForEndpoint(locale: locales): PackageDescriptionLocales {
    switch (locale) {
        case 'en-US':
            return 'en_US';
        case 'en-CA':
            return 'en_CA';
        case 'fr-CA':
            return 'fr_CA';
    }
}

export function createEntityCompositeKey(packageNameId: string, locale: locales): string {
    return `${packageNameId} | ${locale}`;
}

export function getPackageNameIdFromCompositeKey(key: string): string {
    return key.split(' | ')[0];
}

/**
 * @deprecated This is here until we can go through all the UI code and refactor it to get package description content from this
 *             state lib via selectors instead of from the translate service.
 */
export function loadPackageDescriptionsIntoTranslateService(packageDescriptions: PackageDescriptionModel[], translateService: TranslateService, locale: locales) {
    translateService.setTranslation(
        locale,
        {
            app: {
                packageDescriptions: packageDescriptions.reduce((obj, packageDescriptionModel) => {
                    obj[packageDescriptionModel.packageName] = packageDescriptionModel;
                    return obj;
                }, {}),
            },
        },
        true
    );
}

// This version of the function is slightly different than the version in the state-offers helper file (and the directive)
// This version will remove any platform from the name, not just the one connected to the plan.  This will work on those scenarios where the platform and the plan name don't match, like Streaming and Infotainment
export function getPackageNameWithoutAnyPlatform(value: string): string {
    if (!value || value.length === 0) {
        return value;
    }
    const platforms = ['sirius', 'xm', 'siriusxm'];
    const words = value.split(' ');
    const hasPlatform = words.findIndex((p: string) => platforms.some((platform) => p.toLowerCase() === platform));
    const hasPlatformFr = words.findIndex((p: string) => p.toLowerCase() === 'de');

    if (hasPlatform >= 0) {
        words.splice(hasPlatform, 1);
        if (hasPlatformFr >= 0) {
            words.splice(hasPlatformFr, 1);
        }
    }

    return words.join(' ');
}

export function isPlatinumVip(packageName: string): boolean {
    return packageName?.endsWith('AUD_VIP') || packageName?.endsWith('CAN_VIP');
}

// This function will first check for any overrides based on the array of types, if none are found then returns the package name
export function getPackageNameWithOverrideCheck(packageDescription, types: string[]) {
    const override = packageDescription?.packageOverride?.find((override) => types?.some((type) => override.type?.toLowerCase() === type.toLowerCase()));
    return override?.name ?? packageDescription?.name;
}
