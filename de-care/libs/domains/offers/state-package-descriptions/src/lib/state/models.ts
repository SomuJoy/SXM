export type locales = 'en-US' | 'en-CA' | 'fr-CA';

export interface PackageDescriptionModel {
    locale: locales;
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
    upgradeInfo?: {
        monthly: {
            header: string;
            description: string[];
        };
        annual: {
            header: string;
            description: string[];
        };
        name?: string;
    };
    packageDiff?: {
        packageName: string;
        excludedChannels?: {
            descriptions: string[];
        }[];
        additionalChannels?: {
            descriptions: string[];
        }[];
    }[];
}

interface ChannelModel {
    title: string;
    descriptions: Array<string>;
    count: string;
}

interface PackageOverride {
    name: string;
    type: string;
    promoFooter: string;
}
