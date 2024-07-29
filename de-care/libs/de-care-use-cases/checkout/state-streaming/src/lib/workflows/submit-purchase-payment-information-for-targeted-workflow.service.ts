import { Inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { concatMap, map, mapTo, take, tap, withLatestFrom } from 'rxjs/operators';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { COUNTRY_SETTINGS, CountrySettingsToken } from '@de-care/shared/configuration-tokens-locales';
import { getPaymentInfoServiceAddress, getSelectedProvinceCode, setSelectedProvinceCode } from '@de-care/de-care-use-cases/checkout/state-common';
import { CheckEligibilityBasedOnPaymentInfoWorkflowService } from './check-eligibility-based-on-payment-info-workflow.service';
import { collectPaymentInfo, collectPaymentInfoBillingAddress } from '../state/actions';
import { SetSelectedProvinceAndLoadOffersWorkflowService } from './set-selected-province-and-load-offers-workflow.service';
import { getAccountFirstSubscriptionFirstPlanIsRtdTrial } from '../state/selectors';

interface SubmitPurchasePaymentInformationForTargetedWorkflowRequest {
    paymentInfo: {
        city: string;
        state: string;
        zip: string;
        country: string;
        nameOnCard: string;
        cardNumber: string;
        expirationDate: string;
        cvv: string;
        giftCard: string;
    };
}

export type SubmitPurchasePaymentInformationForTargetedWorkflowError = 'SYSTEM' | 'NOT_ELIGIBLE_FOR_OFFER';

@Injectable({ providedIn: 'root' })
export class SubmitPurchasePaymentInformationForTargetedWorkflowService implements DataWorkflow<SubmitPurchasePaymentInformationForTargetedWorkflowRequest, boolean> {
    constructor(
        private readonly _store: Store,
        private readonly _checkEligibilityBasedOnPaymentInfoWorkflowService: CheckEligibilityBasedOnPaymentInfoWorkflowService,
        private readonly _setSelectedProvinceAndLoadOffersWorkflowService: SetSelectedProvinceAndLoadOffersWorkflowService,
        @Inject(COUNTRY_SETTINGS) private readonly _countrySettings: CountrySettingsToken
    ) {}

    build({ paymentInfo }): Observable<boolean> {
        // TODO: see about moving this to some shared code because the same checkEligibility$ code is done in SubmitPurchasePaymentInformationWorkflowService
        const checkEligibility$ = this._checkEligibilityBasedOnPaymentInfoWorkflowService.build().pipe(
            map((eligible) => {
                if (!eligible) {
                    if (this._countrySettings.countryCode.toLowerCase() === 'ca' && paymentInfo?.state) {
                        this._store.dispatch(setSelectedProvinceCode({ provinceCode: paymentInfo?.state }));
                    }
                    throw 'NOT_ELIGIBLE_FOR_OFFER' as SubmitPurchasePaymentInformationForTargetedWorkflowError;
                }
                return true;
            })
            // TODO: Investigate why this throws an error when submitting payment info a second time
            //       (looks like the quotes call fails too...maybe there is some session thing that
            //        happens in Microservices after quote query???)
        );
        return this._store.select(getAccountFirstSubscriptionFirstPlanIsRtdTrial).pipe(
            take(1),
            tap((accountIsRtdTrial) => {
                const payload = { paymentInfo: { ...paymentInfo, avsValidated: false } };
                this._store.dispatch(accountIsRtdTrial ? collectPaymentInfoBillingAddress(payload) : collectPaymentInfo(payload));
            }),
            concatMap(() => checkEligibility$),
            withLatestFrom(this._store.select(getPaymentInfoServiceAddress)),
            concatMap(([result, serviceAddress]) =>
                this._countrySettings.countryCode.toLowerCase() === 'ca'
                    ? this._store.select(getSelectedProvinceCode).pipe(
                          take(1),
                          concatMap((provinceCode) => {
                              const serviceAddressState = serviceAddress?.state?.toLowerCase();
                              return serviceAddressState && serviceAddressState !== provinceCode?.toLowerCase()
                                  ? this._setSelectedProvinceAndLoadOffersWorkflowService.build({ provinceCode: paymentInfo?.state })
                                  : of(true);
                          })
                      )
                    : of(result)
            ),
            mapTo(true)
        );
    }
}
