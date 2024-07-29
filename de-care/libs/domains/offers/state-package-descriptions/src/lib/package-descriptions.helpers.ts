import { PackageTranslations, ExcludedChannels } from './package-descriptions.interface';

export function getDiffExcludedChannels(packageTranslations: PackageTranslations, packaNameToLookup: string): ExcludedChannels[] {
    const packageDiff = packageTranslations ? packageTranslations.packageDiff : null;
    const foundDiff = packageDiff && packageDiff.find(diff => diff.packageName === packaNameToLookup);
    return foundDiff && foundDiff.excludedChannels ? foundDiff.excludedChannels : null;
}
