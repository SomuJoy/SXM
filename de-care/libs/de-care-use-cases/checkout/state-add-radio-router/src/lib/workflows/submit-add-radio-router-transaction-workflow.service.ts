import { Injectable } from '@angular/core';
import { clearPaymentInfo, newTransactionIdDueToCreditCardError } from '@de-care/de-care-use-cases/checkout/state-common';
import { disablePageLoaderOnRouteEvent } from '@de-care/de-care/shared/state-loading';
import { AddSubscriptionWorkflowService, AddSubscriptionWorkflowServiceError } from '@de-care/domains/purchase/state-add-subscription';
import { CreditCardUnexpectedError } from '@de-care/shared/de-microservices-common';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable, throwError } from 'rxjs';
import { catchError, concatMap, map, mapTo, take, tap } from 'rxjs/operators';
import { setSuccessfulTransactionData } from '../state/actions';
import { getPayloadForPurchaseTransaction } from '../state/selectors';

export type SubmitAddRadioRouterTransactionWorkflowServiceErrors = 'CREDIT_CARD_FAILURE' | 'PASSWORD_POLICY_FAILURE' | 'SYSTEM';
@Injectable({ providedIn: 'root' })
export class SubmitAddRadioRouterTransactionWorkflowService implements DataWorkflow<void, boolean> {
    private _translateService: TranslateService;
    constructor(private readonly _store: Store, private readonly _addSubscriptionWorkflowService: AddSubscriptionWorkflowService) {}
    build(): Observable<boolean> {
        return this._store.select(getPayloadForPurchaseTransaction).pipe(
            take(1),
            concatMap((request) => this._addSubscriptionWorkflowService.build({ ...request, languagePreference: this._translateService?.currentLang })),
            map(({ email, accountNumber, subscriptionId, isUserNameSameAsEmail, isEligibleForRegistration, isOfferStreamingEligible }) => ({
                email,
                subscriptionId,
                accountNumber,
                isUserNameSameAsEmail,
                isEligibleForRegistration,
                isOfferStreamingEligible,
            })),
            tap((transactionData) => {
                this._store.dispatch(clearPaymentInfo());
                this._store.dispatch(setSuccessfulTransactionData({ transactionData }));
                this._store.dispatch(disablePageLoaderOnRouteEvent());
            }),
            mapTo(true),
            catchError((error: AddSubscriptionWorkflowServiceError | CreditCardUnexpectedError) => {
                if (error === 'CREDIT_CARD_FAILURE' || error instanceof CreditCardUnexpectedError) {
                    this._store.dispatch(newTransactionIdDueToCreditCardError());
                    return throwError('CREDIT_CARD_FAILURE' as SubmitAddRadioRouterTransactionWorkflowServiceErrors);
                }
                return throwError('SYSTEM' as SubmitAddRadioRouterTransactionWorkflowServiceErrors);
            })
        );
    }
}
