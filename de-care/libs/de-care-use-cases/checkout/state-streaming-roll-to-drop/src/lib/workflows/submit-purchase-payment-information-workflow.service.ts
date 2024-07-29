import { Inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, concatMap, map, mapTo, take, tap } from 'rxjs/operators';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { CheckEligibilityBasedOnPaymentInfoWorkflowService } from './check-eligibility-based-on-account-info-workflow.service';
import { collectPaymentInfo } from '../state/actions';
import { SetSelectedProvinceAndLoadOffersWorkflowService } from './set-selected-province-and-load-offers-workflow.service';
import { COUNTRY_SETTINGS, CountrySettingsToken } from '@de-care/shared/configuration-tokens-locales';
import { getSelectedProvinceCode, setSelectedProvinceCode } from '@de-care/de-care-use-cases/checkout/state-common';
import { CustomerValidationWorkFlowService } from '@de-care/domains/customer/state-customer-verification';
import { clearUpsellOffersWithCms } from '@de-care/domains/offers/state-upsells-with-cms';

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
        const checkCreditCardValidation$ = this._customerValidationWorkFlowService
            .build({
                creditCard: {
                    creditCardNumber: parseInt(paymentInfo.cardNumber),
                },
            })
            .pipe(catchError(() => of('CREDIT_CARD_FAILURE' as SubmitPurchasePaymentInformationWorkflowError)));

        return checkCreditCardValidation$
            .pipe(tap(() => this._store.dispatch(collectPaymentInfo({ paymentInfo: { ...paymentInfo, avsValidated: false } }))))
            .pipe(mapTo(true));
    }
}
