import { Component, OnInit, ViewEncapsulation, OnDestroy, Input, OnChanges, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormArray, FormGroup } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { of, Subject, Subscription } from 'rxjs';
import { takeUntil, filter, pairwise, map, startWith, tap, concatMap, withLatestFrom, take } from 'rxjs/operators';

import { CoreLoggerService, SharedEventTrackService } from '@de-care/data-layer';
import { OfferModel, AccountModel, getRadioIdFromAccount, getSubscriptionIdFromAccount, isMostlyMusicPackage, PackageModel, PlanTypeEnum } from '@de-care/data-services';
import { PurchaseState, PurchaseStateConstant, LoadQuote, LoadSelectedOffer, PackageInfo } from '@de-care/purchase-state';
import { SelectedUpsell, ClearUpsell } from '@de-care/checkout-state';
import { TranslateService } from '@ngx-translate/core';
import { UserSettingsService, SettingsService, CURRENCY_PIPE_ZERO_DECIMAL_NUMBER_FORMAT, CURRENCY_PIPE_TWO_DECIMAL_NUMBER_FORMAT } from '@de-care/settings';
import { ActivatedRoute } from '@angular/router';
import { getOffersSavings } from '@de-care/domains/offers/state-offers';
import {
    CheckIfStreamingPlanCodeIsEligibleWorkflowService,
    LoadCustomerFallbackOfferForFailedStreamingEligibilityWorkflowService
} from '@de-care/de-care-use-cases/checkout/state-checkout-triage';

@Component({
    selector: 'offer-upsell',
    templateUrl: './offer-upsell.component.html',
    styleUrls: ['./offer-upsell.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class OfferUpsellComponent implements OnInit, OnDestroy, OnChanges {
    //================================================
    //===                Decorators                ===
    //================================================
    @Input() upgrades: any;
    @Input() stepNumber: number;
    @Input() isFlepz: boolean;
    @Input() loading: boolean;
    @Input() excludeBestPackageHeading = false;
    @Input() hidePlanGrid = false;
    @Input() continueButtonTextCopyOverride: string;
    @Output() selectedPlanCodeEligibility = new EventEmitter<boolean>();

    //================================================
    //===                Variables                 ===
    //================================================
    private unsubscribe: Subject<void> = new Subject();
    private _logPrefix: string = '[Payment Info]:';
    _formSubscribe$: Subscription;
    offer: OfferModel;
    account: AccountModel;
    headerCopy: string;
    upsellOffers: Array<any>;
    termUpsell: PackageInfo;
    packageUpsell: PackageInfo;
    termPackageUpsell: PackageInfo;
    originalOffer: any;
    is360LCapable: boolean;
    upsellForm: FormGroup;
    formControls: Array<any> = [];
    upsellsSelected = {
        package: false,
        term: false
    };
    selectedUpsellPlan: PackageInfo;
    packageUpsellPrice: number;
    termUpsellPrice: number;
    termUpsellAdditionalMonths: number;
    hideTermPriceDifference = false;
    hidePackagePriceDifference = false;
    packageName: string;
    packageNameSelection: string;
    upsellOffer: any;

    trackUpgradeSelectAction: string = 'selected-upgrade';
    trackViewUpgradeDetailsAction: string = 'view-upgrade-details';
    trackContinue: string = 'continue-upgrade';
    trackComponentName: string = 'offer-upsell';
    currentLang: string;
    isCanada: boolean;
    isQuebec: boolean;
    packageDescriptionsViewModel: { [packageName: string]: any };
    private _packageNames: string[];
    isStreaming: boolean = false;
    isPromoOrRTPNonZero: boolean = false;
    //================================================
    //===            Lifecycle events              ===
    //================================================
    constructor(
        private _store: Store<any>,
        private formBuilder: FormBuilder,
        public translateService: TranslateService,
        private _eventTrackService: SharedEventTrackService,
        private _settingsService: SettingsService,
        private _userSettingsService: UserSettingsService,
        private readonly _logger: CoreLoggerService,
        private acRoute: ActivatedRoute,
        private readonly _checkIfStreamingPlanCodeIsEligibleWorkflowService: CheckIfStreamingPlanCodeIsEligibleWorkflowService,
        private readonly _loadCustomerFallbackOfferForFailedStreamingEligibilityWorkflowService: LoadCustomerFallbackOfferForFailedStreamingEligibilityWorkflowService
    ) {
        this.isCanada = this._settingsService.isCanadaMode;
        if (this.isCanada) {
            this._userSettingsService.isQuebec$.pipe(takeUntil(this.unsubscribe)).subscribe(val => {
                this.isQuebec = val;
            });
        }

        this.upsellForm = this.formBuilder.group({
            upsell: new FormArray([])
        });
    }

    ngOnChanges(payload) {
        if (payload.upgrades) {
            this.originalOffer = payload.upgrades.currentValue.originalOffer[0];
            this.upsellOffers = payload.upgrades.currentValue.upgradeOffers.upgrade;
            this._packageNames = [
                this.originalOffer.packageName,
                ...(this.upsellOffers
                    ? this.upsellOffers.filter(offer => offer.packageName !== this.originalOffer.pacakgeName).map(upsellOffer => upsellOffer.packageName)
                    : null)
            ].filter((value, index, self) => self.indexOf(value) === index);
            this._buildPackageDescriptionsViewModel(this._packageNames);
            if (this.upsellOffers) {
                this.formControls.length = 0;
                this.upsellOffers.forEach((o, _i) => {
                    o.priceFormat = this._determinePriceDecimalFormat(o.price);
                    o.savingsPriceFormat = this._determinePriceDecimalFormat(getOffersSavings(o.retailPrice, o.pricePerMonth));
                    // if the upsell is mostly music it uses an alternate flag copy
                    // (avoiding explicit Mostly Music flag for future flexibiility in case other criteria dictates flag copy)
                    o.flagType = isMostlyMusicPackage(o.packageName) ? 'ALTERNATE' : 'DEFAULT';
                    // setting isMostlyMusic property for use in the additional cost description which is specific to Mostly Music package
                    o.isMostlyMusic = isMostlyMusicPackage(o.packageName);
                    // TODO: should see what we can do to use the upsell object as the value so we can send that around instead of just indexes.
                    this.formControls.push(false);
                });
                this.upsellForm.setControl('upsell', this.formBuilder.array(this.formControls || []));
                const emptyCheckBoxesArray = Array(this.upsellOffers.length).fill(false);
                this.updateUpsells(emptyCheckBoxesArray, emptyCheckBoxesArray);
            }
        }
    }

    ngOnInit() {
        this._logger.debug(`${this._logPrefix} component init `);
        // NOTE this need a closer look, could use selectors
        this.acRoute.data.subscribe(data => {
            this.isStreaming = data.isStreaming;
        });

        this._store
            .pipe(
                takeUntil(this.unsubscribe),
                select(state => state[PurchaseStateConstant.STORE.NAME]),
                filter((state: PurchaseState) => state.formStatus.formStep === this.stepNumber && !!state.data.offer)
            )
            .subscribe((state: PurchaseState) => {
                this.account = state.data.account;
                this.offer = state.data.offer;

                const hasSubscriptions = this.account.subscriptions && this.account.subscriptions.length > 0 && this.account.subscriptions[0].radioService;
                this.is360LCapable = hasSubscriptions ? this.account.subscriptions[0].radioService.is360LCapable : false;
            });
        this._formSubscribe$ = this.upsellForm.valueChanges
            .pipe(
                startWith(<Object>null),
                pairwise(),
                map(([previous, change]) => {
                    return {
                        newUpsellValue: change.upsell,
                        previousUpsellValue: previous && previous.upsell
                    };
                }),
                takeUntil(this.unsubscribe)
            )
            .subscribe(({ newUpsellValue, previousUpsellValue }) => {
                if (this.upsellOffers.length > 0) {
                    const checkedpreviousUpsellValue = previousUpsellValue || Array(this.upsellOffers.length).fill(false);
                    this.updateUpsells(newUpsellValue, checkedpreviousUpsellValue);
                }
            });
        this.currentLang = this.translateService.currentLang;
        this.translateService.onLangChange.pipe(takeUntil(this.unsubscribe)).subscribe(ev => {
            this.currentLang = ev.lang;
            this._buildPackageDescriptionsViewModel(this._packageNames);
        });
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    private _buildPackageDescriptionsViewModel(packageNames: string[]) {
        this.packageDescriptionsViewModel = packageNames.reduce(
            (obj, packageName) => ((obj[packageName] = this.translateService.instant('app.packageDescriptions.' + packageName)), obj),
            {}
        );
    }

    //================================================
    //===              Helper Methods              ===
    //================================================

    // TODO: should consider changing this to take in the selected upsells instead of arbitrary list of checkbox booleans
    updateUpsells(checkboxArray: boolean[], previousCheckboxArray: boolean[]) {
        this.termUpsell = this.upsellOffers.find((upsellOffer: PackageInfo) => upsellOffer.upsellType === 'Term');
        this.packageUpsell = this.upsellOffers.find((upsellOffer: PackageInfo) => upsellOffer.upsellType === 'Package');
        this.termPackageUpsell = this.upsellOffers.find((upsellOffer: PackageInfo) => upsellOffer.upsellType === 'PackageAndTerm');

        if (checkboxArray.length === 1) {
            if (this.termUpsell) {
                this.selectedUpsellPlan = checkboxArray[0] ? this.termUpsell : null;
                this.termUpsellPrice = this.isCanada ? this.termUpsell.price - this.originalOffer.price : this.termUpsell.pricePerMonth - this.originalOffer.pricePerMonth;
                this.packageUpsellPrice = null;
                this.upsellsSelected.package = false;
                this.packageNameSelection = null;
            } else if (this.packageUpsell) {
                this.selectedUpsellPlan = checkboxArray[0] ? this.packageUpsell : null;
                this.termUpsellPrice = null;

                this.packageUpsellPrice = this.isCanada
                    ? this.packageUpsell.price - this.originalOffer.price
                    : this.packageUpsell.pricePerMonth - this.originalOffer.pricePerMonth;
                this.upsellsSelected.package = checkboxArray[0];
                this.packageNameSelection = null;
            }
        } else {
            if (this.packageUpsell) {
                this.packageUpsellPrice = this.isCanada
                    ? this.packageUpsell.price - this.originalOffer.price
                    : this.packageUpsell.pricePerMonth - this.originalOffer.pricePerMonth;
            }
            if (this.termUpsell) {
                this.termUpsellPrice = this.isCanada ? this.termUpsell.price - this.originalOffer.price : this.termUpsell.pricePerMonth - this.originalOffer.pricePerMonth;
            }
            this.upsellsSelected.package = false;
            this.packageNameSelection = null;

            if (!this.termPackageUpsell) {
                // Assertion - If both term and package upsell is individually available but term-packege-upsell is not configured.
                // If you are here that means microservice offers are not configured properly.
                // Should not be a valid use case but possible - UI patched to support this use case.
                this._logger.error(`${this._logPrefix} Both term and package upsell is available but term-packege-upsell is not configured.`);
                this._logger.info(`${this._logPrefix} Would consider term upsell since term-packege-upsell is not configured.`);

                if (checkboxArray[1]) {
                    //Term
                    this.selectedUpsellPlan = this.termUpsell;
                } else if (checkboxArray[0]) {
                    //Package
                    this.selectedUpsellPlan = this.packageUpsell;
                } else {
                    //None
                    this.selectedUpsellPlan = null;
                }
            } else {
                // Package
                if (checkboxArray[0] && !checkboxArray[1]) {
                    this.selectedUpsellPlan = this.packageUpsell;

                    this.termUpsellPrice = this.isCanada
                        ? this.termPackageUpsell.price - this.packageUpsell.price
                        : this.termPackageUpsell.pricePerMonth - this.packageUpsell.pricePerMonth;
                    this.upsellsSelected.package = true;
                    this.packageNameSelection = this.packageUpsell.packageName;
                }
                // Term
                else if (!checkboxArray[0] && checkboxArray[1]) {
                    this.selectedUpsellPlan = this.termUpsell;
                    this.termUpsellPrice = this.isCanada ? this.termUpsell.price - this.originalOffer.price : this.termUpsell.pricePerMonth - this.originalOffer.pricePerMonth;
                    this.packageUpsellPrice = this.isCanada
                        ? this.termPackageUpsell.price - this.termUpsell.price
                        : this.termPackageUpsell.pricePerMonth - this.termUpsell.pricePerMonth;
                    this.upsellsSelected.package = false;
                    this.packageNameSelection = null;
                }
                // Both
                else if (checkboxArray[0] && checkboxArray[1]) {
                    this.selectedUpsellPlan = this.termPackageUpsell;
                    // If the term was selected before and then the package is selected
                    if (previousCheckboxArray[1] && !previousCheckboxArray[0]) {
                        // ...show the same calculations as if just the term was selected
                        this.termUpsellPrice = this.isCanada
                            ? this.termUpsell.price - this.originalOffer.price
                            : this.termUpsell.pricePerMonth - this.originalOffer.pricePerMonth;
                        this.packageUpsellPrice = this.isCanada
                            ? this.termPackageUpsell.price - this.termUpsell.price
                            : this.termPackageUpsell.pricePerMonth - this.termUpsell.pricePerMonth;
                    } else {
                        this.termUpsellPrice = this.isCanada
                            ? this.termPackageUpsell.price - this.packageUpsell.price
                            : this.termPackageUpsell.pricePerMonth - this.packageUpsell.pricePerMonth;
                    }
                    this.upsellsSelected.package = true;
                    this.packageNameSelection = this.packageUpsell.packageName;
                }
                // None
                else if (!checkboxArray[0] && !checkboxArray[1]) {
                    this.selectedUpsellPlan = null;
                    if (this.termUpsell) {
                        this.termUpsellPrice = this.isCanada
                            ? this.termUpsell.price - this.originalOffer.price
                            : this.termUpsell.pricePerMonth - this.originalOffer.pricePerMonth;
                    }
                    this.upsellsSelected.package = false;
                    this.packageNameSelection = null;
                }
            }
        }
        const isTrialExtension = this.packageUpsell && this.packageUpsell.type === 'TRIAL_EXT';
        this.hidePackagePriceDifference = this.packageUpsellPrice !== null && !isTrialExtension ? Math.abs(this.packageUpsellPrice) <= 0.01 : false;
        this.hideTermPriceDifference = this.termUpsellPrice !== null ? Math.abs(this.termUpsellPrice) <= 0.1 : false;
        this.isPromoOrRTPNonZero = this.packageUpsell && (this.packageUpsell.type === 'RTP_OFFER' || this.packageUpsell.type === 'PROMO') && this.packageUpsell.price > 0;

        if (this.termUpsell) {
            this.termUpsellAdditionalMonths = this.termUpsell.termLength - this.originalOffer.termLength;
        }

        // TODO: imlement spread operator
        if (this.selectedUpsellPlan) {
            this.upsellOffer = {
                offers: [
                    {
                        advantage: this.selectedUpsellPlan.advantage,
                        mrdEligible: this.selectedUpsellPlan['mrdEligible'],
                        msrpPrice: this.selectedUpsellPlan['msrpPrice'],
                        planCode: this.selectedUpsellPlan.planCode,
                        packageName: this.selectedUpsellPlan.packageName,
                        termLength: this.selectedUpsellPlan.termLength,
                        type: this.selectedUpsellPlan.type,
                        price: this.selectedUpsellPlan.price,
                        retailPrice: this.selectedUpsellPlan.retailPrice,
                        pricePerMonth: this.selectedUpsellPlan.pricePerMonth,
                        marketType: this.selectedUpsellPlan.marketType,
                        expired: this.selectedUpsellPlan.expired,
                        deal: this.selectedUpsellPlan.deal,
                        processingFee: this.selectedUpsellPlan.processingFee,
                        minimumFollowOnTerm: this.selectedUpsellPlan.minimumFollowOnTerm,
                        priceChangeMessagingType: this.selectedUpsellPlan.priceChangeMessagingType,
                        description: {
                            name: this.selectedUpsellPlan.name,
                            packageName: this.selectedUpsellPlan.packageName,
                            header: this.selectedUpsellPlan.header,
                            description: this.selectedUpsellPlan.description,
                            channels: this.selectedUpsellPlan.channels,
                            footer: this.selectedUpsellPlan.footer,
                            promoFooter: this.selectedUpsellPlan.promoFooter
                        },
                        streaming: this.selectedUpsellPlan.streaming
                    }
                ]
            };
            this._store.dispatch(LoadSelectedOffer({ payload: this.upsellOffer }));
            this._eventTrackService.track(this.trackUpgradeSelectAction, {
                componentName: this.trackComponentName,
                planCode: this.selectedUpsellPlan ? this.selectedUpsellPlan.planCode : null
            });
        } else {
            this._store.dispatch(LoadSelectedOffer({ payload: null }));
        }
    }

    continueUpsell() {
        let planCode;
        if (this.selectedUpsellPlan) {
            planCode = this.selectedUpsellPlan.planCode;
            this._store.dispatch(LoadSelectedOffer({ payload: this.upsellOffer }));
            this._store.dispatch(SelectedUpsell({ payload: this.upsellOffer }));
        } else {
            planCode = this.originalOffer.planCode;
            this._store.dispatch(LoadSelectedOffer({ payload: null }));
            this._store.dispatch(SelectedUpsell({ payload: null }));
            this._store.dispatch(ClearUpsell());
        }

        const radioId = getRadioIdFromAccount(this.account);
        const subscriptionId = this.isStreaming && getSubscriptionIdFromAccount(this.account);

        // Need to call eligibility check
        if (this.isStreaming) {
            this._checkIfStreamingPlanCodeIsEligibleWorkflowService
                .build()
                .pipe(
                    tap(eligibleForOffer => this.selectedPlanCodeEligibility.emit(eligibleForOffer)),
                    concatMap(eligible =>
                        eligible
                            ? of({ eligible, planCode })
                            : this._loadCustomerFallbackOfferForFailedStreamingEligibilityWorkflowService
                                  .build()
                                  .pipe(map(fallbackPlanCode => ({ eligible, planCode: fallbackPlanCode })))
                    )
                )
                .subscribe(({ eligible, planCode: planCodeToUse }) =>
                    this._store.dispatch(
                        LoadQuote({
                            payload: {
                                planCodes: [planCodeToUse],
                                ...(radioId && { radioId }),
                                ...(subscriptionId && { subscriptionId })
                            }
                        })
                    )
                );
        } else {
            this._store.dispatch(
                LoadQuote({
                    payload: {
                        planCodes: [planCode],
                        ...(radioId && { radioId }),
                        ...(subscriptionId && { subscriptionId })
                    }
                })
            );
        }

        this._eventTrackService.track(this.trackContinue, { componentName: this.trackComponentName, planCode: planCode });
    }

    viewDetails(planCode): void {
        this._eventTrackService.track(this.trackViewUpgradeDetailsAction, { componentName: this.trackComponentName, planCode: planCode });
    }

    public getOffersSavings(retailPrice, pricePerMonth) {
        return getOffersSavings(retailPrice, pricePerMonth);
    }

    private _determinePriceDecimalFormat(price: number) {
        return Number.isInteger(price) ? CURRENCY_PIPE_ZERO_DECIMAL_NUMBER_FORMAT : CURRENCY_PIPE_TWO_DECIMAL_NUMBER_FORMAT;
    }
}
