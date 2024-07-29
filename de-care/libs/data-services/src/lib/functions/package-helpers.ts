import { PackagePlatformEnum } from '../enums/package.enum';
import { PackageModel } from '../models/offer.model';
import { LISTEN_ON_DATA, ListenOn } from '../configs/listen-on.constant';
import { isOfferMCP } from './offer-helpers';

/**
 * @deprecated Use getPlatformFromPackageName from @de-care/domains/offers/state-offers instead
 */
export function getPlatformFromPackageName(packageName: string): PackagePlatformEnum {
    if (packageName.startsWith('1_')) {
        return PackagePlatformEnum.Xm;
    } else if (packageName.startsWith('SXM_') || packageName.startsWith('3_') || packageName.startsWith('SiriusXM')) {
        return PackagePlatformEnum.Siriusxm;
    } else {
        return PackagePlatformEnum.Sirius;
    }
}

export function getPlatformFromName(platformName: string): PackagePlatformEnum | null {
    if (typeof platformName !== 'string') {
        return null;
    }
    switch (platformName.toLowerCase().trim()) {
        case 'xm':
            return PackagePlatformEnum.Xm;
        case 'sxm':
            return PackagePlatformEnum.Siriusxm;
        case 'sirius':
            return PackagePlatformEnum.Sirius;
        default:
            return null;
    }
}

export function changePackageNameForPlatform(packageName: string, newPlatform: PackagePlatformEnum): string {
    // replace prefix
    const normalizedPackageName = packageName.replace(/^(1_|SXM_|3_)/, '');
    // append new prefix
    let newPrefix: string;
    switch (newPlatform) {
        case PackagePlatformEnum.Xm:
            newPrefix = '1_';
            break;
        case PackagePlatformEnum.Siriusxm:
            newPrefix = 'SXM_';
            break;
        default:
            newPrefix = '';
            break;
    }
    return `${newPrefix}${normalizedPackageName}`;
}

export function packagesAreOnDifferentPlatforms(packageName1: string, packageName2: string): boolean {
    return getPlatformFromPackageName(packageName1) !== getPlatformFromPackageName(packageName2);
}

export function packagePlatformIsSirius(packageName: string): boolean {
    return getPlatformFromPackageName(packageName) === PackagePlatformEnum.Sirius;
}

/**
 * @deprecated Use packageTypeIsSelect from @de-care/domains/offers/state-offers instead
 */
export function packageTypeIsSelect(packageName: string): boolean {
    return packageName.endsWith('SIR_AUD_EVT') || packageName.endsWith('SIR_CAN_EVT');
}

export function calcSavingsPercent(offerPackage: PackageModel): number {
    const offerPrice = offerPackage.price || 0;
    const retailPrice = offerPackage.retailPrice || 0;
    const termLength = offerPackage.termLength || 0;
    const isMCP = isOfferMCP(offerPackage.type);
    return isMCP ? Math.floor(100 - (offerPrice / retailPrice) * 100) : Math.floor(100 - (offerPrice / (retailPrice * termLength)) * 100);
}

// The packageNames often contain AUD or CAN to indicate the related country - We trim these from the incoming packagename to normalize the package
// and reduce the number of possible packages to track and evaluate in the LISTEN_ON_DATA
// TODO: Gscheidle: Consider further normalizing to remove platform and reduce size and complexity of LISTEN_ON_DATA
export function getNormalizedPackageName(packageName: string): string {
    return packageName.replace(/(_AUD_|_CAN_)/, '_');
}

export function mapPackageNameToListenOn(packageName: string): ListenOn {
    return LISTEN_ON_DATA[getNormalizedPackageName(packageName)] || <ListenOn>{ insideTheCar: false, outsideTheCar: false, pandoraStations: false };
}

export function isChoicePackage(packageName: string): boolean {
    const usChoicePkgWildCard = 'SIR_AUD_CHOICE';
    const caChoicePkgWildCard = 'SIR_CAN_CHOICE';
    const caStreamingChoicePkgWildCard = 'SIR_CAN_IP_CHOICE';
    const usStreamingChoicePkgWildCard = 'SIR_AUD_IP_CHOICE';

    if (
        packageName?.indexOf(usChoicePkgWildCard) !== -1 ||
        packageName?.indexOf(caChoicePkgWildCard) !== -1 ||
        packageName?.indexOf(caStreamingChoicePkgWildCard) !== -1 ||
        packageName?.indexOf(usStreamingChoicePkgWildCard) !== -1
    ) {
        return true;
    }
    return false;
}

export function isMostlyMusicPackage(packageName: string): boolean {
    const mostlyMusicSuffix = '_MM';

    if (packageName?.endsWith(mostlyMusicSuffix)) {
        return true;
    }
    return false;
}

export function isAllAccessPackage(packageName: string): boolean {
    return packageName?.endsWith('ALLACCESS');
}

export function isAllAccessFamilyFriendlyPackage(packageName: string): boolean {
    return packageName?.endsWith('ALLACCESS_FF');
}

export function isSelectFamilyFriendlyPackage(packageName: string): boolean {
    return packageName?.endsWith('SIR_AUD_FF') || packageName.endsWith('SIR_CAN_FF');
}

export function isSelectPackage(packageName: string): boolean {
    return packageName?.endsWith('SIR_AUD_EVT') || packageName?.endsWith('SIR_CAN_EVT');
}
