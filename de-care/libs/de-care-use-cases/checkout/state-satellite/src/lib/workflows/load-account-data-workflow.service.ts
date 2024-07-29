import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoadPurchaseDataFromAccountInfoWorkflowService } from './load-purchase-data-from-account-info-workflow.service';
import { LoadPurchaseDataFromTokenWorkflowService } from './load-purchase-data-from-token-workflow.service';

export type LoadAccountDataWorkflowErrors = 'ACCOUNT_NOT_FOUND' | 'INVALID_DEVICE';

interface LoadAccountDataWorkflowRequest {
    token: string;
    accountNumber: string;
    radioId: string;
    lastName: string;
    tokenType: string;
}

@Injectable({ providedIn: 'root' })
export class LoadAccountDataWorkflowService implements DataWorkflow<LoadAccountDataWorkflowRequest, boolean> {
    constructor(
        private readonly _loadPurchaseDataFromTokenWorkflowService: LoadPurchaseDataFromTokenWorkflowService,
        private readonly _loadPurchaseDataFromAccountInfoWorkflowService: LoadPurchaseDataFromAccountInfoWorkflowService
    ) {}

    build({ token, accountNumber, radioId, lastName, tokenType }) {
        const obs$ =
            token && (tokenType === 'SALES_AUDIO' || !radioId)
                ? this._loadPurchaseDataFromTokenWorkflowService.build({ token, tokenType })
                : this._loadPurchaseDataFromAccountInfoWorkflowService.build({ accountNumber, ...(radioId && { radioId }), ...(lastName && { lastName }) });

        return obs$.pipe(
            catchError((e) => {
                if (e instanceof HttpErrorResponse && (e.status === 400 || e.status === 404)) {
                    return throwError('ACCOUNT_NOT_FOUND' as LoadAccountDataWorkflowErrors);
                }
                if (e?.fieldErrors?.some((i) => ['ACCOUNT_NUMBER_MISMATCH', 'INVALID_INPUT'].includes(i.errorCode))) {
                    return throwError('ACCOUNT_NOT_FOUND' as LoadAccountDataWorkflowErrors);
                }
                return throwError(e);
            })
        );
    }
}
