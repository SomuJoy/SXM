import { AfterViewInit, ChangeDetectorRef, Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SxmLanguages } from '@de-care/app-common';
import {
    getCreateAccountData,
    incorrectVehicleIndicated,
    addPlanGridStepForTrialExtRtc,
    vmPlanGridSelectors,
    navigateToNouvRtcPlanGrid,
    getChoiceGenreRenewalPackageOptions,
    getCreateAccountFormSubmitted,
    getIsNouvRtcAndNotChoice,
    getAddressEditionRequired,
    setAddressEditionRequired,
    resetAddressEditionRequired,
    setSelectedPackageInfoForDataLayer,
    getLeadOfferSelectionViewModel,
    getChoiceGenreLeadOfferPackageOptions,
    setPickAPlanSelectedPackageInfoForDataLayer,
    getPrepaidSuccessfullyAdded,
    removePrepaidRedeemInfo,
    setPrepaidRedeemInfo,
} from '@de-care/de-care-use-cases/trial-activation/rtp/state-create-account';
import {
    getCCNum,
    getCreditCardErrorFound,
    saveCreateAccountFormData,
    setProvinceSelectorVisibleForCanada,
    setProvinceSelectorEnabled,
    getTotalNumberOfSteps,
    getOfferTypeIsTrialExtRtc,
    getSelectedRenewalPackageIsChoice,
    getHasMultipleOffersOrRenewalOffers,
    setSelectedLeadOfferByPackageName,
    getHasMultipleOffers,
    getOfferInfoDetailsViewModel,
    setPrepaidRedeemUsed,
} from '@de-care/de-care-use-cases/trial-activation/rtp/state-shared';
import { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';
import {
    AddressCorrectionAction,
    AddressValidationState,
    CustomerValidationAddressesWorkFlowService,
    SimpleAddress,
} from '@de-care/domains/customer/state-customer-verification';
import { getLanguage } from '@de-care/domains/customer/state-locale';
import { sxmCountries } from '@de-care/settings';
import { behaviorEventErrorFromUserInteraction, behaviorEventImpressionForComponent, behaviorEventImpressionForPage } from '@de-care/shared/state-behavior-events';
import { getCountry, getIsCanadaMode } from '@de-care/shared/state-settings';
import { getSxmValidator, getValidateEmailByServerFn } from '@de-care/shared/validation';
import { DataValidationService } from '@de-care/data-services';
import { select, Store } from '@ngrx/store';
import { BehaviorSubject, combineLatest, of, Subject } from 'rxjs';
import { filter, map, switchMap, take, takeUntil, withLatestFrom } from 'rxjs/operators';
import * as uuid from 'uuid/v4';
import { setSelectedRenewalPackageName } from '@de-care/domains/offers/state-offers';
import { TranslateService } from '@ngx-translate/core';
import { AddedGiftCardData } from '@de-care/domains/payment/ui-prepaid-redeem';

@Component({
    selector: 'de-care-trial-activation-rtp-create-account',
    templateUrl: './create-account.component.html',
    styleUrls: ['./create-account.component.scss'],
})
export class CreateAccountComponent implements OnInit, OnDestroy, AfterViewInit {
    @HostBinding('attr.data-e2e') dataE2e = 'TrialActivationRtpCreateAccountComponent';

    _unsubscribe$ = new Subject();
    form: FormGroup;
    returnUrl: string;
    translateKey = 'deCareUseCasesTrialActivationRtpFeatureCreateAccountModule.createAccountComponent.';
    maskCCNum = false;
    maskedCCNum: string;
    isGiftCardEntered = false;

    showInvalidAddressError = false;
    addressNeedsModification = false;
    unexpectedError = false;
    correctedAddress = null;
    loadingSubmission = false;
    avsInfo: AddressValidationState & { currentAddress: SimpleAddress };
    submitted = false;
    todaysDate: any;
    currentLang: SxmLanguages = 'en-US';
    zipId = uuid();
    address = null;
    selectedPackageIndex = 0;
    readonly contestMessageId = uuid();
    createAccountModalAriaDescribedbyTextId = uuid();
    chooseGenreFormModalAriaDescribedbyTextId = uuid();
    chooseLeadOfferGenreModalAriaDescribedbyTextId = uuid();

    viewModel$ = this._store.pipe(select(getCreateAccountData));
    displayLeadOfferSelectionStep$ = new BehaviorSubject(false);
    displayAccountStep$ = combineLatest([this.displayLeadOfferSelectionStep$, this._store.select(addPlanGridStepForTrialExtRtc)]).pipe(
        map(([showLeadOfferSelection, showRenewalSelection]) => !showLeadOfferSelection && !showRenewalSelection)
    );
    offerDetails$ = this._store.pipe(select(getOfferInfoDetailsViewModel));
    prepaidRedeemAddedInfo$ = this._store.pipe(select(getPrepaidSuccessfullyAdded));
    canadaMode$ = this._store.pipe(select(getIsCanadaMode));
    creditCardError$ = this._store.pipe(select(getCreditCardErrorFound));
    ccNum$ = this._store.pipe(select(getCCNum));
    displayRtcStep$ = this._store.pipe(select(addPlanGridStepForTrialExtRtc));
    numberOfSteps$ = this._store.pipe(select(getTotalNumberOfSteps));
    hasMultipleOffers$ = this._store.pipe(select(getHasMultipleOffers));
    leadOfferSelectionViewModel$ = this._store.select(getLeadOfferSelectionViewModel);
    vmPlanGridSelectors$ = this._store.pipe(select(vmPlanGridSelectors));
    renewalPackageIsChoice$ = this._store.pipe(select(getSelectedRenewalPackageIsChoice));
    offerTypeIsTrialExtRtc$ = this._store.pipe(select(getOfferTypeIsTrialExtRtc));
    isNouvRtcAndNotChoice$ = this._store.pipe(select(getIsNouvRtcAndNotChoice));
    isSelectedLeadOfferNotChoice$ = new BehaviorSubject(false);
    addressEditionRequired$ = this._store.pipe(select(getAddressEditionRequired));
    ccCVV: FormControl;
    agreement: FormControl;
    selectedPageIndex = 0;
    genreIsSelected = false;
    showGenreModal = false;
    showLeadOfferGenreModal = false;
    selectedLeadOfferPackageName: string;
    // NOTE: this will get updated to a selector that will getChoiceGenrePackageOptions once CMS integration is done.
    genres$ = combineLatest([this._store.select(getChoiceGenreRenewalPackageOptions), this._translateService.stream('app.packageDescriptions')]).pipe(
        map(([packageNames, packageDescriptions]) => CreateAccountComponent.mapGenreOptions(packageNames, packageDescriptions))
    );
    // NOTE: this will get updated to a selector that will getChoiceGenrePackageOptionsForLeadOffers once CMS integration is done.
    genresForLeadOffer$ = combineLatest([this._store.select(getChoiceGenreLeadOfferPackageOptions), this._translateService.stream('app.packageDescriptions')]).pipe(
        map(([packageNames, packageDescriptions]) => CreateAccountComponent.mapGenreOptions(packageNames, packageDescriptions))
    );

    private _destroy$ = new Subject<boolean>();
    agreementAccepted = false;
    isCanada = false;

    static mapGenreOptions(packageNames, packageDescriptions) {
        return packageNames.map((packageName) => ({
            label: packageDescriptions[packageName].shortName,
            value: packageName,
            tooltipTitle: packageDescriptions[packageName].channels[0].title,
            tooltipText: packageDescriptions[packageName].channels[0].descriptions,
        }));
    }

    constructor(
        private readonly _store: Store,
        private readonly _router: Router,
        private readonly _formBuilder: FormBuilder,
        private readonly _customerValidationAddressesWorkFlowService: CustomerValidationAddressesWorkFlowService,
        private readonly _dataValidationService: DataValidationService,
        private readonly _changeDetectorRef: ChangeDetectorRef,
        private readonly _translateService: TranslateService
    ) {
        const date = new Date();
        this.todaysDate = {
            month: date.getMonth() + 1,
            year: date.getFullYear(),
        };
    }

    ngOnInit(): void {
        this._listenForLocationInfo();
        this._listenForCCError();
        this._store.dispatch(setProvinceSelectorEnabled());
        this._store.dispatch(setProvinceSelectorVisibleForCanada());
    }

    ngAfterViewInit() {
        this._store.dispatch(behaviorEventImpressionForPage({ pageKey: 'CHECKOUT', componentKey: 'paymentInfo' }));
    }

    ngOnDestroy(): void {
        this._destroy$.next(true);
        this._destroy$.unsubscribe();
    }

    private _listenForLocationInfo(): void {
        this._store
            .pipe(takeUntil(this._destroy$), select(getCountry), withLatestFrom(this._store.pipe(select(getLanguage)), this.viewModel$.pipe(map((data) => data.zipCode))))
            .subscribe(([country, lang, zipCode]) => {
                this._initForm(country || 'us', (lang || 'en-US') as SxmLanguages, zipCode);
                if (country === 'ca') {
                    this.isCanada = true;
                    this._addCVVControl();
                    this._addAgreementControl();
                }
                this.currentLang = lang as SxmLanguages;
            });
    }

    private _initForm(country: sxmCountries, lang: SxmLanguages, zipCodeValue: string = ''): void {
        this.form = this._formBuilder.group({
            userInfo: this._formBuilder.group({
                phoneNumber: [
                    null,
                    {
                        validators: Validators.required,
                        updateOn: 'blur',
                    },
                ],
                email: [
                    null,
                    {
                        validators: [Validators.required, ...getSxmValidator('email', country, lang)],
                        asyncValidators: getValidateEmailByServerFn(this._dataValidationService, 250, this._changeDetectorRef),
                        updateOn: 'blur',
                    },
                ],
            }),
            paymentInfo: this._formBuilder.group(
                {
                    address: [
                        '',
                        {
                            updateOn: 'blur',
                            validators: [Validators.required],
                        },
                    ],
                    city: [
                        '',
                        {
                            updateOn: 'blur',
                            validators: [Validators.required],
                        },
                    ],
                    state: [
                        '',
                        {
                            validators: [Validators.required],
                        },
                    ],
                    zip: [
                        zipCodeValue,
                        {
                            updateOn: 'blur',
                            validators: [Validators.required],
                        },
                    ],
                    ccName: [
                        '',
                        {
                            updateOn: 'blur',
                            validators: [Validators.required],
                        },
                    ],
                    ccNum: [
                        null,
                        {
                            updateOn: 'blur',
                            validators: [Validators.required, ...getSxmValidator('creditCardNumber')],
                        },
                    ],
                    ccExp: [
                        null,
                        {
                            updateOn: 'blur',
                            validators: [Validators.required, ...getSxmValidator('creditCardExpDate')],
                        },
                    ],
                    serviceAddressSame: [true],
                },
                { validator: this.ccExpValidator }
            ),
        });
        this._store.dispatch(pageDataFinishedLoading());
        this._listenForServiceAddressCheck();
    }

    private _listenForServiceAddressCheck(): void {
        this.form
            .get(['paymentInfo', 'serviceAddressSame'])
            .valueChanges.pipe(takeUntil(this._destroy$))
            .subscribe((checked) => {
                !checked ? this._addServiceAddressForm() : this._removeServiceAddressForm();
            });
    }

    private _addCVVControl(): void {
        this.ccCVV = new FormControl(null, { updateOn: 'blur', validators: [Validators.required, ...getSxmValidator('creditCardSecurityCode')] });
        const group = this.form.get('paymentInfo') as FormGroup;
        group.addControl('ccCVV', this.ccCVV);
    }

    private _addAgreementControl(): void {
        this.agreement = new FormControl(null, { validators: [Validators.required] });
        const group = this.form.get('paymentInfo') as FormGroup;
        group.addControl('agreement', this.agreement);
        this.agreement.valueChanges.pipe(takeUntil(this._destroy$)).subscribe((checked) => {
            this.agreementAccepted = !!checked;
            if (checked === false) {
                this.form.get(['paymentInfo', 'agreement']).reset();
            }
        });
    }

    private _addServiceAddressForm(): void {
        this.form.addControl(
            'serviceAddress',
            this._formBuilder.group({
                address: [
                    '',
                    {
                        updateOn: 'blur',
                        validators: [Validators.required],
                    },
                ],
                city: [
                    '',
                    {
                        updateOn: 'blur',
                        validators: [Validators.required],
                    },
                ],
                state: [
                    '',
                    {
                        validators: [Validators.required],
                    },
                ],
                zip: [
                    '',
                    {
                        updateOn: 'blur',
                        validators: [Validators.required],
                    },
                ],
            })
        );
    }

    private _removeServiceAddressForm(): void {
        this.form.removeControl('serviceAddress');
    }

    private _navigateToReviewStep() {
        if (this.form.valid) {
            return this._router.navigateByUrl('/activate/trial/rtp/review');
        }
    }

    private _handleNouvNavigationToReviewStep() {
        this._store
            .select(getHasMultipleOffersOrRenewalOffers)
            .pipe(
                take(1),
                map(({ hasMultipleOffers, hasMultipleRenewalOffers }) => {
                    if (hasMultipleRenewalOffers) {
                        this._store.dispatch(navigateToNouvRtcPlanGrid());
                        // TODO: this page key and component key doesn't seem right...
                        this._store.dispatch(behaviorEventImpressionForPage({ pageKey: 'CHECKOUT', componentKey: 'rtcLandingPage' }));
                    } else if (hasMultipleOffers) {
                        this.displayLeadOfferSelectionStep$.next(true);
                        // TODO: Set these keys with the appropriate values as per the FRD
                        this._store.dispatch(behaviorEventImpressionForPage({ pageKey: 'CHECKOUT', componentKey: 'rtcLandingPage' }));
                    } else {
                        this._validateAddress();
                    }
                })
            )
            .subscribe();
    }

    private _listenForCCError() {
        this.creditCardError$.pipe(takeUntil(this._destroy$), withLatestFrom(this.ccNum$)).subscribe(([hasError, ccNum]) => {
            if (hasError) {
                this.setMaskedCCNumber(ccNum.toString());
                this.maskCCNum = true;
            }
        });
    }

    submitForm() {
        this.form.markAllAsTouched();
        this.submitted = true;
        this._store.dispatch(resetAddressEditionRequired());

        if (this.form.pending) {
            this.form.statusChanges
                .pipe(
                    filter((status) => status !== 'PENDING'),
                    take(1),
                    takeUntil(this._unsubscribe$)
                )
                .subscribe(() => {
                    this.submitForm();
                });
        } else if (this.form.invalid) {
            if (this.form.get('userInfo').get('email').errors) {
                this._store.dispatch(behaviorEventErrorFromUserInteraction({ message: 'Auth - Missing or invalid email' }));
            }
            if (this.form.get('userInfo').get('phoneNumber').errors) {
                this._store.dispatch(behaviorEventErrorFromUserInteraction({ message: 'Auth - Missing or invalid phone number' }));
            }
            if (this.form.get('paymentInfo').get('address').errors) {
                this._store.dispatch(behaviorEventErrorFromUserInteraction({ message: 'Checkout - Missing street address' }));
            }
            if (this.form.get('paymentInfo').get('city').errors) {
                this._store.dispatch(behaviorEventErrorFromUserInteraction({ message: 'Checkout - Missing city' }));
            }
            if (this.form.get('paymentInfo').get('state').errors) {
                this._store.dispatch(behaviorEventErrorFromUserInteraction({ message: 'Checkout - State not selected' }));
            }
            if (this.form.get('paymentInfo').get('zip').errors) {
                this._store.dispatch(behaviorEventErrorFromUserInteraction({ message: 'Checkout - Missing or incomplete zip code' }));
            }
            if (this.form.get('paymentInfo').get('ccName').errors) {
                this._store.dispatch(behaviorEventErrorFromUserInteraction({ message: 'Checkout - Missing or invalid name on credit card' }));
            }
            if (this.form.get('paymentInfo').get('ccNum').errors) {
                this._store.dispatch(behaviorEventErrorFromUserInteraction({ message: 'Checkout - Missing or invalid credit card number' }));
            }
            if (this.form.get('paymentInfo').get('ccExp').errors) {
                this._store.dispatch(behaviorEventErrorFromUserInteraction({ message: 'Checkout - Missing or invalid credit card expiry year' }));
            }
            if (this.form.get('paymentInfo').get('ccCVV')?.errors) {
                this._store.dispatch(behaviorEventErrorFromUserInteraction({ message: 'Checkout - Missing or invalid CVV' }));
            }
        } else {
            this._handleNouvNavigationToReviewStep();
        }
    }

    ccExpValidator = (control: AbstractControl) => {
        // Custom CC exp check validator
        if (control.value.ccExp) {
            const matches: string[] = control.value.ccExp.match(/([\d]{1,2})\/*([\d]{1,2})?/);
            if (
                parseInt(`20${matches[2]}`, 10) < this.todaysDate.year ||
                (parseInt(`20${matches[2]}`, 10) === this.todaysDate.year && parseInt(matches[1], 10) < this.todaysDate.month) ||
                control.value.ccExp.length < 5
            ) {
                this._store.dispatch(behaviorEventErrorFromUserInteraction({ message: 'Checkout - Invalid expiration date' }));
                return { invalidDate: true };
            }
        }
        return null;
    };

    notYourCarClick() {
        this._store.dispatch(incorrectVehicleIndicated());
    }

    setMaskedCCNumber(currentCCNumber: string) {
        const last4CurrentCCNumber = currentCCNumber ? currentCCNumber.substr(-4) : null;
        this.maskedCCNum = `************${last4CurrentCCNumber}`;
    }

    handleUnmaskCC() {
        this.maskCCNum = false;
        this.form.get(['paymentInfo', 'ccNum']).reset();
    }

    checkGiftCardEntry($event): void {
        this.isGiftCardEntered = $event.isGiftCard;
    }

    addPrepaidRedeem(event: AddedGiftCardData): void {
        this._store.dispatch(setPrepaidRedeemInfo({ amount: event.amount }));
        this._store.dispatch(setPrepaidRedeemUsed({ prepaidUsed: true }));
    }

    removePrepaidRedeem(): void {
        this._store.dispatch(removePrepaidRedeemInfo());
        this._store.dispatch(setPrepaidRedeemUsed({ prepaidUsed: false }));
    }

    private _validateAddress() {
        this._store.dispatch(setSelectedPackageInfoForDataLayer());
        this._store.dispatch(setPickAPlanSelectedPackageInfoForDataLayer());
        this._store
            .pipe(
                select(getCreateAccountFormSubmitted),
                take(1),
                switchMap((formSubmitted) => {
                    if (!formSubmitted) {
                        this.loadingSubmission = true;
                        this.unexpectedError = false;
                        const { serviceAddressSame, serviceAddress, paymentInfo } = this.form.value;
                        this.address = !serviceAddressSame
                            ? {
                                  addressLine1: paymentInfo.address,
                                  city: paymentInfo.city,
                                  state: paymentInfo.state,
                                  zip: paymentInfo.zip,
                              }
                            : {
                                  addressLine1: serviceAddress.address,
                                  city: serviceAddress.city,
                                  state: serviceAddress.state,
                                  zip: serviceAddress.zip,
                              };
                        return this._customerValidationAddressesWorkFlowService.build({
                            serviceAddress: {
                                ...this.address,
                            },
                        });
                    } else {
                        return of(null);
                    }
                })
            )
            .subscribe({
                next: (results) => {
                    if (!results) {
                        this._store.dispatch(saveCreateAccountFormData({ ...this.form.value }));
                        this._router.navigateByUrl('/activate/trial/rtp/review');
                    } else if (results?.serviceAddress?.addressCorrectionAction === AddressCorrectionAction.AutoCorrect) {
                        this.addressNeedsModification = false;
                        this._store.dispatch(saveCreateAccountFormData({ ...this.form.value }));
                        this._navigateToReviewStep();
                    } else {
                        this.showInvalidAddressError = false;
                        this.addressNeedsModification = true;
                        this.avsInfo = {
                            ...results.serviceAddress,
                            currentAddress: this.address,
                        };
                    }
                },
                error: (error) => {
                    this.unexpectedError = true;
                    this.loadingSubmission = false;
                    const errorCode = error?.error?.error?.fieldErrors[0]?.errorCode;
                    errorCode === 'ZipCode' && this._handleZipCodeError();
                },
            });
    }

    proceedWithCorrectedAddress(correctedAddress: any) {
        this.addressNeedsModification = false;
        this.correctedAddress = correctedAddress;

        this._store.dispatch(
            saveCreateAccountFormData({
                ...this.form.value,
                correctedAddress,
            })
        );

        this._navigateToReviewStep();
    }

    private _dismissAddressVerificationDialog() {
        this.correctedAddress = null;
        this.loadingSubmission = false;
        this.addressNeedsModification = false;
    }

    private _handleZipCodeError() {
        if (this.form.get(['paymentInfo', 'serviceAddressSame']).value) {
            this.form.get(['paymentInfo', 'zip']).setErrors({ incorrect: true });
        } else {
            this.form.get(['serviceAddress', 'zip']).setErrors({ incorrect: true });
        }
    }

    onEditExistingAddress() {
        this._dismissAddressVerificationDialog();
        this._store.dispatch(setAddressEditionRequired());
    }

    modalClosed() {
        this._dismissAddressVerificationDialog();
    }

    genreModalClosed() {
        this.showGenreModal = false;
    }

    leadOfferGenreModalClosed() {
        this.showLeadOfferGenreModal = false;
    }

    onSelectedPackage(renewalPackageName: string) {
        // Store the renewal package name in state
        this._store.dispatch(setSelectedRenewalPackageName({ selectedRenewalPackageName: renewalPackageName }));
    }

    onSelectedLeadOfferPackage(packageName: string): void {
        this.selectedLeadOfferPackageName = packageName;
        this.isSelectedLeadOfferNotChoice$.next(packageName.search('CHOICE') === -1);
    }

    onPlanComparisonContinue() {
        // Navigate to step Review Step from NOUV Plan Grid in No Choice or Choice and selected package, otherwise opens Genre selection modal
        this.renewalPackageIsChoice$.pipe(take(1)).subscribe((renewalPackageIsChoice) => {
            if ((renewalPackageIsChoice && this.genreIsSelected) || !renewalPackageIsChoice) {
                this._validateAddress();
            } else if (renewalPackageIsChoice) {
                this._openGenresSelectionModal();
                this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'Overlay:chooseGenre' }));
            }
        });
    }

    onLeadOfferPlanComparisonGridContinue(): void {
        if (this.selectedLeadOfferPackageName?.search('CHOICE') !== -1) {
            this.showLeadOfferGenreModal = true;
            this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'Overlay:chooseGenre' }));
        } else {
            this.setSelectedLeadOfferGenre(this.selectedLeadOfferPackageName);
        }
    }

    private _openGenresSelectionModal() {
        this.showGenreModal = true;
    }

    setSelectedGenre(renewalPackageName: string): void {
        this._store.dispatch(setSelectedRenewalPackageName({ selectedRenewalPackageName: renewalPackageName }));
        this._validateAddress();
        this.showGenreModal = false;
    }

    setSelectedLeadOfferGenre(packageName: string): void {
        this._store.dispatch(setSelectedLeadOfferByPackageName({ packageName }));
        this._validateAddress();
        this.showLeadOfferGenreModal = false;
    }
}
