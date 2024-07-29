export const defaultVerificationMethods = {
    phone: { eligible: false, verified: false },
    radioId: { eligible: false, verified: false },
    accountNumber: { eligible: false, verified: false }
};

export enum VerificationOptionsCallResult {
    success = 'success',
    fail = 'fail'
}

export enum VerificationOptionsCallFailReason {
    nonPiiFail = 'nonPiiFail',
    verifyOptionsFail = 'verifyOptionsFail'
}
