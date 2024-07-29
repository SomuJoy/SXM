export interface UsedCarTrialRequest {
    firstName?: string;
    lastName?: string;
    radioIdOrVIN: string;
    zipCode?: string;
    optInForNFL?: boolean;
}

export type UsedCarTrialResponseStatusType = 'SUCCESS' | 'FAILURE';

export interface UsedCarTrialResponse {
    errorCode: string;
    usedCarBrandingType: string;
    last4DigitsOfRadioId?: string;
    status: UsedCarTrialResponseStatusType;
    devicePromoCode?: string;
    offerTypeForProgramCode: string;
}
