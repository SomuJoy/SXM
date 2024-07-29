import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { tap, take, concatMap } from 'rxjs/operators';
import { setDeviceActivationCompleted } from '../state/actions';
import { selectDeviceActivationCode } from '../state/selectors';
import { RegisterDeviceViaActivationCodeAndCredentialsWorkflowService } from '@de-care/domains/device/state-device-register';

@Injectable({ providedIn: 'root' })
export class SignInAndActivateDeviceWorkflowService implements DataWorkflow<{ username: string; password: string }, boolean> {
    constructor(
        private readonly _store: Store,
        private readonly _registerDeviceViaActivationCodeAndCredentialsWorkflowService: RegisterDeviceViaActivationCodeAndCredentialsWorkflowService
    ) {}

    build(request: { username: string; password: string }): Observable<boolean> {
        return this._store.select(selectDeviceActivationCode).pipe(
            take(1),
            concatMap((activationCode) => this._registerDeviceViaActivationCodeAndCredentialsWorkflowService.build({ activationCode, ...request })),
            tap(() => {
                this._store.dispatch(setDeviceActivationCompleted());
            })
        );
    }
}
