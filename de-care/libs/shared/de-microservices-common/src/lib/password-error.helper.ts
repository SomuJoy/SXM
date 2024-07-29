const passwordPolicyFailurePropKeys = Object.freeze(['error.purchase.service.invalid.password']);
const passwordHasPiiDataErrorPropKeys = Object.freeze(['error.purchase.service.password.has.pii.data']);

export function isPasswordPolicyError(status: number, errorPropKey: string): boolean {
    return (status === 400 || status === 500) && passwordPolicyFailurePropKeys.indexOf(errorPropKey) > -1;
}

export function isPasswordHasPiiDataError(status: number, errorPropKey: string): boolean {
    return (status === 400 || status === 500) && passwordHasPiiDataErrorPropKeys.indexOf(errorPropKey) > -1;
}
