import { Inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { concatMap, map, mapTo, take } from 'rxjs/operators';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { COUNTRY_SETTINGS, CountrySettingsToken } from '@de-care/shared/configuration-tokens-locales';
import { getSelectedProvinceCode, setSelectedProvinceCode } from '@de-care/de-care-use-cases/checkout/state-common';
import { CheckEligibilityBasedOnPaymentInfoWorkflowService } from './check-eligibility-based-on-payment-info-workflow.service';
import { SetSelectedProvinceAndLoadOffersForMrdWorkflowService } from './private/set-selected-province-and-load-offers-for-mrd-workflow.service';
import { collectPaymentInfo } from '../state/actions';

interface SubmitPurchasePaymentInformationForMrdWorkflowRequest {
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

export type SubmitPurchasePaymentInformationForMrdWorkflowError = 'SYSTEM' | 'NOT_ELIGIBLE_FOR_OFFER';

@Injectable({ providedIn: 'root' })
export class SubmitPurchasePaymentInformationForMrdWorkflowService implements DataWorkflow<SubmitPurchasePaymentInformationForMrdWorkflowRequest, boolean> {
    constructor(
        private readonly _store: Store,
        private readonly _checkEligibilityBasedOnPaymentInfoWorkflowService: CheckEligibilityBasedOnPaymentInfoWorkflowService,
        private readonly _setSelectedProvinceAndLoadOffersForMrdWorkflowService: SetSelectedProvinceAndLoadOffersForMrdWorkflowService,
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
                    throw 'NOT_ELIGIBLE_FOR_OFFER' as SubmitPurchasePaymentInformationForMrdWorkflowError;
                }
                return true;
            })
            // TODO: Investigate why this throws an error when submitting payment info a second time
            //       (looks like the quotes call fails too...maybe there is some session thing that
            //        happens in Microservices after quote query???)
        );

        this._store.dispatch(collectPaymentInfo({ paymentInfo: { ...paymentInfo, avsValidated: false } }));
        return checkEligibility$.pipe(
            concatMap((result) =>
                this._countrySettings.countryCode.toLowerCase() === 'ca'
                    ? this._store.select(getSelectedProvinceCode).pipe(
                          take(1),
                          concatMap((provinceCode) => {
                              const paymentInfoState = paymentInfo?.state?.toLowerCase();
                              return paymentInfoState && paymentInfoState !== provinceCode?.toLowerCase()
                                  ? this._setSelectedProvinceAndLoadOffersForMrdWorkflowService.build({ provinceCode: paymentInfo?.state })
                                  : of(true);
                          })
                      )
                    : of(result)
            ),
            mapTo(true)
        );
    }
}
