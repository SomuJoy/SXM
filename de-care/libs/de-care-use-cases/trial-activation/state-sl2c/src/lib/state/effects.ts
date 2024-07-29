import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NonPiiLookupWorkflow } from '@de-care/data-workflows';
import { getSelectedProvince, provinceChanged } from '@de-care/domains/customer/state-locale';
import { getIsCanadaMode } from '@de-care/shared/state-settings';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, concatMap, filter, map, tap, withLatestFrom, mapTo } from 'rxjs/operators';
import { Sl2cSubmissionService } from '../data-services/sl2c-submission.service';
import {
    initiateNonPiiLookupAfterSl2cSubmission,
    initiateSl2cSubmission,
    redirectAfterSl2cSubmission,
    setLast4digitsOfRadioId,
    setTrialExpiryDate,
    submitSl2cForm,
    updateCanadianProvinceIfNeeded,
    setSubmissionIsNotProcessing,
    setFirstSubscriptionID,
} from './actions';
import { BrandingTypes } from './constants';
import { getBrandingType, getCorpId, getLast4digitsOfRadioId, getSubmissionIsProcessing } from './public.selectors';
import { Sl2cForm } from './sl2c-form.interface';
import { pageDataStartedLoading, pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';
import { LoadOffersWithCmsContent, LoadCustomerOffersWithCmsContent } from '@de-care/domains/offers/state-offers-with-cms';
import { PrefillServiceResponseStatus, ExistingAccountStatus } from '../workflows/prefill-workflow.service';

// [TODO] Place this in an isolated shared validation lib
const vinLike = /^[A-Za-z0-9]{17}$/;

@Injectable({
    providedIn: 'root',
})
export class Sl2CEffects {
    constructor(
        private readonly _actions$: Actions,
        private readonly _router: Router,
        private readonly _sl2cSubmissionService: Sl2cSubmissionService,
        private readonly _store: Store,
        private readonly _nonPiiLookupWorkflow: NonPiiLookupWorkflow,
        private readonly _loadOffersWithCmsContent: LoadOffersWithCmsContent,
        private readonly _nonPiiWorkflow: NonPiiLookupWorkflow,
        private readonly _loadCustomerOffersWithCmsContent: LoadCustomerOffersWithCmsContent
    ) {}

    // submission step 1: add vin, corpId and isServiceLane to form data
    submitForm$ = createEffect(() =>
        this._actions$.pipe(
            ofType(submitSl2cForm),
            withLatestFrom(this._store.pipe(select(getBrandingType)), this._store.pipe(select(getCorpId))),
            map(([action, brandingType, corpId]) => initiateSl2cSubmission({ request: this.formatSl2cFormValues(corpId, brandingType, action.formValues) }))
        )
    );

    // submission step 2: make the API call to submit it
    initiateSl2cSubmission$ = createEffect(() =>
        this._actions$.pipe(
            ofType(initiateSl2cSubmission),
            concatMap((action) =>
                this._sl2cSubmissionService.submit(action.request).pipe(
                    concatMap((response) => [
                        setLast4digitsOfRadioId({ last4digits: response.radioId }),
                        updateCanadianProvinceIfNeeded({ province: action.request.serviceAddress.state }),
                        initiateNonPiiLookupAfterSl2cSubmission({ accountNumber: response.accountNumber, radioId: response.radioId, subscriptionId: response.subscriptionId }),
                    ]),
                    catchError(() => of(redirectAfterSl2cSubmission({ succeeded: false })))
                )
            )
        )
    );

    // submission step 3: make the non-PII call
    initiateNonPiiLookupAfterSl2cSubmission$ = createEffect(() =>
        this._actions$.pipe(
            ofType(initiateNonPiiLookupAfterSl2cSubmission),
            concatMap((action) => this._nonPiiLookupWorkflow.build({ accountNumber: action.accountNumber })),
            tap((res) => res?.subscriptions?.length > 0 && this._store.dispatch(setFirstSubscriptionID({ subscriptionID: res?.subscriptions[0].id }))),
            concatMap((response) => [setTrialExpiryDate({ expiryDate: response?.subscriptions?.[0]?.plans?.[0]?.endDate }), redirectAfterSl2cSubmission({ succeeded: true })]),
            tap(() => this._store.dispatch(setSubmissionIsNotProcessing())),
            catchError(() => of(redirectAfterSl2cSubmission({ succeeded: false })))
        )
    );

    // submission step 4 (final step) redirect
    redirectAfterSl2cSubmission$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(redirectAfterSl2cSubmission),
                tap(({ succeeded }) => {
                    if (succeeded) {
                        this._router.navigate(['/activate/trial/confirmation']);
                        return;
                    }

                    this._router.navigate(['error']);
                })
            ),
        { dispatch: false }
    );

    // Update the current province in Canada upon successful submission
    updateCanadianProvince$ = createEffect(() => {
        return this._actions$.pipe(
            ofType(updateCanadianProvinceIfNeeded),
            withLatestFrom(this._store.pipe(select(getIsCanadaMode)), this._store.pipe(select(getSelectedProvince))),
            filter(([action, isCanada, currentlySelectedProvince]) => isCanada && action.province && action.province !== currentlySelectedProvince),
            map(([action]) => provinceChanged({ province: action.province }))
        );
    });

    // Reloads the offer when the province is changed, to get proper copy. Effect code is similar to prefill-workflow
    reloadOffers$ = createEffect(
        () => {
            return this._actions$.pipe(
                ofType(provinceChanged),
                withLatestFrom(this._store.pipe(select(getSubmissionIsProcessing))),
                filter(([_, isSubmissionProcessing]) => !isSubmissionProcessing),
                map(([action]) => action),
                withLatestFrom(this._store.pipe(select(getBrandingType)), this._store.pipe(select(getLast4digitsOfRadioId))),
                concatMap(([action, brandingType, last4DigitsOfRadioId]) => {
                    this._store.dispatch(pageDataStartedLoading());
                    if (!last4DigitsOfRadioId) {
                        return this._loadOffersWithCmsContent.build({ usedCarBrandingType: brandingType, streaming: false, student: false, province: action.province }).pipe(
                            tap(() => this._store.dispatch(pageDataFinishedLoading())),
                            mapTo(PrefillServiceResponseStatus.newCustomerValidated)
                        );
                    }
                    return this.getNonPiiAccount(last4DigitsOfRadioId).pipe(
                        concatMap((isExisting) => {
                            if (isExisting === ExistingAccountStatus.existing) {
                                // User completed this flow previously
                                return of(PrefillServiceResponseStatus.existingCustomerValidated);
                            }
                            return this._loadCustomerOffersWithCmsContent
                                .build({ usedCarBrandingType: brandingType, radioId: last4DigitsOfRadioId, streaming: false, province: action.province })
                                .pipe(
                                    tap(() => this._store.dispatch(pageDataFinishedLoading())),
                                    mapTo(PrefillServiceResponseStatus.newCustomerValidated)
                                );
                        })
                    );
                })
            );
        },
        { dispatch: false }
    );

    // convert our form representation into the request format expected by the submission endpoint
    formatSl2cFormValues(corpId: string, brandingType: string, formValues: Sl2cForm) {
        const email = formValues.email?.trim();
        const phoneNumber = formValues.phoneNumber?.trim();
        const radioIdOrVin = formValues.radioIdOrVin ? formValues.radioIdOrVin.trim() : null;

        const isVinLike = vinLike.test(radioIdOrVin);

        return {
            corpId,
            ...(isVinLike ? { vin: radioIdOrVin } : { radioId: radioIdOrVin }), // assume form validation prevented other strings
            serviceLanePartner: brandingType === BrandingTypes.serviceLane,
            firstName: formValues.firstName,
            lastName: formValues.lastName,
            ...(email && { email }),
            ...(phoneNumber && { phone: phoneNumber }),
            serviceAddress: {
                streetAddress: formValues.accountAddress.addressLine1,
                city: formValues.accountAddress.city,
                state: formValues.accountAddress.state,
                postalCode: formValues.accountAddress?.zip ? formValues.accountAddress.zip.trim() : null,
            },
        };
    }

    getNonPiiAccount(last4DigitsOfRadioId: string) {
        return this._nonPiiWorkflow.build({ radioId: last4DigitsOfRadioId }).pipe(
            tap((response) => {
                const expiryDate = response?.subscriptions?.[0]?.plans?.[0]?.endDate;
                if (!!expiryDate) {
                    this._store.dispatch(setTrialExpiryDate({ expiryDate }));
                }
            }),
            map((accountResponse) => (!!accountResponse ? ExistingAccountStatus.existing : ExistingAccountStatus.notFound)),
            catchError(() => of(ExistingAccountStatus.notFound))
        );
    }
}
