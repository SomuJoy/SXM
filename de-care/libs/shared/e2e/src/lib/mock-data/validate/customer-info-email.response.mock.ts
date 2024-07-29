export const mockResponseCustomerInfoEmailSuccess = {
    status: 'SUCCESS',
    httpStatusCode: 200,
    httpStatus: 'OK',
    data: {
        valid: true,
        emailValidation: { verificationStatus: 'VALID', verificationMessage: '', suggestedEmail: '', valid: true },
        usernameValidation: { valid: true },
        billingAddressValidation: null,
        serviceAddressValidation: null,
        ccValidation: null
    }
};
