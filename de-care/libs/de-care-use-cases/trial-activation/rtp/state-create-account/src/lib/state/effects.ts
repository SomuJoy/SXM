import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
    getOfferRenewalsRequestParams,
    getRedirectURL,
    saveCreateAccountFormData,
    setPrepaidRedeemUsed,
    getSelectedRenewalPlanCodeAndPrice,
    getSelectedPickAPlanPlanCodeAndPrice
} from '@de-care/de-care-use-cases/trial-activation/rtp/state-shared';
import { renewalRequestOnProvinceChangeFinishedLoading, renewalRequestOnProvinceChangeStartedLoading } from '@de-care/de-care/shared/state-loading';
import { PlanTypeEnum } from '@de-care/domains/account/state-account';
import { getSelectedProvince, provinceChanged } from '@de-care/domains/customer/state-locale';
import { getOfferType, LoadRenewalOffersWorkflowService } from '@de-care/domains/offers/state-offers';
import { UserSettingsService, getIsCanadaMode } from '@de-care/settings';
import { FullBrowserRedirect } from '@de-care/shared/browser-common/util-redirect';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { concatMap, filter, map, mapTo, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { AddPrepaidRedeemWorkflow } from './../add-prepaid-redeem-workflow.service';
import { RemovePrepaidRedeemWorkflow } from './../remove-prepaid-redeem-workflow.service';
import {
    addPrepaidRedeem,
    addPrepaidRedeemFailed,
    incorrectVehicleIndicated,
    provinceManuallyChangedRenewalRequestFailed,
    removePrepaidRedeem,
    removePrepaidRedeemInfo,
    setAccountFormSubmitted,
    setPrepaidRedeemInfo,
    navigateToNouvRtcPlanGrid,
    setDisplayRtcGrid,
    setSelectedPackageInfoForDataLayer,
    callDeviceInfoService,
    setPickAPlanSelectedPackageInfoForDataLayer
} from './actions';
import { getCreateAccountFormSubmitted } from './selectors';
import { behaviorEventReactionPickAPlanSelected, behaviorEventReactionRenewalPlanSelected } from '@de-care/shared/state-behavior-events';
import { DeviceInfoWorkflow } from '@de-care/domains/device/state-device-info';

@Injectable({
    providedIn: 'root'
})
export class CreateAccountEffects {
    constructor(
        private readonly _actions$: Actions,
        private readonly _store: Store,
        private readonly _router: Router,
        private readonly _fullBrowserRedirect: FullBrowserRedirect,
        private readonly _addPrepaidRedeemWorkflow: AddPrepaidRedeemWorkflow,
        private readonly _removePrepaidRedeemWorkflow: RemovePrepaidRedeemWorkflow,
        private readonly _userSettingsService: UserSettingsService,
        private readonly _loadRenewalOffersWorkflow: LoadRenewalOffersWorkflowService,
        private readonly _deviceInfoWorkflow: DeviceInfoWorkflow
    ) {}

    // Not you car cliked -> redirect browser to redirectURL query param value
    notYourCarHandler$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(incorrectVehicleIndicated),
                withLatestFrom(this._store.pipe(select(getRedirectURL))),
                tap(([, redirectURL]) => this._fullBrowserRedirect.performRedirect(redirectURL))
            ),
        { dispatch: false }
    );

    addPrepaidRedeemHandler$ = createEffect(() =>
        this._actions$.pipe(
            ofType(addPrepaidRedeem),
            concatMap(({ request }) => this._addPrepaidRedeemWorkflow.build(request)),
            switchMap(response => {
                return response.isSuccess ? [setPrepaidRedeemInfo({ amount: response.amount }), setPrepaidRedeemUsed({ prepaidUsed: true })] : [addPrepaidRedeemFailed()];
            })
        )
    );

    removePrepaidRedeemHandler$ = createEffect(() =>
        this._actions$.pipe(
            ofType(removePrepaidRedeem),
            concatMap(() => this._removePrepaidRedeemWorkflow.build()),
            // TODO: handle server error and remove .isSuccess failure
            switchMap(() => [removePrepaidRedeemInfo(), setPrepaidRedeemUsed({ prepaidUsed: false })])
        )
    );

    createAccountProvinceChangedHandler$ = createEffect(() =>
        this._actions$.pipe(
            ofType(saveCreateAccountFormData),
            withLatestFrom(this._store.pipe(select(getSelectedProvince))),
            concatMap(([data, selectedProvince]) => [
                provinceChanged({
                    province: (data?.correctedAddress ? data.correctedAddress?.state : data.serviceAddress?.state) || data.paymentInfo?.state || selectedProvince
                }),
                setAccountFormSubmitted({ submitted: true })
            ])
        )
    );

    // TODO: Effect required to set the legacy user settings because it is used in the global quote components. Quote components require refactorization
    // to depend only on cusotmer state domain
    setLegacyUserSettingsProvince$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(provinceChanged),
                map(data => data.province),
                map(province => this._userSettingsService.setSelectedCanadianProvince(province))
            ),
        { dispatch: false }
    );

    showLoaderOnProvinceChange$ = createEffect(() =>
        this._actions$.pipe(
            ofType(provinceChanged),
            withLatestFrom(
                this._store.pipe(select(getCreateAccountFormSubmitted)),
                this._store.pipe(select(getOfferRenewalsRequestParams)),
                this._store.pipe(select(getIsCanadaMode)),
                this._store.pipe(select(getOfferType))
            ),
            filter(
                ([, submitted, params, canadaMode, offerType]) => !submitted && params.planCode && params.planCode !== '' && canadaMode && offerType === PlanTypeEnum.RtpOffer
            ),
            map(renewalRequestOnProvinceChangeStartedLoading)
        )
    );

    getRenewalsOnProvinceChange$ = createEffect(() =>
        this._actions$.pipe(
            ofType(renewalRequestOnProvinceChangeStartedLoading),
            withLatestFrom(this._store.pipe(select(getOfferRenewalsRequestParams))),
            switchMap(([, request]) =>
                this._loadRenewalOffersWorkflow
                    .build(request)
                    .pipe(map(success => (success ? renewalRequestOnProvinceChangeFinishedLoading() : provinceManuallyChangedRenewalRequestFailed())))
            )
        )
    );

    renewalRequestErrorHandler$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(provinceManuallyChangedRenewalRequestFailed),
                tap(() => this._router.navigate(['/error']))
            ),
        { dispatch: false }
    );

    navigateToNouvRtcPlanGrid$ = createEffect(() => this._actions$.pipe(ofType(navigateToNouvRtcPlanGrid), mapTo(setDisplayRtcGrid({ displayed: true }))));

    setAnalyticsForSeletedPackage$ = createEffect(() =>
        this._actions$.pipe(
            ofType(setSelectedPackageInfoForDataLayer),
            withLatestFrom(this._store.pipe(select(getSelectedRenewalPlanCodeAndPrice))),
            map(([, data]) => data),
            map(planDetails => behaviorEventReactionRenewalPlanSelected({ selected: planDetails }))
        )
    );

    setAnalyticsForPickAPlanSeletedPackage$ = createEffect(() =>
        this._actions$.pipe(
            ofType(setPickAPlanSelectedPackageInfoForDataLayer),
            withLatestFrom(this._store.pipe(select(getSelectedPickAPlanPlanCodeAndPrice))),
            map(([, data]) => data),
            map(planDetails => behaviorEventReactionPickAPlanSelected({ selected: planDetails }))
        )
    );

    callDeviceInfoServiceEffect$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(callDeviceInfoService),
                map(action => action.radioId),
                switchMap(radioId => this._deviceInfoWorkflow.build(radioId))
            ),
        { dispatch: false }
    );
}
