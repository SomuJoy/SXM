import { Injectable } from '@angular/core';
import { newTransactionIdDueToCreditCardError } from '@de-care/de-care-use-cases/checkout/state-common';
import { ChangeSubscriptionWorkflowService, ChangeSubscriptionWorkflowServiceError } from '@de-care/domains/purchase/state-change-subscription';
import { CreditCardUnexpectedError } from '@de-care/shared/de-microservices-common';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable, throwError } from 'rxjs';
import { catchError, concatMap, mapTo, take } from 'rxjs/operators';
import { getPayloadForPurchaseTransaction } from '../state/selectors';

export type SubmitSatelliteChangeToTransactionWorkflowServiceErrors = 'CREDIT_CARD_FAILURE' | 'PASSWORD_POLICY_FAILURE' | 'SYSTEM';

@Injectable({ providedIn: 'root' })
export class SubmitSatelliteChangeToTransactionWorkflowService implements DataWorkflow<void, boolean> {
    private _translateService: TranslateService;
    constructor(private readonly _store: Store, private _changeSubscriptionWorkflowService: ChangeSubscriptionWorkflowService) {}
    build(): Observable<boolean> {
        return this._store.select(getPayloadForPurchaseTransaction).pipe(
            take(1),
            concatMap((request) =>
                this._changeSubscriptionWorkflowService.build({ ...request, languagePreference: this._translateService?.currentLang }).pipe(
                    mapTo(true),
                    catchError((error: ChangeSubscriptionWorkflowServiceError | CreditCardUnexpectedError) => {
                        if (error === 'CREDIT_CARD_FAILURE' || error instanceof CreditCardUnexpectedError) {
                            this._store.dispatch(newTransactionIdDueToCreditCardError());
                            return throwError('CREDIT_CARD_FAILURE');
                        }
                        return throwError('SYSTEM');
                    })
                )
            )
        );
    }
}
