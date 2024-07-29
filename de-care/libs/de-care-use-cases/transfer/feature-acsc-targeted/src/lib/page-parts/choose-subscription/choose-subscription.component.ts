import { Component, OnDestroy, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { isSelectPackage } from '@de-care/data-services';
import {
    getMode,
    Mode,
    setSelectedOffer,
    getTrialRadioAccountSubscriptionFirstPlan,
    getTrialRadioAccountSubscriptionVehicleInfo,
    getSelectedSelfPaySubscription,
    getIsModeServiceContinuity,
    getIsSelfPayRadioClosed,
    getSelectedClosedRadio,
    getSelectedOfferPackageName,
    getIsSelfPayPreSelected,
    getIsTrialEndingImmediately,
    getHideInYourTrialCopy,
    getDefaultMode,
    getRadioIdToReplace,
    getProgramCode,
    getTrialRadioAccountSubscriptionlast4DigitsOfRadioId,
    displayPromoCodeForm,
    getNotToShowPlusFees,
} from '@de-care/de-care-use-cases/transfer/state-acsc-targeted';
import { LoadACSCOffersWorkflowService, getAllOffers, getPlatformFromPackageName, Offer, PackagePlatformEnum } from '@de-care/domains/offers/state-offers';
import { UserSettingsService } from '@de-care/settings';
import { SxmUiModalComponent } from '@de-care/shared/sxm-ui/ui-modal';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject } from 'rxjs';
import { flatMap, takeUntil, map, withLatestFrom, take } from 'rxjs/operators';
import { getDaysRemaining, isAdvantagePlan } from '../../helpers';
import { scrollToElementBySelector } from '@de-care/browser-common';
import { SxmLanguages } from '@de-care/shared/translation';
import { behaviorEventImpressionForComponent, behaviorEventErrorFromUserInteraction } from '@de-care/shared/state-behavior-events';
import { getFirstAccountSubscriptionFirstPlanPackageName } from '@de-care/domains/account/state-account';
import { MarketingPromoCodeFormComponentApi } from '@de-care/domains/offers/ui-promo-code-validation-form';

@Component({
    selector: 'de-care-choose-subscription',
    templateUrl: './choose-subscription.component.html',
    styleUrls: ['./choose-subscription.component.scss'],
})
export class ChooseSubscriptionComponent implements OnInit, OnDestroy {
    @Output() toSelectTransferMethodPage = new EventEmitter();
    @Output() toPaymentPage = new EventEmitter();

    private _unsubscribe: Subject<void> = new Subject();

    currentPlan$ = this._store.pipe(select(getTrialRadioAccountSubscriptionFirstPlan));
    offers: Offer[];
    newVehicle$ = this._store.pipe(select(getTrialRadioAccountSubscriptionVehicleInfo));
    nonPiiPackageName$ = this._store.pipe(select(getFirstAccountSubscriptionFirstPlanPackageName));
    oldSubscription$ = this._store.pipe(select(getSelectedSelfPaySubscription));
    isModeServiceContinuity$ = this._store.pipe(select(getIsModeServiceContinuity));
    isSelfPayRadioClosed$ = this._store.pipe(select(getIsSelfPayRadioClosed));
    oldClosedRadio$ = this._store.pipe(select(getSelectedClosedRadio));
    selectedOfferPackageName$ = this._store.pipe(select(getSelectedOfferPackageName));
    defaultMode$ = this._store.pipe(select(getDefaultMode));
    isSelfPayPreSelected$ = this._store.pipe(select(getIsSelfPayPreSelected));
    isTrialEndingImmediately$ = this._store.pipe(select(getIsTrialEndingImmediately));
    hideInYourTrialCopy$ = this._store.select(getHideInYourTrialCopy);
    displayPromoCodeForm$ = this._store.select(displayPromoCodeForm);
    notToShowPlusFees$ = this._store.select(getNotToShowPlusFees);

    translateKeyPrefix = 'DeCareUseCasesTransferFeatureACSCTargetedModule.ChooseSubscriptionComponent.';
    currentPlanDaysLeft: number;
    currentPackageName: string;
    currentPackageType: string;
    currentPackageEndDate: Date;
    currentPlanStartDate: Date;
    isAccountConsolidationSelected$: Observable<boolean>;
    locale: string;
    dateFormat$: Observable<string>;
    offerForm = new FormGroup({
        offer: new FormControl(null),
    });
    selectSelected = false;
    packageComparisonParams: any;
    isSelfPayAdvantage = false;
    isChatAvailable: boolean;
    selectionMade = false;
    submitted = false;
    platformChangeScenario = false;
    resolvedPackageName: string;
    previousPageExists: boolean;
    isTrialEndingImmediately = false;
    @ViewChild('comparePackagesModal') private _comparePackagesModal: SxmUiModalComponent;
    @ViewChild('marketingPromoCodeForm') private readonly _marketingPromoCodeForm: MarketingPromoCodeFormComponentApi;

    constructor(
        private _store: Store,
        private readonly _translateService: TranslateService,
        private readonly _userSettingsService: UserSettingsService,
        private readonly _loadACSCOffersWorkflowService: LoadACSCOffersWorkflowService
    ) {
        this.locale = _translateService.currentLang;
        this.dateFormat$ = _userSettingsService.dateFormat$;
        this.isChatAvailable = this._translateService.currentLang !== 'fr-CA';
    }

    ngOnInit() {
        this._setUpFields();
        this._processOffer();
        this._listenForTransferMethodChange();
        this._listenForOfferFormChange();
        this._translateService.onLangChange.pipe(takeUntil(this._unsubscribe)).subscribe((ev) => {
            this.isChatAvailable = ev.lang !== 'fr-CA';
            this.locale = ev.lang as SxmLanguages;
        });
        this.isTrialEndingImmediately$.pipe(takeUntil(this._unsubscribe)).subscribe((isImmediate) => (this.isTrialEndingImmediately = isImmediate));
    }

    openComparisonModal() {
        this._comparePackagesModal.open();
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'overlay:comparepackages' }));
    }

    goBack() {
        this.toSelectTransferMethodPage.emit();
    }

    onContinue() {
        this.submitted = true;
        if (this.selectionMade) {
            this.toPaymentPage.emit();
        } else {
            scrollToElementBySelector('[data-scroll="scroll-error"]');
            this._store.dispatch(behaviorEventErrorFromUserInteraction({ message: 'ACSC - Missing package selection' }));
        }
    }

    _setUpFields() {
        this.currentPlan$.pipe(takeUntil(this._unsubscribe)).subscribe((plan) => {
            if (plan) {
                const { endDate, packageName, type, startDate } = plan || {};
                const currentPlanEndDate = new Date(endDate);
                this.currentPlanStartDate = new Date(startDate);
                this.currentPlanDaysLeft = getDaysRemaining(currentPlanEndDate);
                this.currentPackageName = packageName;
                this.currentPackageType = type;
                this.currentPackageEndDate = new Date(endDate);
            }
        });
        this.oldSubscription$.pipe(takeUntil(this._unsubscribe)).subscribe((subscription) => {
            if (subscription) {
                this.isSelfPayAdvantage = isAdvantagePlan(subscription.plans[0]?.code);
            }
        });
        this.oldClosedRadio$.pipe(takeUntil(this._unsubscribe)).subscribe((radio) => {
            if (radio) {
                this.isSelfPayAdvantage = isAdvantagePlan(radio.subscription?.plans[0]?.code);
            }
        });
        this.isSelfPayPreSelected$.pipe(take(1), withLatestFrom(this.defaultMode$)).subscribe(([isSelfPayPreSelected, defaultMode]) => {
            this.previousPageExists = !(isSelfPayPreSelected && defaultMode === 'SC');
        });
    }

    _setPackageComparisonModal(offers: Offer[]) {
        this.packageComparisonParams = {
            endDate: this.currentPackageEndDate,
            packages: offers.map((offer) => ({
                pricePerMonth: offer.pricePerMonth,
                basePrice: offer.msrpPrice,
                mrdEligible: offer.mrdEligible,
                packageName: offer.packageName,
            })),
        };
    }

    private _processOffer() {
        this._store
            .pipe(select(getAllOffers))
            .pipe(takeUntil(this._unsubscribe), withLatestFrom(this.nonPiiPackageName$, this.isModeServiceContinuity$, this.isSelfPayRadioClosed$, this.oldClosedRadio$))
            .subscribe(([offers, nonPiiPackageName, isServiceContinuity, isClosed, closedRadio]) => {
                this.offerForm.get('offer').setValue(null);
                this.selectSelected = false;
                this.platformChangeScenario = false;
                this._store.dispatch(
                    setSelectedOffer({
                        offer: null,
                    })
                );
                this.resolvedPackageName = isClosed ? closedRadio.subscription.plans[0].packageName : nonPiiPackageName;
                this.offers = offers;
                if (offers && isServiceContinuity) {
                    const selectPackageInOffers = offers.find((offer) => isSelectPackage(offer.packageName));
                    const isNonPiiSelect = isSelectPackage(this.resolvedPackageName);

                    if (selectPackageInOffers && isNonPiiSelect) {
                        const isNonPiiSiriusPlatform = getPlatformFromPackageName(this.resolvedPackageName) === PackagePlatformEnum.Sirius;
                        const isSelectOfferSiriusPlatform = getPlatformFromPackageName(selectPackageInOffers.packageName) === PackagePlatformEnum.Sirius;
                        const oneIsSirusPlatformAndOtherIsDifferentPlaform =
                            [isNonPiiSiriusPlatform, isSelectOfferSiriusPlatform].some(Boolean) && isNonPiiSiriusPlatform !== isSelectOfferSiriusPlatform;
                        if (oneIsSirusPlatformAndOtherIsDifferentPlaform) {
                            this.offers = offers.sort((offerA) => (isSelectPackage(offerA.packageName) ? -1 : 1));
                            const selectedOffer = this.offers[0];
                            this._store.dispatch(
                                setSelectedOffer({
                                    offer: selectedOffer,
                                })
                            );
                            this.offerForm.get('offer').setValue(selectedOffer.packageName);
                            this.selectSelected = true;
                            this.platformChangeScenario = true;
                            this.selectionMade = true;
                        }
                    }
                }
                if (this.offers) {
                    this._setPackageComparisonModal(this.offers);
                }
            });
    }

    _listenForTransferMethodChange() {
        this.isAccountConsolidationSelected$ = this._store.pipe(
            takeUntil(this._unsubscribe),
            select(getMode),
            map((mode) => {
                return mode === Mode.AccountConsolidation;
            })
        );
    }

    processMarketingPromoCode(marketingPromoCode: string) {
        this._store
            .select(getRadioIdToReplace)
            .pipe(
                withLatestFrom(
                    this._store.pipe(select(getTrialRadioAccountSubscriptionlast4DigitsOfRadioId)),
                    this._store.pipe(select(getProgramCode)),
                    this.isAccountConsolidationSelected$,
                    this._store.pipe(select(getDefaultMode))
                ),
                flatMap(([radioIdToReplace, last4DigitsOfRadioId, programCode, isAccountConsolidation, defaultMode]) =>
                    this._loadACSCOffersWorkflowService
                        .build({
                            // replace masking to just get last four digits
                            trialRadioId: last4DigitsOfRadioId,
                            ...(radioIdToReplace && { selfPayRadioId: radioIdToReplace }),
                            accountConsolidation: isAccountConsolidation || defaultMode === 'AC',
                            programCode,
                            marketingPromoCode,
                        })
                        .pipe(withLatestFrom(this._store.pipe(select(getAllOffers))))
                )
            )
            .subscribe(() => {
                if (marketingPromoCode) {
                    this._marketingPromoCodeForm.setProcessingCompleted();
                }
            });
    }

    onMarketingPromoRedeemed(marketingPromoCode: string) {
        this.processMarketingPromoCode(marketingPromoCode);
    }

    onMarketingPromoCodeRemoved() {
        this.processMarketingPromoCode(null);
    }

    private _listenForOfferFormChange() {
        this.offerForm
            .get('offer')
            .valueChanges.pipe(takeUntil(this._unsubscribe))
            .subscribe((value) => {
                const offer = this.offers?.find((anOffer) => anOffer.packageName === value);
                if (offer) {
                    this.selectSelected = isSelectPackage(offer.packageName) && this.platformChangeScenario;
                    this.selectionMade = true;
                    this._store.dispatch(
                        setSelectedOffer({
                            offer,
                        })
                    );
                }
            });
    }

    ngOnDestroy() {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }
}
