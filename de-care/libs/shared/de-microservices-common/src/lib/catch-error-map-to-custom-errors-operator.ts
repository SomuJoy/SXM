import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { isSessionTimeoutError } from './http-error-type-helpers';
import { SessionTimeoutHttpError } from './session-timeout-http-error';

export function catchErrorMapToCustomErrors() {
    return obs =>
        obs.pipe(
            catchError(error => {
                if (isSessionTimeoutError(error)) {
                    return throwError(new SessionTimeoutHttpError(error));
                } else {
                    return throwError(error);
                }
            })
        );
}
