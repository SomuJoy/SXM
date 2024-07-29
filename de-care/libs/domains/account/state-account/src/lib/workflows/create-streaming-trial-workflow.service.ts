import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable, throwError } from 'rxjs';
import { DataCreateStreamingTrialService } from '../data-services/data-create-streaming-trial.service';
import { catchError, mapTo, tap } from 'rxjs/operators';
interface CreateStreamingTrialWorkflowRequest {
    email: string;
    promoCode: string;
}

export type CreateStreamingTrialWorkflowErrors =
    | 'SYSTEM'
    | 'INVALID_EMAIL'
    | 'EXISTING_ACCOUNT'
    | 'INVALID_USERNAME_OR_PASSWORD'
    | 'INVALID_ZIP_CODE'
    | 'INVALID_PHONE_NUMBER'
    | 'PROSPECT_ACCOUNT_INVALID_PROMO_CODE'
    | 'INELIGIBLE';

@Injectable({ providedIn: 'root' })
export class CreateStreamingTrialWorkflowService implements DataWorkflow<CreateStreamingTrialWorkflowRequest, boolean> {
    constructor(private readonly _dataCreateStreamingTrialService: DataCreateStreamingTrialService) {}

    build(request: CreateStreamingTrialWorkflowRequest): Observable<boolean> {
        return this._dataCreateStreamingTrialService.createTrial(request).pipe(
            tap(() => {
                // TODO: Add any behavior tracking needed here
            }),
            mapTo(true),
            catchError((error) => {
                let errorType: CreateStreamingTrialWorkflowErrors = 'SYSTEM';
                if (error.errorCode === 'PROSPECT_ACCOUNT_INVALID_EMAIL') {
                    errorType = 'INVALID_EMAIL';
                } else if (error.errorCode === 'PROSPECT_ACCOUNT_EXPIRED' || error.errorCode === 'PROSPECT_ACCOUNT_INACTIVE') {
                    errorType = 'INELIGIBLE';
                } else if (error.errorCode === 'PROSPECT_ACCOUNT_EXISTS' || error.errorCode === 'PROSPECT_ACCOUNT_CLOSED') {
                    errorType = 'EXISTING_ACCOUNT';
                } else if (error.errorCode === 'PROSPECT_ACCOUNT_INVALID_USERNAME_OR_PASSWORD') {
                    errorType = 'INVALID_USERNAME_OR_PASSWORD';
                } else if (error.errorCode === 'PROSPECT_ACCOUNT_INVALID_ZIP_CODE') {
                    errorType = 'INVALID_ZIP_CODE';
                } else if (error.errorCode === 'PROSPECT_ACCOUNT_INVALID_PHONE_NUMBER') {
                    errorType = 'INVALID_PHONE_NUMBER';
                } else if (errorType === 'SYSTEM' || 'PROSPECT_ACCOUNT_INVALID_PROMO_CODE') {
                    errorType = 'SYSTEM';
                }
                return throwError(errorType);
            })
        );
    }
}
