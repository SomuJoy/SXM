export type OrganicVipElegibilityError = 'notFound' | 'needsLPZ' | 'alreadyHaveVIP' | 'notQualifiedForVIP' | 'serverError' | 'fallback';

export function handleOrganicVipEligibilityError(response): OrganicVipElegibilityError {
    const fieldError = response.error.error?.fieldErrors ? response.error.error?.fieldErrors[0] : response?.error?.error;
    if (fieldError.fieldName === 'radioId') {
        return 'notFound';
    }
    switch (fieldError.errorCode) {
        case 'ACCOUNT_NUMBER_MISMATCH':
            return 'needsLPZ';
        case 'SUBSCRIPTION_HAS_TRIAL_PLAN_WITH_NO_FOLLOW_ON':
        case 'SUBSCRIPTION_IS_CLOSED':
        case 'DATA_NOT_FOUND':
            return 'fallback';
        case 'SUBSCRIPTION_HAS_INELIGIBLE_PLAN':
            return 'notQualifiedForVIP';
        case 'SUBSCRIPTION_HAS_VIP_PLATINUM_PACKAGE':
            return 'alreadyHaveVIP';
        default:
            return 'serverError';
    }
}
