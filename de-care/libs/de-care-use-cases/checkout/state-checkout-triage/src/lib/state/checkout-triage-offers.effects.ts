import { Inject, Injectable } from '@angular/core';
import {
    getAccountServiceAddressState,
    getActiveOrClosedRadioIdOnAccount,
    getCheckoutAccount,
    getIsRtc,
    getPickAPlanSelectedOfferPackageName,
    getRenewalOffersAsArray,
    getRenewalPlanCode,
    LoadCheckoutSuccess,
    LoadRenewalOfferPackagesSuccess,
    SetSelectedRenewalPlan,
    getRenewalPackageOptions,
} from '@de-care/checkout-state';
import { getLeadOfferPlanCodes } from './checkout-triage.selectors';
import { selectFirstFollowOnOfferPlanCode } from '@de-care/domains/offers/state-follow-on-offers';
import { loadOfferInfoForOffers, loadOffersInfo400Error } from '@de-care/domains/offers/state-offers-info';
import { loadUpsellOfferInfoForUpsellOffers } from '@de-care/domains/offers/state-upsell-offers-info';
import { LoadFlepzDataSuccess, originalOffers, ReceiveUpsells } from '@de-care/purchase-state';
import { SettingsService, UserSettingsService } from '@de-care/settings';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { filter, flatMap, map, withLatestFrom, switchMap } from 'rxjs/operators';
import { loadOfferInfoForLeadOfferPlanCodes } from './checkout-triage.actions';
import { setRenewalPackageNameAndLoadOffersInfo } from './cms-triage-offers.actions';
import { Router } from '@angular/router';
import { LoadOffersRenewalWorkflowService } from '@de-care/domains/offers/state-renewals';
import { of } from 'rxjs';
import { TranslationSettingsToken, TRANSLATION_SETTINGS, CountrySettingsToken, COUNTRY_SETTINGS } from '@de-care/shared/configuration-tokens-locales';

@Injectable()
export class CheckoutTriageOffersEffects {
    constructor(
        private readonly _actions$: Actions,
        private readonly _store: Store,
        private readonly _settingsService: SettingsService,
        private _router: Router,
        private _userSettings: UserSettingsService,
        private _loadOffersRenewalWorkflowService: LoadOffersRenewalWorkflowService,
        @Inject(TRANSLATION_SETTINGS) private readonly _translationSettings: TranslationSettingsToken,
        @Inject(COUNTRY_SETTINGS) private readonly _countrySettings: CountrySettingsToken
    ) {}

    loadOffersInfo$ = createEffect(() =>
        this._actions$.pipe(
            ofType(LoadCheckoutSuccess, LoadFlepzDataSuccess),
            withLatestFrom(
                this._store.pipe(select(getLeadOfferPlanCodes)),
                this._store.pipe(select(selectFirstFollowOnOfferPlanCode)),
                this._store.pipe(select(getIsRtc)),
                this._store.pipe(select(getPickAPlanSelectedOfferPackageName))
            ),
            filter(([_, offerPlanCodes, followOnPlanCode, isRTC]) => !!offerPlanCodes && isRTC !== true),
            map(([_, offerPlanCodes, followOnPlanCode]) => ({
                planCodes: offerPlanCodes.map((leadOfferPlanCode) => ({ leadOfferPlanCode, followOnPlanCode: followOnPlanCode ?? undefined })),
            })),
            map((req) => loadOfferInfoForLeadOfferPlanCodes(req))
        )
    );

    loadOfferInfoForCurrentlySelectedPlanCode$ = createEffect(() =>
        this._actions$.pipe(
            ofType(loadOfferInfoForLeadOfferPlanCodes),
            map(({ type, ...planCodeData }) => planCodeData),
            filter((planCodeData) => !!planCodeData?.planCodes),
            map((planCodeData) => planCodeData),
            withLatestFrom(
                this._store.pipe(select(getAccountServiceAddressState)),
                this._store.pipe(select(getActiveOrClosedRadioIdOnAccount)),
                this._store.pipe(select(getRenewalPackageOptions)),
                this._userSettings.selectedCanadianProvince$
            ),
            switchMap(([planCodeData, serviceAddressState, radioId, renewalPackages, province]) => {
                if (renewalPackages && Array.isArray(renewalPackages) && renewalPackages.length > 0) {
                    return of(this._getOffersInfo(planCodeData, serviceAddressState || province, radioId));
                } else {
                    return this._loadOffersRenewalWorkflowService
                        .build({
                            planCode: planCodeData.planCodes[0].leadOfferPlanCode,
                            streaming: false,
                            radioId: null,
                        })
                        .pipe(map((success) => this._getOffersInfo(planCodeData, serviceAddressState || province, radioId)));
                }
            })
        )
    );

    // Hack to deal with fact that renewals are loaded after the checkout/flepz success happens...
    //  Challenge here though is the fact that the UX is set up to show the page content after the above and not wait for renewals to be done,
    //  however we need renewals to be done to display the appropriate offer info on the page
    loadOffersInfoAfterRenewalsLoad$ = createEffect(() =>
        this._actions$.pipe(
            ofType(LoadRenewalOfferPackagesSuccess),
            withLatestFrom(
                this._store.pipe(select(getLeadOfferPlanCodes)),
                this._store.pipe(select(selectFirstFollowOnOfferPlanCode)),
                this._store.pipe(select(getRenewalPlanCode))
            ),
            map(([_, offerPlanCodes, followOnPlanCode, renewalPlanCode]) => ({
                planCodes: offerPlanCodes.map((leadOfferPlanCode) => ({
                    leadOfferPlanCode,
                    followOnPlanCode: followOnPlanCode ?? undefined,
                    renewalPlanCodes: renewalPlanCode ? [renewalPlanCode] : undefined,
                })),
            })),
            map((offersArray) => loadOfferInfoForLeadOfferPlanCodes(offersArray))
        )
    );

    setRenewalPlanCodeAndLoadOffersInfo$ = createEffect(() =>
        this._actions$.pipe(
            ofType(setRenewalPackageNameAndLoadOffersInfo),
            map(({ payload: { packageName } }) => packageName),
            withLatestFrom(
                this._store.pipe(select(getLeadOfferPlanCodes)),
                this._store.pipe(select(selectFirstFollowOnOfferPlanCode)),
                this._store.pipe(select(getRenewalOffersAsArray))
            ),
            flatMap(([renewalPackageName, offerPlanCodes, followOnPlanCode, renewalPlans]) => {
                const renewalPlanCode = renewalPlans?.find((i) => i.packageName === renewalPackageName)?.planCode;
                return [
                    SetSelectedRenewalPlan({ payload: { packageName: renewalPackageName } }),
                    loadOfferInfoForLeadOfferPlanCodes({
                        planCodes: offerPlanCodes.map((leadOfferPlanCode) => ({
                            leadOfferPlanCode,
                            followOnPlanCode: followOnPlanCode ?? undefined,
                            renewalPlanCodes: renewalPlanCode ? [renewalPlanCode] : undefined,
                        })),
                    }),
                ];
            })
        )
    );

    loadUpsellOffersInfo$ = createEffect(() =>
        this._actions$.pipe(
            ofType(ReceiveUpsells),
            filter(({ payload: upsellOffers }) => Array.isArray(upsellOffers) && upsellOffers.length > 0),
            map((payload) => payload),
            map(({ payload: upsellOffers }: { payload: any[] }) =>
                upsellOffers.reduce((upsellPlanCodes, upsellOffer) => {
                    switch (upsellOffer.upsellType) {
                        case 'Package': {
                            return { ...upsellPlanCodes, packageUpsellPlanCode: upsellOffer.planCode };
                        }
                        case 'Term': {
                            return { ...upsellPlanCodes, termUpsellPlanCode: upsellOffer.planCode };
                        }
                        case 'PackageAndTerm': {
                            return { ...upsellPlanCodes, packageAndTermUpsellPlanCode: upsellOffer.planCode };
                        }
                        default: {
                            return upsellPlanCodes;
                        }
                    }
                }, {})
            ),
            withLatestFrom(
                this._store.pipe(
                    select(getCheckoutAccount),
                    map((account) => {
                        if (this._settingsService.isCanadaMode) {
                            return account?.serviceAddress?.state;
                        }
                        return null;
                    })
                ),
                this._userSettings.selectedCanadianProvince$,
                this._store.pipe(
                    select(originalOffers),
                    map((offers) => (offers && offers.length > 0 ? offers[0].planCode : null))
                ),
                this._store.pipe(select(getActiveOrClosedRadioIdOnAccount))
            ),
            flatMap(([upsellOffersPlanCodes, accountProvince, selectedProvince, leadOfferPlanCode, radioId]) => {
                const province = accountProvince || selectedProvince;
                return [
                    loadOfferInfoForOffers({
                        offersInfoRequest: {
                            planCodes: Object.keys(upsellOffersPlanCodes).map((key) => ({ leadOfferPlanCode: upsellOffersPlanCodes[key] })),
                            ...(province && { province }),
                            ...(radioId && { radioId }),
                        },
                    }),
                    loadUpsellOfferInfoForUpsellOffers({
                        upsellOffersInfoRequest: {
                            leadOfferPlanCode,
                            ...upsellOffersPlanCodes,
                            ...(province && { province }),
                            locales: this._translationSettings.languagesSupported,
                            country: this._countrySettings.countryCode,
                        },
                    }),
                ];
            })
        )
    );

    loadOffersInfo400Error$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(loadOffersInfo400Error),
                map((_) => {
                    this._router.navigate(['/error']);
                })
            ),
        { dispatch: false }
    );

    private _getOffersInfo(planCodeData, serviceAddressState, radioId) {
        return loadOfferInfoForOffers({
            offersInfoRequest: {
                planCodes: planCodeData.planCodes,
                ...(this._settingsService.isCanadaMode && { province: serviceAddressState }),
                ...(radioId && { radioId }),
            },
        });
    }
}
