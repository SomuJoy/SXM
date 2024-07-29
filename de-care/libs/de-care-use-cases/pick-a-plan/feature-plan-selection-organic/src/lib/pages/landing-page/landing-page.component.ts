import { animate, query, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';
import { HeroTitleTypeEnum } from '@de-care/domains/offers/ui-hero';
import { AdditionalCopyOptions } from '@de-care/sales-common';
import { behaviorEventImpressionForPage } from '@de-care/shared/state-behavior-events';
import { select, Store } from '@ngrx/store';
import { FindYourAccountCardComponent } from '../../page-parts/find-your-account-card/find-your-account-card.component';
import {
    getContainsChoicePackages,
    getOffersPackageNamesModified,
    getPickAPlanOfferDetails,
    getShowChoiceNotAvailableError,
    getOffersPrices,
    getPlanSelectionData,
    getSelectedOfferDetails,
    getSelectOffer,
    getPlanComparisonGridParams,
    LoadCustomerPlansWorkflowService,
    setPickAPlanSelectedOfferPackageName,
    setAccountNumber,
    setRadioId,
    setPickAPlanSelectedOfferPlanCode,
    getSelectedPackageNameFromSelectedPlanCode,
} from '@de-care/de-care-use-cases/pick-a-plan/state-plan-selection-organic';
import { PlanSelectionOrganicNavigationService } from '../../plan-selection-organic-navigation.service';
import { getProvinceIsQuebec, setProvinceSelectionVisibleIfCanada } from '@de-care/domains/customer/state-locale';
import { combineLatest } from 'rxjs';
import { SettingsService, UserSettingsService } from '@de-care/settings';
import { map, take } from 'rxjs/operators';

@Component({
    selector: 'de-care-landing-page',
    templateUrl: './landing-page.component.html',
    styleUrls: ['./landing-page.component.scss'],
    animations: [
        trigger('showFindYourAccount', [
            state(
                'hidden',
                style({
                    opacity: 0,
                    marginTop: '0',
                })
            ),
            state(
                'visible',
                style({
                    opacity: 1,
                    marginTop: '-86px',
                })
            ),
            transition('hidden => visible', [animate('0.6s ease-out')]),
            transition(':leave', [
                query('.modal-cover', animate('0.3s ease-out', style({ opacity: 0, display: 'none' }))),
                query(':self', animate('0.45s ease-out', style({ opacity: 0, marginTop: '0' }))),
            ]),
        ]),
    ],
})
export class LandingPageComponent implements OnInit, AfterViewInit {
    @ViewChild(FindYourAccountCardComponent) findYourAccountCardComponent: FindYourAccountCardComponent;
    translateKey = 'DeCareUseCasesPickAPlanFeaturePlanSelectionOrganicModule.LandingPageComponent';

    heroTitleType = HeroTitleTypeEnum.Renewal;
    offer$ = this._store.pipe(select(getSelectOffer));
    showChoiceNotAvailableError$ = this._store.pipe(select(getShowChoiceNotAvailableError));
    availableOffers$ = this._store.pipe(select(getPlanSelectionData));
    packageNames$ = this._store.pipe(select(getOffersPackageNamesModified));
    containsChoicePackages$ = this._store.pipe(select(getContainsChoicePackages));
    retailPrices$ = this._store.pipe(select(getOffersPrices));
    planComparisonGridParams$ = this._store.pipe(select(getPlanComparisonGridParams));
    authenticatedCustomer = false;
    selectedPackageIndex = 0;
    currentOrExpiredTrialPackage: string;
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

    isFindYourAccountVisible = false;

    constructor(
        private readonly _store: Store,
        private readonly _loadCustomerPlansWorkflowService: LoadCustomerPlansWorkflowService,
        private readonly _planChoiceNavigationService: PlanSelectionOrganicNavigationService,
        private _settingsService: SettingsService,
        private _userSettingsService: UserSettingsService,
        private _changeDetectorRef: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        if (this._settingsService.isCanadaMode) {
            this._store.dispatch(setProvinceSelectionVisibleIfCanada({ isVisible: true }));
        }
        this._store.dispatch(pageDataFinishedLoading());
    }

    ngAfterViewInit() {
        this._store.dispatch(behaviorEventImpressionForPage({ pageKey: 'AUTHENTICATE', componentKey: 'rtcLandingPage' }));
    }

    onPackageNameSelected(selectedOfferPackageName: string) {
        this.packageNameSelected = selectedOfferPackageName;
        this._store.dispatch(setPickAPlanSelectedOfferPackageName({ selectedOfferPackageName }));
        this._changeDetectorRef.detectChanges();
    }

    planCodeSelected(planCode: string) {
        this._store.dispatch(setPickAPlanSelectedOfferPlanCode({ selectedOfferPlanCode: planCode }));

        this._store
            .select(getSelectedPackageNameFromSelectedPlanCode)
            .pipe(take(1))
            .subscribe((selectedOfferPackageName: string) => {
                this.onPackageNameSelected(selectedOfferPackageName);
                this.continueToCheckout();
            });
    }

    continueToCheckout() {
        this._planChoiceNavigationService.goToCheckout();
    }

    onAccountRadioSelected({ radioId, accountNumber }) {
        this._loadCustomerPlansWorkflowService.build({ radioId, accountNumber }).subscribe(() => {
            this.isFindYourAccountVisible = false;
            this.authenticatedCustomer = true;
            this.findYourAccountCardComponent.handleCloseAllModals();
        });
    }

    onFindYourAccountVisibilityChanged() {
        this.isFindYourAccountVisible = true;
    }
}
