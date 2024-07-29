import { HttpErrorResponse } from '@angular/common/http';

const ERROR_PROP_KEYS = {
    SESSION_TIMEOUT: 'error.common.session.timed.out.error',
};

export function isSessionTimeoutError(error: HttpErrorResponse): boolean {
    if (error.error && error.error.error) {
        const orgErrorObj = error.error.error;
        if (orgErrorObj.errorPropKey && orgErrorObj.errorPropKey === ERROR_PROP_KEYS.SESSION_TIMEOUT) {
            return true;
        }
    }
    return false;
}
