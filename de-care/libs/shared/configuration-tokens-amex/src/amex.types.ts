export type AmexSdkMode = 'qa' | 'production' | 'development';

export type AmexStaticParams = {
    mode: AmexSdkMode;
    merchantApiKey: string;
    authRedirectUrl: string;
};

export type AmexSdkInitConfig = {
    campaignUuid: string;
    shouldStripUrl?: boolean;
} & Omit<AmexStaticParams, 'authRedirectUrl'>;

export type AmexSdkOfferRedeemedParams = {
    order_cost: string;
    currency: string;
    payment_type: string;
    metadata?: Record<string, any>;
};

export type AmexSdk = {
    init: (config: AmexSdkInitConfig) => void;
    validateUser(): Promise<Record<string, any> | undefined>;
    offerRedeemed(params: AmexSdkOfferRedeemedParams): Promise<Record<string, any> | Error>;
    getCampaignUuid(): string;
};
