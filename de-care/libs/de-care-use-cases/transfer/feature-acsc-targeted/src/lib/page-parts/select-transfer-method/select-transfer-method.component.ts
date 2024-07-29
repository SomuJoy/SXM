import { Component, OnDestroy, OnInit, Output, EventEmitter, Inject, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
    getCustomerInfo,
    getMode,
    StartAccountConsolidationWorkflowService,
    StartServiceContinuityWorkflowService,
    setModeToAccountConsolidation,
    setModeToServiceContinuity,
    setRadioIdToReplace,
    setRemoveOldRadioId,
    Mode,
    setSelectedOffer,
    getTrialSubscriptionInfo,
    getRadioIdToReplace,
    setShowOffersAsShown,
    setShowOffersAsHidden,
    getProgramCode,
    getMarketingPromoCode,
    setSelfPayRadioAsClosed,
    setSelfPayRadioAsNotClosed,
    getIsSelfPayPreSelected,
    getIsSelfPayRadioClosed,
    getIsTrialEndingImmediately,
    getDefaultMode,
    getRouteToServicePortability,
    setModeToServicePortability,
    getIsModeServicePortability,
} from '@de-care/de-care-use-cases/transfer/state-acsc-targeted';
import { select, Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { flatMap, take, takeUntil, withLatestFrom } from 'rxjs/operators';
import { getAllOffers, LoadACSCOffersWorkflowService, Offer } from '@de-care/domains/offers/state-offers';
import { Plan } from '@de-care/domains/account/state-account';
import { scrollToElementBySelector } from '@de-care/browser-common';
import { behaviorEventImpressionForPage, behaviorEventErrorFromUserInteraction } from '@de-care/shared/state-behavior-events';
import { SettingsService } from '@de-care/settings';
import { getLanguagePrefix } from '@de-care/domains/customer/state-locale';
import { DOCUMENT } from '@angular/common';

@Component({
    selector: 'de-care-select-transfer-method',
    templateUrl: './select-transfer-method.component.html',
    styleUrls: ['./select-transfer-method.component.scss'],
})
export class SelectTransferMethodComponent implements OnInit, OnDestroy {
    @Input() isLoggedIn = false;
    @Output() toPackageSelectionPage = new EventEmitter();
    @Output() toPaymentPage = new EventEmitter();
    @Output() toRadioLookupPage = new EventEmitter();
    @Output() toPortRadioPage = new EventEmitter();

    translateKeyPrefix = 'DeCareUseCasesTransferFeatureACSCTargetedModule.SelectTransferMethodComponent.';
    private _unsubscribe: Subject<void> = new Subject();
    customerInfo$ = this._store.pipe(select(getCustomerInfo));
    trialSubscriptionInfo$ = this._store.pipe(select(getTrialSubscriptionInfo));
    isSelfPayPreSelected$ = this._store.pipe(select(getIsSelfPayPreSelected));
    selectedRadioId$ = this._store.pipe(select(getRadioIdToReplace));
    isTrialEndingImmediately$ = this._store.pipe(select(getIsTrialEndingImmediately));

    customerFirstName = '';
    currentPlan: Plan;
    radioId: string;
    isCurrentPlanVehicle: boolean;
    transferMethodForm: FormGroup;
    transferOptionForm: FormGroup;
    isTransferOptionSelected = false;
    isAccountConsolidationSelected = false;
    vehicleMake: string;
    transferOptions: any[];
    closedTransferOptions: any[];
    isProccessingAccountConsolidation = false;
    isProccessingServiceContinuity = false;
    TRANSFER_MODES = {
        AC: Mode.AccountConsolidation,
        SC: Mode.ServiceContinuity,
    };
    selectionMade = false;
    submitted = false;
    preSelectedRadioId: string;
    isPreSelectedRadioIdClosed: boolean;
    transferMode: 'SC' | 'SP';
    private readonly _window: Window;

    constructor(
        private _formBuilder: FormBuilder,
        private _store: Store,
        private _settingsService: SettingsService,
        private _startAccountConsolidationWorkflowService: StartAccountConsolidationWorkflowService,
        private _loadACSCOffersWorkflowService: LoadACSCOffersWorkflowService,
        private _startServiceContinuityWorkflowService: StartServiceContinuityWorkflowService,
        @Inject(DOCUMENT) document
    ) {
        this._window = document && document.defaultView;
    }

    ngOnInit() {
        this._setBasicInfo();
        this._setTransferOptionsList();
        this._setTransferMethodForm();
        this._listenForTransferMethodFormChange();
        this._listenForTransferMethodStateChange();
        setTimeout(() => this._initMode(), 0);
    }

    onTransferSubscription() {
        this.submitted = true;
        if (this.selectionMade) {
            this.isProccessingServiceContinuity = true;
            this._startServiceContinuityWorkflowService
                .build({ trialRadioId: this.radioId })
                .pipe(withLatestFrom(this._store.pipe(select(getAllOffers)), this._store.pipe(select(getRouteToServicePortability))))
                .subscribe({
                    next: ([, offers, routeToSP]) => {
                        this.isProccessingServiceContinuity = false;
                        if (routeToSP) {
                            this._store.dispatch(setModeToServicePortability());
                            this.toPortRadioPage.emit();
                        } else {
                            this._store.dispatch(setModeToServiceContinuity());
                            if (offers.length > 1) {
                                this.toPackageSelectionPage.emit();
                            } else {
                                this._store.dispatch(
                                    setSelectedOffer({
                                        offer: offers[0],
                                    })
                                );
                                this.toPaymentPage.emit();
                            }
                        }
                    },
                    error: () => {
                        this.isProccessingServiceContinuity = false;
                    },
                });
        } else {
            scrollToElementBySelector('[data-scroll="scroll-error"]');
            this._store.dispatch(behaviorEventErrorFromUserInteraction({ message: 'ACSC - Missing subscription for transfer selection' }));
        }
    }

    onAddVehicle() {
        this.isProccessingAccountConsolidation = true;
        if (this.transferOptions.length > 0) {
            const preSelectedRadioId = this.transferOptions[0].last4DigitsOfRadioId;
            this._saveSelectedTransferOptionToState(preSelectedRadioId, false, this.transferOptions[0].isClosed);
        }
        this._startAccountConsolidationWorkflowService
            .build()
            .pipe(
                withLatestFrom(
                    this._store.pipe(select(getRadioIdToReplace)),
                    this._store.pipe(select(getProgramCode)),
                    this._store.pipe(select(getMarketingPromoCode)),
                    this._store.pipe(select(getDefaultMode))
                ),
                flatMap(([, radioIdToReplace, programCode, marketingPromoCode, defaultMode]) =>
                    this._loadACSCOffersWorkflowService
                        .build({
                            // replace masking to just get last four digits
                            trialRadioId: this.radioId.slice(this.radioId.length - 4),
                            ...(radioIdToReplace && { selfPayRadioId: radioIdToReplace }),
                            accountConsolidation: this.isAccountConsolidationSelected || defaultMode === 'AC',
                            programCode,
                            marketingPromoCode,
                        })
                        .pipe(withLatestFrom(this._store.pipe(select(getAllOffers))))
                )
            )
            .subscribe({
                next: ([, offers]) => {
                    this.isProccessingAccountConsolidation = false;
                    this.handleOffers(offers);
                },
                error: () => {
                    this.isProccessingAccountConsolidation = false;
                },
            });
    }

    onDontSeeYourCar(): void {
        this._store.pipe(select(getLanguagePrefix)).subscribe((lang) => {
            const langPref = lang === 'en' ? '' : `&langpref=${lang}`;
            this._window.location.href = this.isLoggedIn
                ? `${this._settingsService.settings.oacUrl}myaccount_execute.action?task=sc${langPref}`
                : `${this._settingsService.settings.oacUrl}login_view.action?task=sc${langPref}`;
        });
    }

    private _setBasicInfo() {
        this.customerInfo$.pipe(takeUntil(this._unsubscribe)).subscribe((customerInfo) => {
            const { firstName, currentSubscription } = customerInfo;
            const { vehicle, radioId } = currentSubscription;
            this.customerFirstName = firstName;
            this.isCurrentPlanVehicle = vehicle?.make && vehicle?.model && vehicle?.year;
            this.vehicleMake = vehicle?.make;
            this.radioId = radioId;
            this.currentPlan = currentSubscription?.currentPlan;
        });

        this.selectedRadioId$.pipe(take(1), withLatestFrom(this._store.pipe(select(getIsSelfPayRadioClosed)))).subscribe(([radioId, isClosed]) => {
            this.preSelectedRadioId = radioId;
            this.isPreSelectedRadioIdClosed = isClosed;
        });
    }

    private _setTransferMethodForm() {
        this.transferMethodForm = this._formBuilder.group({
            method: null,
        });
    }

    private _setTransferOptionForm(transferOptions) {
        let defaultSelection = null;
        if (transferOptions.length === 1) {
            const firstOptionRadioId = transferOptions[0].last4DigitsOfRadioId;
            this._saveSelectedTransferOptionToState(firstOptionRadioId, false, transferOptions[0].isClosed);
            defaultSelection = firstOptionRadioId;
        } else if (this.preSelectedRadioId) {
            this._saveSelectedTransferOptionToState(this.preSelectedRadioId, false, this.isPreSelectedRadioIdClosed);
            defaultSelection = this.preSelectedRadioId;
        }

        this.transferOptionForm = this._formBuilder.group({
            radio: this._formBuilder.group({
                radioId: defaultSelection,
                isNoLongerOwned: false,
            }),
        });
    }

    private _setTransferOptionsList() {
        this.customerInfo$.pipe(takeUntil(this._unsubscribe)).subscribe((customerInfo) => {
            const { eligibleSubscriptions, eligibleClosedDevices } = customerInfo;
            const selfPayTransferOption = eligibleSubscriptions.map((subscription) => {
                const { radioService, plans, streamingService, followonPlans } = subscription;
                const plan = plans[0];
                const followonPlanStartDate = followonPlans[0]?.startDate;
                return {
                    vehicleInfo: subscription.radioService.vehicleInfo,
                    nextCycleOn: plan.nextCycleOn || followonPlanStartDate,
                    packageName: plan.packageName,
                    username: this.isLoggedIn ? streamingService.userName : streamingService.maskedUserName,
                    radioId: this.isLoggedIn ? radioService.radioId : `****${radioService.last4DigitsOfRadioId}`,
                    last4DigitsOfRadioId: radioService.last4DigitsOfRadioId,
                    termLength: plan.termLength,
                    isClosed: false,
                    dataPlans: plans
                        .filter((plan) => plan.dataCapable)
                        .map((plan) => ({ ...plan, warningMessageFlag: !(plan.type === 'SELF_PAY' || plan.type === 'SELF_PAID') })),
                };
            });
            // save for checking later if selected radio is closed
            this.closedTransferOptions = eligibleClosedDevices.map((device) => {
                const { last4DigitsOfRadioId, closedDate, vehicleInfo, subscription } = device;
                const { plans, streamingService } = subscription;
                const plan = plans[0];
                return {
                    vehicleInfo,
                    closedDate,
                    packageName: plan.packageName,
                    username: streamingService?.maskedUserName,
                    radioId: this.isLoggedIn ? device.radioId : `****${last4DigitsOfRadioId}`,
                    last4DigitsOfRadioId: last4DigitsOfRadioId,
                    termLength: plan.termLength,
                    isClosed: true,
                    dataPlans: plans.filter((plan) => plan.dataCapable),
                };
            });

            this.transferOptions = [...selfPayTransferOption, ...this.closedTransferOptions];
            this._setTransferOptionForm(this.transferOptions);
            this._listenForTransferOptionChange();
        });
    }

    private _listenForTransferMethodFormChange() {
        this.transferMethodForm
            .get('method')
            .valueChanges.pipe(withLatestFrom(this._store.select(getDefaultMode), this._store.select(getIsModeServicePortability)), takeUntil(this._unsubscribe))
            .subscribe(([value, defaultMode, isModeSP]) => {
                if (value) {
                    if (value === Mode.AccountConsolidation) {
                        this._store.dispatch(setModeToAccountConsolidation());
                        if (defaultMode !== 'SC') {
                            this._store.dispatch(behaviorEventImpressionForPage({ pageKey: 'accountconsolidation', componentKey: 'subscription' }));
                        }
                    } else {
                        if (!isModeSP) {
                            this._store.dispatch(setModeToServiceContinuity());
                        }
                        if (defaultMode !== 'SC') {
                            this._store.dispatch(behaviorEventImpressionForPage({ pageKey: 'servicecontinuity', componentKey: 'subscription' }));
                        }
                    }
                    setTimeout(() => scrollToElementBySelector('[data-scroll="scroll-method-selection"]'));
                }
            });
    }

    private _listenForTransferOptionChange() {
        this.transferOptionForm
            .get('radio')
            .valueChanges.pipe(takeUntil(this._unsubscribe))
            .subscribe(({ radioId, isNoLongerOwned }) => {
                if (radioId) {
                    this.selectionMade = true;
                    const isClosed = this.closedTransferOptions.some((option) => option.last4DigitsOfRadioId === radioId);
                    this._saveSelectedTransferOptionToState(radioId, isNoLongerOwned, isClosed);
                }
            });
    }

    private _saveSelectedTransferOptionToState(radioId: string, isNoLongerOwned: boolean, isClosedRadio: boolean) {
        this._store.dispatch(
            setRadioIdToReplace({
                radioIdToReplace: radioId,
            })
        );
        this._store.dispatch(
            setRemoveOldRadioId({
                removeOldRadioId: isNoLongerOwned,
            })
        );
        if (isClosedRadio) {
            this._store.dispatch(setSelfPayRadioAsClosed());
        } else {
            this._store.dispatch(setSelfPayRadioAsNotClosed());
        }
    }

    private _listenForTransferMethodStateChange() {
        this._store.pipe(select(getMode), takeUntil(this._unsubscribe)).subscribe((mode) => {
            this.isTransferOptionSelected = !!mode;
            this.isAccountConsolidationSelected = mode === Mode.AccountConsolidation;
            if (mode === Mode.ServicePortability) {
                this.transferMethodForm.setValue({ method: Mode.ServiceContinuity });
            }
        });
    }

    private _initMode() {
        this.isSelfPayPreSelected$
            .pipe(
                take(1),
                withLatestFrom(this._store.pipe(select(getDefaultMode)), this._store.pipe(select(getAllOffers)), this._store.pipe(select(getIsModeServicePortability)))
            )
            .subscribe(([isSelfPayPreSelected, defaultMode, offers, isModeSP]) => {
                if (defaultMode === 'SC' && !isModeSP) {
                    this._store.dispatch(setModeToServiceContinuity());
                    if (offers && isSelfPayPreSelected) {
                        this.handleOffers(offers);
                    }
                } else if (defaultMode === 'AC') {
                    this._store.dispatch(setModeToAccountConsolidation());
                }
            });
    }

    private handleOffers(offers: Offer[]) {
        if (offers.length > 1) {
            this._store.dispatch(setShowOffersAsShown());
            this.toPackageSelectionPage.emit();
        } else {
            this._store.dispatch(
                setSelectedOffer({
                    offer: offers[0],
                })
            );
            this._store.dispatch(setShowOffersAsHidden());
            this.toPaymentPage.emit();
        }
    }

    ngOnDestroy() {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }
}
