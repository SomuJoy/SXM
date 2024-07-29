import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { SessionTimedOut } from '@de-care/shared/browser-common/state-session-tracker';
import { behaviorEventErrorFromAppCode, behaviorEventErrorFromHttpCall } from '@de-care/shared/state-behavior-events';
import { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';

@Injectable({ providedIn: 'root' })
export class GenericErrorHandler {
    constructor(private _store: Store, private _router: Router) {}

    handleError(error: Error | HttpErrorResponse, commonErrors: boolean = true): void {
        if (error instanceof HttpErrorResponse) {
            this._store.dispatch(behaviorEventErrorFromHttpCall({ error }));
            const sessionTimeOut = this.isSessionTimeoutError(error);
            if (sessionTimeOut) {
                this._store.dispatch(new SessionTimedOut());
            }
            if (commonErrors && !sessionTimeOut) {
                if (this.is404Error(error)) {
                    this._router.navigate(['/error']);
                } else if (this.isUnrecoverableError(error)) {
                    // Failover
                    this._router.navigate(['/error']);
                }
            }
        } else if (error instanceof Error) {
            this._store.dispatch(behaviorEventErrorFromAppCode({ error }));
            //ToDo: Use modal/pop-up to show the message.
            this._store.dispatch(pageDataFinishedLoading());
            this._router.navigate(['/error']);
        }
    }

    private isSessionTimeoutError(error: HttpErrorResponse): boolean {
        if (error.error && error.error.error) {
            const orgErrorObj: { errorPropKey: string } = error.error.error;
            if (orgErrorObj.errorPropKey && orgErrorObj.errorPropKey === 'error.common.session.timed.out.error') {
                return true;
            }
        }
        return false;
    }

    private isUnrecoverableError(error: HttpErrorResponse): boolean {
        if (error.status === 500) {
            return true;
        } else if (error.status === 0 && error.statusText === 'Unknown Error') {
            return true;
        }
        return false;
    }

    private is404Error(error: HttpErrorResponse): boolean {
        if (error.status === 404) {
            return true;
        }
        return false;
    }
}
