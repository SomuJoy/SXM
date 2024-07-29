export interface ExcludedChannels {
    descriptions: string[];
}

export interface PackageDiff {
    packageName: string;
    excludedChannels: ExcludedChannels[];
}

export interface PackageTranslations {
    packageDiff: PackageDiff[];
}

export interface PackageDescriptionModel {
    name: string;
    company: string;
    packageName: string;
    channelLineUpURL?: string;
    header: string;
    footer: string;
    promoFooter: string;
    description: string;
    channels: Array<ChannelModel>;
    packageOverride: PackageOverride[];
}

export interface ChannelModel {
    title: string;
    descriptions: Array<string>;
    count: string;
}

export interface PackageOverride {
    name: string;
    type: string;
    promoFooter: string;
}

export interface PackageDescriptionsObject {
    [packageName: string]: PackageDescriptionModel;
}
