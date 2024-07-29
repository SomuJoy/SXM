import { Injectable } from '@angular/core';
import { NonPiiLookupWorkflow } from '@de-care/data-workflows';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { LoadCustomerOffersWithCmsContent, LoadOffersWithCmsContent } from '@de-care/domains/offers/state-offers-with-cms';
import { select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, concatMap, map, mapTo, tap, withLatestFrom } from 'rxjs/operators';
import { setTrialExpiryDate } from '../state/actions';
import { getLast4digitsOfRadioId } from './../state/public.selectors';
import { DetokenizeWorkflowService } from './de-tokenize.workflow';

export enum PrefillServiceResponseStatus {
    'newCustomerValidated' = 'newCustomerValidated',
    'existingCustomerValidated' = 'existingCustomerValidated',
    'fail' = 'fail'
}

export enum ExistingAccountStatus {
    'existing' = 'existing',
    'notFound' = 'notFound'
}

/**
 * Steps:
 * 1. Detokenize
 * 2. If VIN present, use it to pre-fill. Radio in response to be stored.
 * 3. If (radioId) go to 4a. else 4b.
 * 4.a. Call nonPii. If account returned, go to 4.a.i else 4.a.ii
 * 4.a.i. Redirect to confirmation [END] (user already completed this flow previously)
 * 4.a.ii. Call /offers/customer with radioId. Go to 5.
 * 4.b. Call /offers. Go to 5.
 * 5. Proceed to page
 *
 */

@Injectable({ providedIn: 'root' })
export class PrefillWorkFlowService implements DataWorkflow<{ token: string; brandingType: string }, PrefillServiceResponseStatus> {
    constructor(
        private _detokenizeWorkflowService: DetokenizeWorkflowService,
        private readonly _loadOffersWithCmsContent: LoadOffersWithCmsContent,
        private readonly _loadCustomerOffersWithCmsContent: LoadCustomerOffersWithCmsContent,
        private readonly _nonPiiWorkflow: NonPiiLookupWorkflow,
        private _store: Store
    ) {}

    build({ token, brandingType }): Observable<PrefillServiceResponseStatus> {
        return (!!token ? this._detokenizeVin(token) : of(true)).pipe(
            withLatestFrom(this._store.pipe(select(getLast4digitsOfRadioId))),
            concatMap(([_, last4DigitsOfRadioId]) => this._determineNextStepsWithRadioId(last4DigitsOfRadioId, brandingType)),
            catchError(() => of(PrefillServiceResponseStatus.fail))
        );
    }

    private _detokenizeVin(token: string) {
        return this._detokenizeWorkflowService.build(token).pipe(
            mapTo(true),
            catchError(() => of(true))
        );
    }

    private _loadOffers(brandingType: string) {
        return this._loadOffersWithCmsContent
            .build({ usedCarBrandingType: brandingType, streaming: false, student: false })
            .pipe(mapTo(PrefillServiceResponseStatus.newCustomerValidated));
    }

    private _getNonPiiAccount(last4DigitsOfRadioId: string) {
        return this._nonPiiWorkflow.build({ radioId: last4DigitsOfRadioId }).pipe(
            tap(response => {
                const expiryDate = response?.subscriptions?.[0]?.plans?.[0]?.endDate;

                if (!!expiryDate) {
                    this._store.dispatch(setTrialExpiryDate({ expiryDate }));
                }
            }),
            map(accountResponse => (!!accountResponse ? ExistingAccountStatus.existing : ExistingAccountStatus.notFound)),
            catchError(() => of(ExistingAccountStatus.notFound))
        );
    }

    private _loadTargettedOffers(brandingType: string, last4DigitsOfRadioId: string | null) {
        return this._loadCustomerOffersWithCmsContent
            .build({ usedCarBrandingType: brandingType, radioId: last4DigitsOfRadioId, streaming: false })
            .pipe(mapTo(PrefillServiceResponseStatus.newCustomerValidated));
    }

    private _determineNextStepsWithRadioId(last4DigitsOfRadioId: string | null, brandingType: string) {
        if (!last4DigitsOfRadioId) {
            return this._loadOffers(brandingType);
        }

        return this._getNonPiiAccount(last4DigitsOfRadioId).pipe(
            concatMap(isExisting => {
                if (isExisting === ExistingAccountStatus.existing) {
                    // User completed this flow previously

                    return of(PrefillServiceResponseStatus.existingCustomerValidated);
                }

                return this._loadTargettedOffers(brandingType, last4DigitsOfRadioId);
            })
        );
    }
}
