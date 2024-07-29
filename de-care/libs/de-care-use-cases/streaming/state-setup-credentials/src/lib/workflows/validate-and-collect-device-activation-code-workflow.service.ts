import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { tap } from 'rxjs/operators';
import { collectDeviceActivationCode, setDeviceActivationInProgress } from '../state/actions';
import { ValidateDeviceActivationCodeWorkflowService } from '@de-care/domains/device/state-device-register';

@Injectable({ providedIn: 'root' })
export class ValidateAndCollectDeviceActivationCodeWorkflowService implements DataWorkflow<string, boolean> {
    constructor(private readonly _store: Store, private readonly _validateDeviceActivationCodeWorkflowService: ValidateDeviceActivationCodeWorkflowService) {}

    build(activationCode: string): Observable<boolean> {
        return this._validateDeviceActivationCodeWorkflowService.build({ activationCode }).pipe(
            tap(() => {
                this._store.dispatch(collectDeviceActivationCode({ activationCode }));
                this._store.dispatch(setDeviceActivationInProgress());
            })
        );
    }
}
