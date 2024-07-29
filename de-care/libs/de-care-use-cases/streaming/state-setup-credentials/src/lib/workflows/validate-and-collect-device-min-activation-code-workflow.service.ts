import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable, of } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { catchError, concatMap, map, take } from 'rxjs/operators';
import { ValidateDeviceActivationCodeWorkflowService } from '@de-care/domains/device/state-device-register';
import { selectDeviceActivationCode } from '../state/selectors';

@Injectable({ providedIn: 'root' })
export class ValidateAndCollectDeviceMinActivationCodeWorkflowService implements DataWorkflow<string, boolean> {
    constructor(private readonly _store: Store, private readonly _validateDeviceActivationCodeWorkflowService: ValidateDeviceActivationCodeWorkflowService) {}

    build(): Observable<any> {
        return this._store.pipe(
            select(selectDeviceActivationCode),
            take(1),
            concatMap((activationCode) => {
                return !activationCode
                    ? of(false)
                    : this._validateDeviceActivationCodeWorkflowService.build({ activationCode }).pipe(
                          map((result) => {
                              return result;
                          }),
                          catchError(() => {
                              return of(false);
                          })
                      );
            })
        );
    }
}
