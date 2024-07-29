import { Inject, Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable, of, throwError } from 'rxjs';
import { catchError, concatMap, map, mapTo, take, tap, withLatestFrom } from 'rxjs/operators';
import { getPayloadForNewAccountOrganicPurchaseTransaction } from '../state/selectors';
import { setSuccessfulTransactionData } from '../state/actions';
import { PasswordUnexpectedError } from '@de-care/shared/de-microservices-common';
import { LoadAccountFromAccountDataWorkflow } from '@de-care/domains/account/state-account';
import { clearUserEnteredPassword } from '@de-care/de-care-use-cases/checkout/state-common';
import { ActivateTrialAccountWithSubscriptionWorkflowService } from '@de-care/domains/subscriptions/state-trial-activation-new-account';
import { getPvtTime } from '@de-care/domains/utility/state-environment-info';
import { TranslateService } from '@ngx-translate/core';
import { CountrySettingsToken, COUNTRY_SETTINGS } from '@de-care/shared/configuration-tokens-locales';
import { SetSelectedProvinceAndLoadOffersWorkflowService } from './set-selected-province-and-load-offers-workflow.service';

export type SubmitPurchaseOrganicTransactionWorkflowErrors = 'CREDIT_CARD_FAILURE' | 'PASSWORD_POLICY_FAILURE' | 'SYSTEM';

export type SubmitPurchaseOrganicTransactionParams = {
    accountInfo: {
        firstName: string;
        lastName: string;
        phone: string;
        streetAddress: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
        avsvalidated: boolean;
    };
    updateOffer?: boolean;
};

@Injectable({ providedIn: 'root' })
export class SubmitNewAccountPurchaseOrganicTransactionWorkflowService implements DataWorkflow<SubmitPurchaseOrganicTransactionParams, boolean> {
    constructor(
        private readonly _store: Store,
        private readonly _activateTrialAccountWithSubscriptionWorkflowService: ActivateTrialAccountWithSubscriptionWorkflowService,
        private readonly _loadAccountFromAccountDataWorkflow: LoadAccountFromAccountDataWorkflow,
        private readonly _translateService: TranslateService,
        private readonly _setSelectedProvinceAndLoadOffersWorkflowService: SetSelectedProvinceAndLoadOffersWorkflowService
    ) {}

    build(params: SubmitPurchaseOrganicTransactionParams): Observable<boolean> {
        return this._store.select(getPayloadForNewAccountOrganicPurchaseTransaction).pipe(
            take(1),
            concatMap((request) => {
                if (params.updateOffer) {
                    return this._setSelectedProvinceAndLoadOffersWorkflowService.build({ provinceCode: params.accountInfo.state }).pipe(mapTo(request));
                }
                return of(request);
            }),
            concatMap((request) =>
                //TODO: We should store accountInfo in the state for using it in payment step
                this._activateTrialAccountWithSubscriptionWorkflowService.build({
                    ...{
                        ...request,
                        serviceAddress: {
                            ...request?.serviceAddress,
                            ...params?.accountInfo,
                        },
                        streamingInfo: {
                            ...request.streamingInfo,
                            firstName: params.accountInfo.firstName,
                            lastName: params.accountInfo.lastName,
                        },
                    },
                    languagePreference: this._translateService.currentLang,
                })
            ),
            map(({ subscriptionId, accountNumber, isUserNameSameAsEmail, isEligibleForRegistration, isOfferStreamingEligible }) => ({
                subscriptionId,
                accountNumber,
                isUserNameSameAsEmail,
                isEligibleForRegistration,
                isOfferStreamingEligible,
            })),
            withLatestFrom(this._store.select(getPvtTime)),
            concatMap(([transactionData, pvtTime]) =>
                this._loadAccountFromAccountDataWorkflow.build({ accountNumber: transactionData.accountNumber, pvtTime }).pipe(mapTo(transactionData))
            ),
            tap((transactionData) => {
                this._store.dispatch(clearUserEnteredPassword());
                this._store.dispatch(setSuccessfulTransactionData({ transactionData }));
            }),
            mapTo(true),
            catchError((error) => {
                if (error instanceof PasswordUnexpectedError) {
                    return throwError('PASSWORD_POLICY_FAILURE' as SubmitPurchaseOrganicTransactionWorkflowErrors);
                }
                return throwError('SYSTEM' as SubmitPurchaseOrganicTransactionWorkflowErrors);
            })
        );
    }
}
