import { animate, query, state, style, transition, trigger } from '@angular/animations';
import { I18nPluralPipe } from '@angular/common';
import { AfterViewInit, Component, HostBinding, OnInit, ViewChild } from '@angular/core';
import {
    getContainsChoicePackages,
    getFollowOnPlanSelectionData,
    getPlanComparisonGridParams,
    getRenewalOffersPackageNamesModified,
    getRenewalPrices,
    getRtcOfferDetails,
    getShowChoiceNotAvailableError,
    LoadCustomerPlansWorkflowService,
    setAccountNumber,
    setRadioId,
    setRenewalOfferPackageName,
} from '@de-care/de-care-use-cases/roll-to-choice/state-plan-choice-organic';
import { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';
import { getOfferDetails, Offer, selectOffer } from '@de-care/domains/offers/state-offers';
import { HeroTitleTypeEnum } from '@de-care/domains/offers/ui-hero';
import { AdditionalCopyOptions } from '@de-care/sales-common';
import { behaviorEventImpressionForPage } from '@de-care/shared/state-behavior-events';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { map, tap } from 'rxjs/operators';
import { FindYourAccountCardComponent } from '../../page-parts/find-your-account-card/find-your-account-card.component';
import { PlanChoiceOrganicNavigationService } from '../../plan-choice-organic-navigation.service';

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
                    marginTop: '-330px',
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
    translateKey = 'DeCareUseCasesRollToChoiceFeaturePlanChoiceOrganicModule.LandingPageComponent';
    heroTitleType = HeroTitleTypeEnum.Renewal;
    offer$ = this._store.pipe(select(selectOffer));
    heroOffer$ = this._store.pipe(
        select(selectOffer),
        map((offer) => {
            const isTermGreaterEqualTo12 = offer.termLength >= 12;
            const planTerm = isTermGreaterEqualTo12 ? parseInt((offer.termLength / 12).toFixed(0), 10) : offer.termLength;
            const pluralMap = isTermGreaterEqualTo12
                ? this.translateService.instant(`${this.translateKey}.PLURAL_MAP.YEAR`)
                : this.translateService.instant(`${this.translateKey}.PLURAL_MAP.MONTH`);
            const pluralizedMonth = this._i18nPluralPipe.transform(planTerm, pluralMap);
            return {
                price: offer.price,
                termLength: planTerm,
                pluralizedMonth: pluralizedMonth,
            };
        })
    );
    offerDetails$ = this._store.pipe(select(getOfferDetails));
    rtcOfferDetails$ = this._store.pipe(select(getRtcOfferDetails));
    containsChoicePackages$ = this._store.pipe(select(getContainsChoicePackages));
    offerDetailsCopyOptions: AdditionalCopyOptions = {
        showLegalCopy: false,
        showPriceChangeCopy: false,
    };
    packageNames$ = this._store.pipe(select(getRenewalOffersPackageNamesModified));
    planComparisonGridParams$ = this._store.pipe(select(getPlanComparisonGridParams));
    retailPrices$ = this._store.pipe(select(getRenewalPrices));
    followOnSelection$ = this._store.pipe(select(getFollowOnPlanSelectionData));
    showChoiceNotAvailableError$ = this._store.pipe(select(getShowChoiceNotAvailableError));
    selectedPackageIndex = 2;
    isFindYourAccountVisible = false;
    authenticatedCustomer = false;

    @HostBinding('attr.data-e2e')
    e2e = 'rtcOrganicLandingPage';

    constructor(
        private readonly _store: Store,
        private readonly _loadCustomerPlansWorkflowService: LoadCustomerPlansWorkflowService,
        private readonly _planChoiceNavigationService: PlanChoiceOrganicNavigationService,
        private readonly translateService: TranslateService,
        private readonly _i18nPluralPipe: I18nPluralPipe
    ) {}

    ngOnInit(): void {
        this._store.dispatch(pageDataFinishedLoading());
    }

    onAccountRadioSelected({ radioId, accountNumber }) {
        this._loadCustomerPlansWorkflowService.build(radioId).subscribe(() => {
            this.selectedPackageIndex = 2;
            this.isFindYourAccountVisible = false;
            this.authenticatedCustomer = true;
            this._store.dispatch(setAccountNumber({ accountNumber }));
            this._store.dispatch(setRadioId({ radioId }));
            this.findYourAccountCardComponent.handleCloseAllModals();
        });
    }

    onFindYourAccountVisibilityChanged() {
        this.isFindYourAccountVisible = true;
    }

    onPlanComparisonContinue() {
        this._planChoiceNavigationService.goToCheckout();
    }

    ngAfterViewInit() {
        this._store.dispatch(behaviorEventImpressionForPage({ pageKey: 'AUTHENTICATE', componentKey: 'rtcLandingPage' }));
    }

    onSelectedPackage(selectedRenewalOfferPackageName: string) {
        this._store.dispatch(setRenewalOfferPackageName({ selectedRenewalOfferPackageName }));
    }

    getPluralisedTerm(offer: Offer) {
        const isTermGreaterEqualTo12 = offer.termLength >= 12;
        const planTerm = isTermGreaterEqualTo12 ? parseInt((offer.termLength / 12).toFixed(0), 10) : offer.termLength;
        const pluralMap = isTermGreaterEqualTo12
            ? this.translateService.instant(`${this.translateKey}.PLURAL_MAP.YEAR`)
            : this.translateService.instant(`${this.translateKey}.PLURAL_MAP.MONTH`);
        const pluralizedMonth = this._i18nPluralPipe.transform(planTerm, pluralMap);

        return {
            price: offer.price,
            termLength: planTerm,
            pluralizedMonth: pluralizedMonth,
        };
    }
}
