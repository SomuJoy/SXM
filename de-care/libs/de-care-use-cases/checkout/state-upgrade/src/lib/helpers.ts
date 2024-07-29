export type ElegibilityError = 'DEFAULT' | 'REDEEMED' | 'EXPIRED' | 'serverError';

export function handleEligibilityError(response): ElegibilityError {
    const fieldError = response?.error?.error?.fieldErrors ? response?.error?.error?.fieldErrors[0] : response?.error?.error;
    if (fieldError?.fieldName === 'radioId') {
        return 'DEFAULT';
    }
    switch (fieldError?.errorCode) {
        case 'ALREADY_REDEEMED':
            return 'REDEEMED';

        case 'EXPIRED':
            return 'EXPIRED';

        default:
            return 'serverError';
    }
}
