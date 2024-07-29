import { Injectable } from '@angular/core';
import { checkoutIsLoading, CheckoutState, getCheckoutAccount, getSelectedRenewalPackageName, SetSelectedRenewalPlan, RtcOffersInfoWorkflow } from '@de-care/checkout-state';
import { SharedEventTrackService } from '@de-care/data-layer';
import { AccountModel, ComponentNameEnum, DataLayerActionEnum } from '@de-care/data-services';
import { pageDataFinishedLoading, pageDataStartedLoading } from '@de-care/de-care/shared/state-loading';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { RtcNavigationService } from '../../rtc-navigation.service';

@Injectable({ providedIn: 'root' })
export class RtcLandingPageService {
    loading$: Observable<boolean>;
    selectedRenewalOfferPackageName$: Observable<string>;
    account$: Observable<AccountModel>;

    constructor(
        private _eventTrackingService: SharedEventTrackService,
        private _rtcNavigationService: RtcNavigationService,
        private _store: Store<CheckoutState>,
        private readonly _rtcOffersInfoWorkflow: RtcOffersInfoWorkflow
    ) {
        this.loading$ = this._store.pipe(select(checkoutIsLoading));
        this.selectedRenewalOfferPackageName$ = this._store.pipe(select(getSelectedRenewalPackageName));
        this.account$ = this._store.pipe(select(getCheckoutAccount));
    }

    selectRenewalOffer(accountNumber: string, packageName: string) {
        this._store.dispatch(SetSelectedRenewalPlan({ payload: { packageName } }));
    }

    continueFlow(accountNumber: string, radioId: string, programCode: string) {
        this._eventTrackingService.track(DataLayerActionEnum.RtcContinue, { componentName: ComponentNameEnum.RtcLandingPage });
        // If in CMS mode needs to call offersInfo service again with the selected renewal plan code
        // TODO: move when implementing cms into rtc flow properly
        this._rtcOffersInfoWorkflow.build().subscribe(() => {
            this._rtcNavigationService.goToCheckout(accountNumber, radioId, programCode);
        });
    }

    isLoading() {
        this._store.dispatch(pageDataStartedLoading());
    }

    notLoading() {
        this._store.dispatch(pageDataFinishedLoading());
    }
}
