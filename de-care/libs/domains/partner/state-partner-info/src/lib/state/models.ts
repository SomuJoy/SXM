import { EntityState } from '@ngrx/entity';

export interface PartnerDetails {
    name: string;
    imageURL?: string;
    imageAlt?: string;
    link?: string;
}

// [TODO] Represent the translations in a consistent way across the app
export interface PartnerInfo {
    corpId: number;
    partnerInfo: {
        'en-US': PartnerDetails;
        'en-CA': PartnerDetails;
        'fr-CA': PartnerDetails;
    };
}

export interface PartnerInfoConfig {
    fallbackCorpId: number;
    partnerInfo: PartnerInfo[];
}

export interface PartnerInfoState extends EntityState<PartnerInfo> {
    fallbackCorpId: number | null;
    isInitialized: boolean;
}
