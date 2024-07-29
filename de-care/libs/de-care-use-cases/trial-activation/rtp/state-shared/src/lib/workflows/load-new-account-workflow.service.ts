import { Injectable } from '@angular/core';
import { getLoadNewAccountRequestData, hasSuccessfulTransactionData } from '../state/selectors';
import { LoadAccountFromAccountDataWorkflow, WorkflowRequest } from '@de-care/domains/account/state-account';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { ValidateDeviceWorkflowService } from '@de-care/domains/device/state-device-validate';
import { select, Store } from '@ngrx/store';
import { catchError, concatMap, map, take, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';

export const enum LoadNewAccountWorkflowServiceStatus {
    success = 'success',
    fail = 'fail'
}

@Injectable({ providedIn: 'root' })
export class LoadNewAccountWorkflowService implements DataWorkflow<WorkflowRequest, LoadNewAccountWorkflowServiceStatus> {
    constructor(
        private readonly _loadAccountFromAccountDataWorkflow: LoadAccountFromAccountDataWorkflow,
        private readonly _validateDeviceWorkflowService: ValidateDeviceWorkflowService,
        private readonly _store: Store
    ) {}

    build() {
        return this._store.pipe(
            select(hasSuccessfulTransactionData),
            withLatestFrom(this._store.pipe(select(getLoadNewAccountRequestData))),
            take(1),
            concatMap(([dataAvailable, requestData]) => {
                if (dataAvailable) {
                    return this._validateDeviceWorkflowService.build({ radioId: requestData.radioId }).pipe(
                        concatMap(() =>
                            this._loadAccountFromAccountDataWorkflow.build({
                                accountNumber: requestData.accountNumber,
                                radioId: requestData.radioId,
                                pvtTime: requestData.pvtTime
                            })
                        ),
                        catchError(error => of(false))
                    );
                }
                return of(false);
            }),
            map(result => (result ? LoadNewAccountWorkflowServiceStatus.success : LoadNewAccountWorkflowServiceStatus.fail)),
            catchError(() => of(LoadNewAccountWorkflowServiceStatus.fail))
        );
    }
}
