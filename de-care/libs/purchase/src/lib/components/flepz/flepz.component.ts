import { filter, map, take, tap } from 'rxjs/operators';
import {
    selectIsPromoCodeValid,
    ClearUpsell,
    LoadCheckoutFlepz,
    SelectedUpsell,
    getUpsellCode,
    getOfferNotAvailable,
    getCheckoutState,
    CheckoutState,
} from '@de-care/checkout-state';
import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ClearMarketingPromoCode, getProgramAndMarketingPromoCodes, LoadFlepzData, LoadSelectedOffer, SetMarketingPromoCode } from '@de-care/purchase-state';
import { SharedVerifyDeviceUserSelection, Tabs, VerifyDeviceTabsComponent, VerifyDeviceTabsComponentApi } from '@de-care/identification';
import { PackageModel } from '@de-care/data-services';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { UrlHelperService } from '@de-care/app-common';
import { pageDataFinishedLoading, pageDataStartedLoading } from '@de-care/de-care/shared/state-loading';
import { selectQueryParams } from '@de-care/shared/state-router-store';

@Component({
    selector: 'app-flepz',
    templateUrl: './flepz.component.html',
    styleUrls: ['./flepz.component.scss'],
})
export class FlepzComponent implements OnInit, AfterViewInit, OnDestroy {
    @Input() stepNumber: number;
    @Input() leadOfferPackageName: string;
    @Input() ispackageUpgrade: boolean = false;
    @Input() verifyDeviceTabsToShowOverride: Tabs[] = null;
    @Input() deviceLookupPrefillData: { identifier: string; type: 'RadioId' | 'VIN' };
    @ViewChild(VerifyDeviceTabsComponent) private readonly _verifyDeviceTabsComponentApi: VerifyDeviceTabsComponentApi;
    @Output() marketingPromoCodeUpdated = new EventEmitter();

    programCode: string;
    marketingPromoCode: string;
    private _subscription: Subscription;
    isTbView$ = this._store.pipe(
        select(selectQueryParams),
        map((data) => !!data.tbView)
    );
    upsellCode$ = this._store.select(getUpsellCode);
    isPromoCodeValid$ = this._store.select(selectIsPromoCodeValid);
    isOfferNotAvailable$ = this._store.select(getOfferNotAvailable).pipe(map((data) => data.offerNotAvailable));

    constructor(private _store: Store<any>, private _activatedRoute: ActivatedRoute, private _urlHelperService: UrlHelperService, private _router: Router) {}

    ngOnInit(): void {
        this._subscription = this._store.pipe(select(getProgramAndMarketingPromoCodes)).subscribe(({ programCode, marketingPromoCode }) => {
            this.programCode = programCode;
            this.marketingPromoCode = marketingPromoCode;
        });
    }

    ngAfterViewInit(): void {
        if (this.deviceLookupPrefillData && this._verifyDeviceTabsComponentApi) {
            switch (this.deviceLookupPrefillData.type) {
                case 'RadioId': {
                    this._verifyDeviceTabsComponentApi.prefillRadioIdLookup(this.deviceLookupPrefillData.identifier);
                    break;
                }
                case 'VIN': {
                    this._verifyDeviceTabsComponentApi.prefillVinLookup(this.deviceLookupPrefillData.identifier);
                    break;
                }
            }
        }
    }

    ngOnDestroy(): void {
        if (this._subscription) {
            this._subscription.unsubscribe();
        }
    }

    // used for flepz account
    onUserSelection(userSelection: SharedVerifyDeviceUserSelection) {
        this._store.dispatch(pageDataStartedLoading());
        this._store.dispatch(
            LoadFlepzData({
                payload: {
                    radio: userSelection.selectedRadio,
                    account: userSelection.selectedAccount,
                    accountNumber: userSelection.selectedAccountNumber,
                    stepNumber: this.stepNumber,
                    platformChanged: userSelection.platformChanged,
                    deferredUpsell: !!userSelection.deferredUpsell,
                },
            })
        );
    }

    onUpsellSelected(upsell: PackageModel) {
        const upsellData = upsell ? { offers: [upsell] } : null;
        this._store.dispatch(LoadSelectedOffer({ payload: upsellData }));
        this._store.dispatch(SelectedUpsell({ payload: upsellData }));
        !upsellData && this._store.dispatch(ClearUpsell());
    }

    onMarketingPromoRedeemed(promoCode): void {
        this._store.dispatch(SetMarketingPromoCode({ payload: { promocode: promoCode } }));
        this._store.dispatch(LoadCheckoutFlepz({ payload: { marketingPromoCode: promoCode } }));
        this.marketingPromoCodeUpdated.emit();
    }

    onMarketingPromoCodeRemoved(): void {
        const urlProgramCode: string = this._urlHelperService.getCaseInsensitiveParam(this._activatedRoute.snapshot.queryParamMap, 'programcode');
        this._store.dispatch(ClearMarketingPromoCode());
        this._store.dispatch(LoadCheckoutFlepz({ payload: { programId: urlProgramCode } }));
        this.marketingPromoCodeUpdated.emit();
    }

    onRadioSelectionStarted() {
        this._store.dispatch(pageDataStartedLoading());
    }

    onPlatformChangeModalContentLoaded() {
        this._store.dispatch(pageDataFinishedLoading());
    }

    redirectToErrorPage() {
        this._router.navigate(['/error']);
    }
}
