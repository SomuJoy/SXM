import { AfterViewInit, Component, OnInit } from '@angular/core';
import { HeroTitleTypeEnum } from '@de-care/domains/offers/ui-hero';
import { select, Store } from '@ngrx/store';
import { CheckoutPickAPlanNavigationService } from '../../checkout-pick-a-plan-navigation.service';
import {
    getContainsChoicePackages,
    getOffersPackageNamesModified,
    getOffersPrices,
    getPlanSelectionData,
    getSelectOffer,
    getShowChoiceNotAvailableError,
    getPickAPlanOfferDetails,
    getSelectedOfferDetails,
    getCurrentPackageName,
    getPlanComparisonGridParams,
} from '@de-care/de-care-use-cases/checkout/state-checkout-triage';
import { AdditionalCopyOptions } from '@de-care/sales-common';
import { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';
import { behaviorEventImpressionForPage } from '@de-care/shared/state-behavior-events';
import { combineLatest } from 'rxjs';
import { getProvinceIsQuebec } from '@de-care/domains/customer/state-locale';
import { map, take } from 'rxjs/operators';
import { SettingsService, UserSettingsService } from '@de-care/settings';
import { getSelectedPackageNameFromSelectedPlanCode, SetSelectedOfferPackageName, SetSelectedOfferPlanCode } from '@de-care/checkout-state';

@Component({
    selector: 'lead-offer-plan-selection-page',
    templateUrl: './lead-offer-plan-selection-page.component.html',
    styleUrls: ['./lead-offer-plan-selection-page.component.scss'],
})
export class LeadOfferPlanSelectionPageComponent implements OnInit, AfterViewInit {
    translateKey = 'checkout.leadOfferPlanSelectionPageComponent';
    heroTitleType = HeroTitleTypeEnum.Renewal;
    offer$ = this._store.pipe(select(getSelectOffer));
    showChoiceNotAvailableError$ = this._store.pipe(select(getShowChoiceNotAvailableError));
    availableOffers$ = this._store.pipe(select(getPlanSelectionData));
    packageNames$ = this._store.pipe(select(getOffersPackageNamesModified));
    containsChoicePackages$ = this._store.pipe(select(getContainsChoicePackages));
    retailPrices$ = this._store.pipe(select(getOffersPrices));
    planComparisonGridParams$ = this._store.pipe(select(getPlanComparisonGridParams));
    authenticatedCustomer = true;
    selectedPackageIndex = 0;
    currentOrExpiredTrialPackage$ = this._store.pipe(select(getCurrentPackageName));

    packageIndexSelected: number;
    packageNameSelected: string;

    isQuebec$ = combineLatest([this._store.pipe(select(getProvinceIsQuebec)), this._userSettingsService.isQuebec$]).pipe(
        map(([isQuebecFromState, isQuebecFromLegacy]) => isQuebecFromState || isQuebecFromLegacy)
    );

    offerDetailsCopyOptions: AdditionalCopyOptions = {
        showLegalCopy: false,
        showPriceChangeCopy: false,
    };

    offerDetails$ = this._store.pipe(select(getSelectedOfferDetails));
    pickAPlanOfferDetails$ = this._store.pipe(select(getPickAPlanOfferDetails));

    constructor(
        private readonly _store: Store,
        private readonly _checkoutPickAPlanNavigationService: CheckoutPickAPlanNavigationService,
        private readonly _userSettingsService: UserSettingsService,
        private _settingsService: SettingsService
    ) {}

    ngOnInit(): void {
        this._store.dispatch(pageDataFinishedLoading());
        if (this._settingsService.isCanadaMode) {
            this._userSettingsService.setProvinceSelectionDisabled(true);
        }
    }

    onPackageNameSelected(packageName: string) {
        this.packageNameSelected = packageName;
        this._store.dispatch(SetSelectedOfferPackageName({ payload: { packageName } }));
    }

    planCodeSelected(planCode: string) {
        this._store.dispatch(SetSelectedOfferPlanCode({ payload: { planCode } }));

        this._store
            .select(getSelectedPackageNameFromSelectedPlanCode)
            .pipe(take(1))
            .subscribe((selectedOfferPackageName: string) => {
                this.onPackageNameSelected(selectedOfferPackageName);
                this.continueToCheckout();
            });
    }

    continueToCheckout() {
        this._checkoutPickAPlanNavigationService.goToCheckout();
    }

    ngAfterViewInit(): void {
        this._store.dispatch(behaviorEventImpressionForPage({ pageKey: 'CHECKOUT', componentKey: 'rtcLandingPage' }));
    }
}
