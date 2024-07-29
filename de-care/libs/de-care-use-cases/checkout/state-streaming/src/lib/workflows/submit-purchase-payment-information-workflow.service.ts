import { Inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, concatMap, map, mapTo, take, tap, withLatestFrom } from 'rxjs/operators';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { CheckEligibilityBasedOnPaymentInfoWorkflowService } from './check-eligibility-based-on-payment-info-workflow.service';
import { collectPaymentInfo, collectPaymentInfoBillingAddress } from '../state/actions';
import { SetSelectedProvinceAndLoadOffersWorkflowService } from './set-selected-province-and-load-offers-workflow.service';
import { COUNTRY_SETTINGS, CountrySettingsToken } from '@de-care/shared/configuration-tokens-locales';
import { getPaymentInfoServiceAddress, getSelectedProvinceCode, setSelectedProvinceCode } from '@de-care/de-care-use-cases/checkout/state-common';
import { CustomerValidationWorkFlowService } from '@de-care/domains/customer/state-customer-verification';
import { clearUpsellOffersWithCms } from '@de-care/domains/offers/state-upsells-with-cms';
import { getAccountFirstSubscriptionFirstPlanIsRtdTrial } from '../state/selectors';

interface SubmitPurchasePaymentInformationWorkflowRequest {
    paymentInfo: {
        firstName: string;
        lastName: string;
        phoneNumber: string;
        addressLine1: string;
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

export type SubmitPurchasePaymentInformationWorkflowError = 'SYSTEM' | 'NOT_ELIGIBLE_FOR_OFFER' | 'CREDIT_CARD_FAILURE';

@Injectable({ providedIn: 'root' })
export class SubmitPurchasePaymentInformationWorkflowService implements DataWorkflow<SubmitPurchasePaymentInformationWorkflowRequest, boolean> {
    constructor(
        private readonly _store: Store,
        private readonly _checkEligibilityBasedOnPaymentInfoWorkflowService: CheckEligibilityBasedOnPaymentInfoWorkflowService,
        private readonly _setSelectedProvinceAndLoadOffersWorkflowService: SetSelectedProvinceAndLoadOffersWorkflowService,
        private readonly _customerValidationWorkFlowService: CustomerValidationWorkFlowService,
        @Inject(COUNTRY_SETTINGS) private readonly _countrySettings: CountrySettingsToken
    ) {}

    build({ paymentInfo }): Observable<boolean> {
        const checkEligibility$ = this._checkEligibilityBasedOnPaymentInfoWorkflowService.build().pipe(
            map((eligible) => {
                if (!eligible) {
                    if (this._countrySettings.countryCode.toLowerCase() === 'ca') {
                        this._store.dispatch(setSelectedProvinceCode({ provinceCode: paymentInfo?.state }));
                    }
                    this._store.dispatch(clearUpsellOffersWithCms());
                    throw 'NOT_ELIGIBLE_FOR_OFFER' as SubmitPurchasePaymentInformationWorkflowError;
                }
                return true;
            })
            // TODO: Investigate why this throws an error when submitting payment info a second time
            //       (looks like the quotes call fails too...maybe there is some session thing that
            //        happens in Microservices after quote query???)
        );

        const checkCreditCardValidation$ = this._customerValidationWorkFlowService
            .build({
                creditCard: {
                    creditCardNumber: parseInt(paymentInfo.cardNumber),
                },
            })
            .pipe(catchError(() => of('CREDIT_CARD_FAILURE' as SubmitPurchasePaymentInformationWorkflowError)));

        return checkCreditCardValidation$.pipe(
            withLatestFrom(this._store.select(getAccountFirstSubscriptionFirstPlanIsRtdTrial)),
            tap(([, accountIsRtdTrial]) => {
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
                              return serviceAddress?.state && serviceAddress.state.toLowerCase() !== provinceCode?.toLowerCase()
                                  ? this._setSelectedProvinceAndLoadOffersWorkflowService.build({ provinceCode: serviceAddress?.state })
                                  : of(true);
                          })
                      )
                    : of(result)
            ),
            mapTo(true)
        );
    }
}
