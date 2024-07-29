import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { select, Store } from '@ngrx/store';
import { Observable, of, throwError } from 'rxjs';
import { catchError, concatMap, take, withLatestFrom } from 'rxjs/operators';
import { selectInboundQueryParamsFreeListenCampaignId } from '../state/selectors';
import { CreateStreamingTrialWorkflowService } from '@de-care/domains/account/state-account';
import { CustomerEmailAsUsernameValidationWorkflowErrors, CustomerEmailAsUsernameValidationWorkflowService } from '@de-care/domains/customer/state-customer-verification';
import { getIsCanadaMode } from '@de-care/shared/state-settings';

export type FindAccountByEmailForFreeListenWorkflowErrors =
    | 'INELIGIBLE'
    | 'EXISTING_ACCOUNT'
    | 'INVALID_USERNAME_OR_PASSWORD'
    | 'INVALID_ZIP_CODE'
    | 'INVALID_PHONE_NUMBER'
    | 'INVALID_EMAIL'
    | 'SYSTEM';

@Injectable({ providedIn: 'root' })
export class FindAccountByEmailForFreeListenWorkflowService implements DataWorkflow<string, boolean> {
    constructor(
        private readonly _store: Store,
        private readonly _createStreamingTrialWorkflowService: CreateStreamingTrialWorkflowService,
        private readonly _customerEmailAsUsernameValidationWorkflowService: CustomerEmailAsUsernameValidationWorkflowService
    ) {}

    build(email: string): Observable<boolean> {
        const emailValidate$ = this._customerEmailAsUsernameValidationWorkflowService.build({ email: email, isForStreaming: true, reuseUsername: true }).pipe(
            catchError((error: CustomerEmailAsUsernameValidationWorkflowErrors) => {
                switch (error) {
                    case 'EMAIL_INVALID': {
                        throw 'INVALID_EMAIL' as FindAccountByEmailForFreeListenWorkflowErrors;
                    }
                    default: {
                        throw 'SYSTEM' as FindAccountByEmailForFreeListenWorkflowErrors;
                    }
                }
            })
        );

        return emailValidate$.pipe(
            withLatestFrom(this._store.pipe(select(getIsCanadaMode)), this._store.pipe(select(selectInboundQueryParamsFreeListenCampaignId))),
            concatMap(([, isCanada, promoCode]) => {
                return isCanada ? of(false) : this._createStreamingTrialWorkflowService.build({ email, promoCode });
            }),
            catchError((error: FindAccountByEmailForFreeListenWorkflowErrors) => {
                // TODO: add error type mapping here to return type of ActivateFreeListenByEmailWorkflowErrors
                return throwError(error);
            })
        );
    }
}
