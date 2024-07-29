export interface ModifySubscriptionOptions {
    options: Option;
}
export interface Option {
    options: options[];
    cancelSubscriptionOptionInfo: {
        showViewOffer: boolean;
        showTransferRadio: boolean;
        showCancelOnline: boolean;
        showCancelViaChat: boolean;
        triggeredRuleId: string | number;
    };
}
export type options = 'CHANGE_PLAN' | 'CHANGE_TERM' | 'REFRESH_RADIO' | 'DOWNLOAD_MANUAL' | 'REPLACE_RADIO' | 'TRANSFER_SUBSCRIPTION' | 'CANCEL_SUBSCRIPTION';

export interface ContactPreferences {
    encryptedXmlPayload: string;
    generatedUrl: string;
}
