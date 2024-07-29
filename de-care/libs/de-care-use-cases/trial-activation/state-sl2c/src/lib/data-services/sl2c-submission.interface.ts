export interface Sl2cSubmissionRequestInterfaceBaseProps {
    corpId: string;
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    serviceAddress: {
        streetAddress: string;
        city: string;
        state: string;
        postalCode: string;
    };
    serviceLanePartner: boolean;
}

export interface Sl2cSubmissionRadioIdRequestInterface extends Sl2cSubmissionRequestInterfaceBaseProps {
    radioId: string;
}

export interface Sl2cSubmissionVinRequestInterface extends Sl2cSubmissionRequestInterfaceBaseProps {
    vin: string;
}

export type Sl2cSubmissionRequestInterface = Sl2cSubmissionRadioIdRequestInterface | Sl2cSubmissionVinRequestInterface;

export interface Sl2cSubmissionResponseInterface {
    email: string;
    status: string;
    radioId: string;
    subscriptionId: string;
    accountNumber?: string;
    isEligibleForRegistration: boolean;
    isOfferStreamingEligible: boolean;
    isUserNameSameAsEmail: boolean;
}
