export const mockResponseCustomerInfoAddressCCAdressNotFound = {
    status: 'SUCCESS',
    httpStatusCode: 200,
    httpStatus: 'OK',
    data: {
        valid: true,
        emailValidation: null,
        usernameValidation: null,
        billingAddressValidation: {
            confidenceLevel: 'None',
            correctedAddress: [{ addressLine1: ' ', addressLine2: ' ', city: ' ', state: ' ', zip: ' ' }],
            resultCode: 'SUCCESS',
            validationStatus: 'NOT_VALID'
        },
        serviceAddressValidation: {
            confidenceLevel: 'None',
            correctedAddress: [{ addressLine1: ' ', addressLine2: ' ', city: ' ', state: ' ', zip: ' ' }],
            resultCode: 'SUCCESS',
            validationStatus: 'NOT_VALID'
        },
        ccValidation: { valid: true }
    }
};
