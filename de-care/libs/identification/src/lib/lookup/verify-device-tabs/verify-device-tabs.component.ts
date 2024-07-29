import { Component, OnInit, Input, Output, EventEmitter, ViewChild, Inject, OnDestroy, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import {
    RadioModel,
    DataAccountService,
    AccountModel,
    SubscriptionModel,
    DataLayerDataTypeEnum,
    FlowNameEnum,
    ComponentNameEnum,
    AuthenticationTypeEnum,
    CustomerInfoData,
    ClosedDeviceModel,
    IdentityFlepzRequestModel,
    ErrorTypeEnum,
    VehicleModel,
    DataOfferService,
    getPlatformFromPackageName,
    AccountVerify,
    OfferModel,
    UpsellRequestData,
    packagesAreOnDifferentPlatforms,
    packagePlatformIsSirius,
    packageTypeIsSelect,
    getStateFromAccount,
    PackageModel,
} from '@de-care/data-services';
import { SxmUiTabsComponent, TabInfo } from '@de-care/shared/sxm-ui/ui-tabs';
import { SxmUiModalComponent } from '@de-care/shared/sxm-ui/ui-modal';
import { LookupLicensePlateSelectedVin } from '../../radio/lookup-license-plate/lookup-license-plate.component';
import { ConfirmVinInputData } from '../../radio/confirm-vin/confirm-vin.component';
import { SharedFlepzFormFlepzInfo, FlepzFormSearchErrors, ErrorMsgAlternativeLookupLinkData } from '../../flepz/flepz-form/flepz-form.component';
import { SharedYourInfoAccount, YourInfoComponent } from '../your-info/your-info.component';
import { DataLayerService, FrontEndErrorModel, FrontEndErrorEnum } from '@de-care/data-layer';
import { ActiveSubscriptionInfo } from '../../subscription/active-subscription/active-subscription.component';

import { map, takeUntil } from 'rxjs/operators';
import { PlatformChangeInfo, CurrentPlan, RequestModalPayload, PlanDetails, PlatformChangeAcceptance } from '@de-care/offers';
import { Observable, Subject, of, combineLatest } from 'rxjs';
import { SettingsService, UserSettingsService } from '@de-care/settings';
import { MarketingPromoFormInfo } from '../../flepz/marketing-promo-code/marketing-promo-code.component';
import { TranslateService } from '@ngx-translate/core';
import { IdentificationModeService } from './identification-mode.service';
import { buildAndJoinTranslation, findComponentTranslationProperties, initiateTranslationOverride, TranslationOverrides } from '@de-care/app-common';
import { NonPiiLookupWorkflow } from '@de-care/data-workflows';
import { Store } from '@ngrx/store';
import {
    behaviorEventReactionLookupByLoginSuccess,
    behaviorEventReactionLookupByAccountNumberAndRadioIdSuccess,
    behaviorEventReactionLookupByFlepzSuccess,
    behaviorEventReactionCustomerInfoAuthenticationType,
    behaviorEventImpressionForPage,
} from '@de-care/shared/state-behavior-events';
import { RadioLookupOptionsComponentValues } from '../../flepz/radio-lookup-options/radio-lookup-options.component';
import { LookupRadioIdSelectedData } from '../../radio/lookup-radio-id/lookup-radio-id.component';
import { LookupVinSelectedData } from '../../radio/lookup-vin/lookup-vin.component';
import * as uuid from 'uuid/v4';

export type Tabs = 'account-info' | 'car-info' | 'radio-info' | 'vin-info' | 'radio-id-info';

export enum VerifyDeviceModals {
    RadioModal = 'radioModal',
    VinModal = 'vinModal',
    LicensePlateModal = 'licensePlateModal',
    VinErrorModal = 'vinErrorModal',
    RadioLookupOptionsModal = 'radioLookupOptionsModal',
    ConfirmVinModal = 'confirmVinModal',
    ValidateInfoModal = 'validateInfoModal',
    LoginModal = 'loginModal',
    YourInfoModal = 'yourInfoModal',
    ActiveSubscriptionModal = 'activeSubscriptionModal',
    PlatformChangeModal = 'platformChangeModal',
    RadioNoMatchModal = 'radioNoMatchModal',
    deviceHelpModal = 'deviceHelpModal',
    PlatformUpgradeOptionModal = 'platformUpgradeOptionModal',
}

export interface SharedVerifyDeviceUserSelection {
    selectedAccount: AccountModel;
    selectedAccountNumber: string;
    selectedRadio: RadioModel | ClosedDeviceModel;
    platformChanged: boolean;
    radioOffer: OfferModel;
    deferredUpsell?: boolean;
}

export interface PrefilledAccountData {
    firstName?: string;
    lastName?: string;
}

const verifyDeviceTabsTranslationKeys = ['ACCOUNT_INFO', 'CAR_INFO', 'YOUR_INFO', 'RADIO_INFO'];
const buttonTranslationTranslationKeys = ['BUTTON'];

export const accountInfoTabDataAttr = 'AccountIdInfoLink';
export const flepzCarInfoTabDataAttr = 'FlepzCarInfoLink';
export const flepzYourInfoTabDataAttr = 'FlepzYourInfoLink';

export interface VerifyDeviceTabsComponentApi {
    prefillVinLookup(vin: string): void;
    prefillRadioIdLookup(radioId: string): void;
}

@Component({
    selector: 'verify-device-tabs',
    templateUrl: './verify-device-tabs.component.html',
    styleUrls: ['./verify-device-tabs.component.scss'],
})
export class VerifyDeviceTabsComponent implements VerifyDeviceTabsComponentApi, OnChanges, OnInit, OnDestroy {
    @Input() upsellCode: string;
    @Input() leadOfferPackageName: string;
    @Input() programCode: string;
    @Input() marketingPromoCode: string;
    @Input() excludeInstructionsText = false;
    @Input() prefilledAccountData: PrefilledAccountData;
    @Input() isProspectTrial = false;
    @Input() showHeadingText = true;
    @Input() showMarketingPromoCode = true;
    @Input() tabsToShowOverride: Tabs[];
    @Input() translationOverrides: TranslationOverrides;
    @Input() checkPlatFormChange: boolean = true;
    @Input() isPromoCodeValid: boolean = false;
    @Input() isOfferNotAvailable: boolean = true;
    @Input() closeModalsOnFinished = true;
    @Input() hideTabNav = false;
    @Input() nflOptInEnabled = false;
    @Output() userSelection = new EventEmitter<SharedVerifyDeviceUserSelection>();
    @Output() upsellSelected = new EventEmitter<PackageModel>();
    @Output() marketingPromoRedeemed = new EventEmitter<string>();
    @Output() marketingPromoCodeRemoved = new EventEmitter();
    @Output() radioSelectionStarted = new EventEmitter();
    @Output() platformChangeModalContentLoaded = new EventEmitter();
    @Output() loginError = new EventEmitter();
    @ViewChild(SxmUiTabsComponent) private readonly _sxmUiTabsComponent: SxmUiTabsComponent;
    @ViewChild('radioModal', { static: true }) radioModal: SxmUiModalComponent;
    @ViewChild('vinModal', { static: true }) vinModal: SxmUiModalComponent;
    @ViewChild('licensePlateModal', { static: true }) licensePlateModal: SxmUiModalComponent;
    @ViewChild('vinErrorModal', { static: true }) vinErrorModal: SxmUiModalComponent;
    @ViewChild('radioLookupOptionsModal', { static: true }) radioLookupOptionsModal: SxmUiModalComponent;
    @ViewChild('confirmVinModal', { static: true }) confirmVinModal: SxmUiModalComponent;
    @ViewChild('validateInfoModal', { static: true }) validateInfoModal: SxmUiModalComponent;
    @ViewChild('loginModal', { static: true }) loginModal: SxmUiModalComponent;
    @ViewChild('yourInfoModal', { static: true }) yourInfoModal: SxmUiModalComponent;
    @ViewChild('yourInfoComponent') private _yourInfoComponent: YourInfoComponent;
    @ViewChild('activeSubscriptionModal', { static: true }) activeSubscriptionModal: SxmUiModalComponent;
    @ViewChild('platformChangeModal', { static: true }) platformChangeModal: SxmUiModalComponent;
    @ViewChild('radioNoMatchModal', { static: true }) radioNoMatchModal: SxmUiModalComponent;
    @ViewChild('deviceHelpModal', { static: true }) deviceHelpModal: SxmUiModalComponent;
    @ViewChild('platformUpgradeOptionModal', { static: true }) platformUpgradeOptionModal: SxmUiModalComponent;

    private accountNumber: string;
    platformChangeInfo: PlatformChangeInfo;
    activeSubscriptionInfo: ActiveSubscriptionInfo;
    confirmVinModalData: ConfirmVinInputData;
    radioToValidate: RadioModel | ClosedDeviceModel;
    radioToValidateIsClosed = false;
    backModalHistory: VerifyDeviceModals[];
    selectedAccount: AccountModel;
    selectedRadio: RadioModel | ClosedDeviceModel;
    selectedVehicleInfo: VehicleModel;
    sendAccount: boolean;
    subscriptions: SubscriptionModel[];
    closedRadios: ClosedDeviceModel[];
    isYourInfoAccount: boolean = false;
    accountInfo: SharedYourInfoAccount;
    flepzError: FlepzFormSearchErrors;
    userVerifyData: AccountVerify;
    includeMarketingPromoCode: boolean = false;
    marketingPromoRedeemedInfo: MarketingPromoFormInfo;
    modalTitle: string;
    upsellRequestData: UpsellRequestData;
    radioOffer: OfferModel;
    upsellDetails: PlanDetails;
    upsellPackage: PackageModel;
    offer$: Observable<any>;
    tabs: { [type in Tabs]?: TabInfo };
    isAccountInfoScenario = false;
    isCarInfoScenario = false;
    buttonTranslationOverrides: TranslationOverrides;
    signInIsLoading = false;
    isCanadaMode = false;
    errorMsgAlternativeLookupLinkData$: Observable<ErrorMsgAlternativeLookupLinkData>;
    activeLastNameField = false;
    radioIdFromUrl: string;

    provinceLabel: string = '';
    private _unsubscribe: Subject<void> = new Subject();
    prefilledVin: string;
    prefilledRadioId: string;
    isNFLOptInChecked = false;
    tabsHeadingTextKey: 'DEFAULT' | 'ACCOUNT_INFO_SCENARIO' | 'RADIO_ID_SCENARIO' | 'VIN_SCENARIO' = 'DEFAULT';
    radioNoMatchModalAriaDescribedbyTextId = uuid();
    confirmVinModalAriaDescribedbyTextId = uuid();
    lookupLicensePlateModalAriaDescribedbyTextId = uuid();
    lookupRadioIdModalAriaDescribedbyTextId = uuid();
    lookupVinModalAriaDescribedbyTextId = uuid();
    validateUserRadioModalAriaDescribedbyTextId = uuid();
    deviceHelpModalAriaDescribedbyTextId = uuid();
    vinErrorModalAriaDescribedbyTextId = uuid();

    get VerifyDeviceModals() {
        return VerifyDeviceModals;
    }

    constructor(
        private _dataAccount: DataAccountService,
        private readonly _store: Store,
        private _nonPiiSrv: NonPiiLookupWorkflow,
        private _dataLayerSrv: DataLayerService,
        private _dataOfferService: DataOfferService,
        @Inject(DOCUMENT) private readonly _document: Document,
        private _settingsService: SettingsService,
        private _userSettingsService: UserSettingsService,
        private _translateService: TranslateService,
        private _identificationModeService: IdentificationModeService,
        private _changeDetectorRef: ChangeDetectorRef
    ) {}

    prefillVinLookup(vin: string): void {
        this.prefilledVin = vin;
        this._sxmUiTabsComponent.selectTab(this.tabs['vin-info']);
    }

    prefillRadioIdLookup(radioId: string): void {
        this.prefilledRadioId = radioId;
        this._sxmUiTabsComponent.selectTab(this.tabs['radio-id-info']);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.translationOverrides && changes.translationOverrides.currentValue !== changes.translationOverrides.previousValue) {
            const verifyDeviceTabsOverrides = findComponentTranslationProperties(this.translationOverrides, verifyDeviceTabsTranslationKeys);
            this.buttonTranslationOverrides = findComponentTranslationProperties(this.translationOverrides, buttonTranslationTranslationKeys);

            if (verifyDeviceTabsOverrides) {
                initiateTranslationOverride(verifyDeviceTabsOverrides).map((flatTranslation) =>
                    flatTranslation
                        .map(buildAndJoinTranslation('identification', 'verifyDeviceTabsComponent'))
                        .forEach(({ locale, translation }) => this._translateService.setTranslation(locale, translation, true))
                );
            }
        }
        if (changes.tabsToShowOverride && changes.tabsToShowOverride.currentValue !== changes.tabsToShowOverride.previousValue) {
            this._initTabs();
            this.clearModalHistory();
        }
    }

    ngOnInit() {
        this.activeLastNameField = this._identificationModeService.getActiveLastNameField();
        this.radioIdFromUrl = this._identificationModeService.getRadioIdValue();
        this.isCanadaMode = this._settingsService.isCanadaMode;
        this._initTabs();
        this._getTranslatedErrorMsgForAlternativeLookup();
        this.clearModalHistory();
        if (this._settingsService.isCanadaMode) {
            this._userSettingsService.isQuebec$.pipe(takeUntil(this._unsubscribe)).subscribe((isQuebec) => {
                this.provinceLabel = isQuebec ? 'QC' : '';
            });
            this.onInitMarketingPromoCode();
        }
    }

    ngOnDestroy() {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    private _mapTabs(tab, index, isSelected): TabInfo {
        const tabInfo: TabInfo = {
            id: tab,
            qaTag: '',
            index,
            isSelected,
        };

        switch (tab) {
            case 'radio-info':
                tabInfo.qaTag = accountInfoTabDataAttr;
                break;
            case 'car-info':
                tabInfo.qaTag = flepzCarInfoTabDataAttr;
                break;
            case 'account-info':
                tabInfo.qaTag = flepzYourInfoTabDataAttr;
                break;
        }

        return tabInfo;
    }

    private _initTabs(): void {
        let tabInfoSet: TabInfo[];

        tabInfoSet = this.tabsToShowOverride
            ? this.tabsToShowOverride.map((tab, index) => this._mapTabs(tab, index, index === 0))
            : this._identificationModeService
                  .getIdentificationModes()
                  .map<TabInfo>((identificationMode, index) => this._mapTabs(identificationMode.type, index, identificationMode.isSelected));

        this.tabs = tabInfoSet.reduce<{ [type: string]: TabInfo }>((all, current) => {
            all[current.id] = { ...current };
            return all;
        }, {});

        this.isAccountInfoScenario = !!this.tabs['radio-info'];
        this.isCarInfoScenario = !!this.tabs['car-info'];
        if (!!this.tabs['radio-id-info']) {
            this.tabsHeadingTextKey = 'RADIO_ID_SCENARIO';
        } else if (!!this.tabs['vin-info']) {
            this.tabsHeadingTextKey = 'VIN_SCENARIO';
        } else if (!!this.tabs['radio-info']) {
            this.tabsHeadingTextKey = 'ACCOUNT_INFO_SCENARIO';
        } else {
            this.tabsHeadingTextKey = 'DEFAULT';
        }
    }

    private _getTranslatedErrorMsgForAlternativeLookup(): void {
        const msgKeyBase: string = 'identification.verifyDeviceTabsComponent';
        let alternativeLookupId: string = null;
        let lookupLinkText$ = of(null);
        let lookupLinkDesc$ = of(null);

        if (this.isCarInfoScenario) {
            alternativeLookupId = 'car-info';
            lookupLinkText$ = this._translateService.stream(`${msgKeyBase}.NO_RADIO_CAR_INFO_TAB_LINK_TEXT`);
            lookupLinkDesc$ = this._translateService.stream(`${msgKeyBase}.NO_RADIO_CAR_INFO_TAB_LINK_DESC`);
        } else if (this.isAccountInfoScenario) {
            alternativeLookupId = 'radio-info';
            lookupLinkText$ = this._translateService.stream(`${msgKeyBase}.NO_RADIO_ACCOUNT_INFO_TAB_LINK_TEXT`);
            lookupLinkDesc$ = this.activeLastNameField
                ? this._translateService.stream(`${msgKeyBase}.NO_RADIO_ACCOUNT_INFO_TAB_LINK_DESC_LN`)
                : this._translateService.stream(`${msgKeyBase}.NO_RADIO_ACCOUNT_INFO_TAB_LINK_DESC`);
        }

        const hasLink$ = of(this.isCarInfoScenario || this.isAccountInfoScenario);
        const lookupId$ = of(alternativeLookupId);

        this.errorMsgAlternativeLookupLinkData$ = combineLatest(
            hasLink$,
            lookupLinkText$,
            lookupLinkDesc$,
            lookupId$,
            (hasLookupLink, lookupLinkText, lookupLinkDesc, lookupId) => {
                return {
                    hasAlternativeLookupLink: hasLookupLink,
                    alternativeLookupLinkText: lookupLinkText,
                    alternativeLookupLinkDesc: lookupLinkDesc,
                    alternativeLookupId: lookupId,
                };
            }
        );
    }

    onTabSelected(tabInfo: TabInfo): void {
        this.clearModalHistory();
    }

    resetAuthenticationType() {
        this._store.dispatch(behaviorEventReactionCustomerInfoAuthenticationType({ authenticationType: AuthenticationTypeEnum.Flepz }));
        this._store.dispatch(behaviorEventImpressionForPage({ pageKey: FlowNameEnum.Authenticate, componentKey: ComponentNameEnum.FlepzSearch }));
    }

    useYourLoginInfo($event: MouseEvent) {
        $event.preventDefault();
        this.openModal(VerifyDeviceModals.LoginModal);
    }

    platformChangeAccepted(acceptance?: PlatformChangeAcceptance): void {
        this.closeModalsOnFinished && this.closeAllModals();
        this._applyUserSelection(acceptance?.deferredUpsell);
    }

    createNewAccount(): void {
        this.radioSelectionStarted.emit();

        this.selectedAccount = {
            subscriptions: [
                {
                    radioService: {
                        last4DigitsOfRadioId: this.radioToValidate.last4DigitsOfRadioId,
                        id: '',
                        vehicleInfo: { ...this.radioToValidate.vehicleInfo },
                    },
                    id: '',
                    plans: [],
                },
            ],
            accountProfile: {
                accountRegistered: false,
            },
            closedDevices: [],
            billingSummary: {
                creditCard: null,
            },
            isNewAccount: true,
        } as AccountModel;
        this.sendAccount = true;
        this.selectedRadio = this.radioToValidate;
        if (this.checkPlatFormChange) {
            this._checkOfferPlatform(this.selectedRadio, this.programCode, this.leadOfferPackageName, this.selectedAccount).subscribe((platformChangeInfo) => {
                if (platformChangeInfo) {
                    this.platformChangeInfo = {
                        ...platformChangeInfo,
                    };
                    this._closeExistingModalThenOpen(VerifyDeviceModals.PlatformChangeModal);
                } else {
                    this.platformChangeInfo = null;
                    this._applyUserSelection();
                }
            });
        } else {
            this.platformChangeInfo = null;
            this._applyUserSelection();
        }
    }

    onSelectedRadio(radio: RadioModel | ClosedDeviceModel, sendAccount: boolean = false) {
        this.selectedRadio = radio;
        this.sendAccount = sendAccount;
        if (this.selectedAccount.subscriptions && this._dataAccount.accountHasActiveSubscription(this.selectedAccount.subscriptions[0])) {
            if (this.closeModalsOnFinished) {
                this.completeYourInfoLoading();
                this._closeExistingModal();
                this.handleSelectedAccountAndRadio(this.selectedRadio, this.selectedAccount);
            }
            return;
        } else {
            this.radioSelectionStarted.emit();
        }

        if (this.checkPlatFormChange) {
            this._checkOfferPlatform(this.selectedRadio, this.programCode, this.leadOfferPackageName, this.selectedAccount).subscribe((platformChangeInfo) => {
                if (platformChangeInfo) {
                    this.platformChangeInfo = {
                        ...platformChangeInfo,
                    };
                    this.completeYourInfoLoading();
                    this._closeExistingModalThenOpen(VerifyDeviceModals.PlatformChangeModal);
                } else {
                    this.platformChangeInfo = null;
                    this._applyUserSelection();
                    if (this.closeModalsOnFinished) {
                        this.completeYourInfoLoading();
                        this._closeExistingModal();
                    }
                }
            });
        } else {
            this.platformChangeInfo = null;
            this._applyUserSelection();
            if (this.closeModalsOnFinished) {
                this.completeYourInfoLoading();
                this._closeExistingModal();
            }
        }
    }

    completeYourInfoLoading(): void {
        if (this._yourInfoComponent) {
            this._yourInfoComponent.loading = false;
        }
    }

    private _checkOfferPlatform(radio: RadioModel | ClosedDeviceModel, programCode: string, leadOfferPackageName: string, selectedAccount: AccountModel) {
        let offersQuery$: Observable<OfferModel>;
        let marketingPromoCode = (this.marketingPromoRedeemedInfo && this.marketingPromoRedeemedInfo.promoCode) || undefined;
        if (!marketingPromoCode) {
            marketingPromoCode = this.marketingPromoCode;
        }
        const offersQueryData = {
            radioId: radio.last4DigitsOfRadioId,
            programCode: programCode,
            marketingPromoCode,
        };

        if (selectedAccount.isNewAccount) {
            offersQuery$ = this._dataOfferService.customer(offersQueryData);
        } else {
            offersQuery$ = this._dataOfferService.customer(offersQueryData);
        }

        return offersQuery$.pipe(
            map((offer) => {
                this.radioOffer = offer;
                const customerOffer = offer.offers[0];
                if (
                    customerOffer &&
                    leadOfferPackageName &&
                    packagesAreOnDifferentPlatforms(customerOffer.packageName, leadOfferPackageName) &&
                    packagePlatformIsSirius(customerOffer.packageName) &&
                    packageTypeIsSelect(leadOfferPackageName)
                ) {
                    const subscription = selectedAccount.subscriptions[0];
                    const currentSubscription = {
                        radio: {
                            vehicleInfo: radio.vehicleInfo
                                ? {
                                      year: +radio.vehicleInfo.year,
                                      make: radio.vehicleInfo.make,
                                      model: radio.vehicleInfo.model,
                                  }
                                : null,
                        },
                        plans: [],
                    };
                    if (subscription && subscription.plans && subscription.plans.length > 0) {
                        currentSubscription.radio = {
                            vehicleInfo:
                                subscription.radioService && subscription.radioService.vehicleInfo
                                    ? {
                                          year: +subscription.radioService.vehicleInfo.year,
                                          make: subscription.radioService.vehicleInfo.make,
                                          model: subscription.radioService.vehicleInfo.model,
                                      }
                                    : null,
                        };
                        for (const plan of subscription.plans) {
                            const currentPlan: CurrentPlan = {
                                type: plan.type,
                                endDate: plan.endDate,
                                packageName: plan.packageName,
                            };
                            currentSubscription.plans.push(currentPlan);
                        }
                    } else if (selectedAccount.closedDevices && selectedAccount.closedDevices.length > 0) {
                        const closedDevice = selectedAccount.closedDevices[0];
                        currentSubscription.plans.push({
                            endDate: closedDevice.closedDate,
                        });
                        if (closedDevice.vehicleInfo) {
                            currentSubscription.radio = {
                                vehicleInfo: {
                                    year: +closedDevice.vehicleInfo.year,
                                    make: closedDevice.vehicleInfo.make,
                                    model: closedDevice.vehicleInfo.model,
                                },
                            };
                        }
                    }
                    return {
                        currentSubscription,
                        platformChangePlan: {
                            platform: getPlatformFromPackageName(customerOffer.packageName),
                            packageName: customerOffer.packageName,
                            offerType: customerOffer.type,
                            dealType: customerOffer.deal ? customerOffer.deal.type : undefined,
                            leadOfferPackageName,
                            termLength: customerOffer.termLength,
                        },
                        customerOfferPlanCode: customerOffer.planCode,
                    };
                } else {
                    return null;
                }
            })
        );
    }

    private _applyUserSelection(deferredUpsell: boolean = true): void {
        this.userSelection.emit({
            selectedAccount: this.sendAccount ? this.selectedAccount : null,
            selectedRadio: this.selectedRadio,
            selectedAccountNumber: this.accountNumber,
            platformChanged: !!this.platformChangeInfo,
            radioOffer: this.radioOffer,
            deferredUpsell,
        });
    }

    onSelectedLookupRadioIdData(data: LookupRadioIdSelectedData) {
        this.closeModal(VerifyDeviceModals.RadioModal);
        this.handleSelectedAccountAndRadio(data.selectedRadio, data.selectedAccount);
    }

    onSelectedLookupVinData(data: LookupVinSelectedData) {
        this.closeModal(VerifyDeviceModals.VinModal);
        this.handleSelectedAccountAndRadio(data.selectedRadio, data.selectedAccount);
    }

    handleSelectedAccountAndRadio(selectedRadio: RadioModel, selectedAccount: AccountModel) {
        this.onSelectedAccount(selectedAccount);
        const currentSubscription = selectedAccount.subscriptions?.[0];
        if (currentSubscription && this._dataAccount.accountHasActiveSubscription(currentSubscription)) {
            this.onActiveSubscriptionFound(currentSubscription);
        } else {
            this.validateUserInfo(selectedRadio);
        }
    }

    onSelectedAccount(account: AccountModel & { last4DigitsOfAccountNumber?: string }) {
        this.accountNumber = account.last4DigitsOfAccountNumber;
        this.selectedAccount = account;
    }

    onRadioLookupSentValue(selectedValue: RadioLookupOptionsComponentValues) {
        switch (selectedValue) {
            case RadioLookupOptionsComponentValues.Radio:
                this.openModal(VerifyDeviceModals.RadioModal);
                break;
            case RadioLookupOptionsComponentValues.Vin:
                this.openModal(VerifyDeviceModals.VinModal);
                break;
            case RadioLookupOptionsComponentValues.LicencePlate:
                this.openModal(VerifyDeviceModals.LicensePlateModal);
                break;
        }
    }

    openModal(modal: VerifyDeviceModals, saveHistory = true) {
        const customerInfoObj: CustomerInfoData = this._dataLayerSrv.getData(DataLayerDataTypeEnum.CustomerInfo) || {};
        const flowName: FlowNameEnum = FlowNameEnum.Authenticate;
        let componentName: ComponentNameEnum = null;

        this[modal].open();
        if (saveHistory) {
            this.backModalHistory.push(modal);
        }

        switch (modal) {
            case VerifyDeviceModals.LoginModal:
                componentName = ComponentNameEnum.Login;
                customerInfoObj.authenticationType = AuthenticationTypeEnum.Login;
                break;
            case VerifyDeviceModals.RadioModal:
                componentName = ComponentNameEnum.EnterRID;
                customerInfoObj.authenticationType = AuthenticationTypeEnum.RadioID;
                break;
            case VerifyDeviceModals.VinModal:
                componentName = ComponentNameEnum.EnterVIN;
                customerInfoObj.authenticationType = AuthenticationTypeEnum.VIN;
                break;
            case VerifyDeviceModals.LicensePlateModal:
                componentName = ComponentNameEnum.EnterLicensePlate;
                customerInfoObj.authenticationType = AuthenticationTypeEnum.LicensePlateLookup;
                break;
            case VerifyDeviceModals.ConfirmVinModal:
                componentName = ComponentNameEnum.ConfirmVIN;
                break;
            case VerifyDeviceModals.VinErrorModal:
                componentName = ComponentNameEnum.ErrorRIDVIN;
                this._dataLayerSrv.buildErrorInfo(new FrontEndErrorModel(ErrorTypeEnum.User, FrontEndErrorEnum.EventInvalidVINLookup));
                break;
            case VerifyDeviceModals.YourInfoModal:
                if (this.subscriptions && this.subscriptions.length > 0) {
                    if (this.subscriptions.length > 1) {
                        componentName = ComponentNameEnum.MultipleRadio;
                    } else {
                        componentName = ComponentNameEnum.OneRadio;
                    }
                }
                break;
            case VerifyDeviceModals.ValidateInfoModal:
                componentName = ComponentNameEnum.VerifyCustomer;
                break;
            case VerifyDeviceModals.RadioLookupOptionsModal:
                componentName = ComponentNameEnum.DontSeeYourRadio;
                break;
            case VerifyDeviceModals.ActiveSubscriptionModal:
                componentName = ComponentNameEnum.ActiveSubscription;
                break;
            case VerifyDeviceModals.PlatformChangeModal:
                componentName = ComponentNameEnum.IneligibleRadio;
                break;
            case VerifyDeviceModals.RadioNoMatchModal:
                componentName = ComponentNameEnum.NoMatchRadio;
                break;
            default:
                componentName = null;
                break;
        }

        this._dataLayerSrv.update(DataLayerDataTypeEnum.CustomerInfo, customerInfoObj);
        if (componentName) {
            this._dataLayerSrv.updateAndSendPageTrackEvent(DataLayerDataTypeEnum.PageInfo, componentName, { flowName: flowName, componentName: componentName });
        }
    }

    closeModal(modal: VerifyDeviceModals) {
        this[modal].close();
    }

    onValidUserInfo(sendAccount: boolean = false, verifiedAccountData: AccountModel) {
        this.selectedAccount = { ...this.selectedAccount, lastName: verifiedAccountData.lastName };
        this.onSelectedRadio(this.radioToValidate, sendAccount);
    }

    onInvalidUserInfo(verifyInfo: AccountVerify) {
        this.userVerifyData = {
            lastName: verifyInfo.lastName,
            phoneNumber: verifyInfo.phoneNumber,
            zipCode: verifyInfo.zipCode,
        };
        if (this.selectedAccount) {
            const subscription = this.selectedAccount.subscriptions[0];
            if (subscription && subscription.radioService && subscription.radioService.vehicleInfo) {
                this.selectedVehicleInfo = {
                    year: subscription.radioService.vehicleInfo.year,
                    make: subscription.radioService.vehicleInfo.make,
                    model: subscription.radioService.vehicleInfo.model,
                };
            } else if (this.selectedAccount.closedDevices && this.selectedAccount.closedDevices.length > 0 && this.selectedAccount.closedDevices[0].vehicleInfo) {
                const closedDevice = this.selectedAccount.closedDevices[0];
                this.selectedVehicleInfo = {
                    year: closedDevice.vehicleInfo.year,
                    make: closedDevice.vehicleInfo.make,
                    model: closedDevice.vehicleInfo.model,
                };
            }
            this._dataAccount.sanitizeVehicleInfo(this.selectedVehicleInfo);
        }
        this._closeExistingModalThenOpen(VerifyDeviceModals.RadioNoMatchModal);
    }

    validateUserInfo(radio: RadioModel) {
        this.radioToValidate = radio;
        this.radioToValidateIsClosed = this.selectedAccount && !this._hasNoClosedRadio(this.selectedAccount);
        this.openModal(VerifyDeviceModals.ValidateInfoModal);
    }

    onValidateUserModalClose(): void {
        this.radioToValidate = null;
    }

    clearModalHistory(): void {
        this.backModalHistory = [];
    }

    modalHistoryBack(): void {
        const latestModalOpened = this.backModalHistory.pop();
        if (latestModalOpened) {
            this.closeModal(latestModalOpened);
        }
        const previousModal = this.backModalHistory[this.backModalHistory.length - 1];
        if (previousModal) {
            this.openModal(previousModal, false);
        }
    }

    onSelectedLicensePlateVin(vinData: LookupLicensePlateSelectedVin): void {
        const subscription = vinData.account.subscriptions && vinData.account.subscriptions.length > 0 ? vinData.account.subscriptions[0] : null;

        if (this._dataAccount.accountHasActiveSubscription(subscription)) {
            this.onActiveSubscriptionFound(subscription);
            return;
        }

        this.accountNumber = null;
        this.selectedAccount = vinData.account;
        let last4DigitsOfRadioId: string;
        let vehicleInfo: VehicleModel = null;

        const closedDevice = vinData.account.closedDevices && vinData.account.closedDevices.length > 0 ? vinData.account.closedDevices[0] : null;
        if (subscription && subscription.radioService) {
            const radioService = subscription.radioService;
            last4DigitsOfRadioId = radioService.last4DigitsOfRadioId;
            vehicleInfo = radioService.vehicleInfo;
            this.radioToValidate = radioService;
            this.radioToValidateIsClosed = false;
        } else if (closedDevice) {
            last4DigitsOfRadioId = closedDevice.last4DigitsOfRadioId;
            vehicleInfo = closedDevice.vehicleInfo;
            const closedDeviceSubscription: SubscriptionModel = closedDevice.subscription;
            this.radioToValidate = {
                id: null,
                closedDate: null,
                last4DigitsOfRadioId,
                vehicleInfo,
                subscription: closedDeviceSubscription,
            };
            this.radioToValidateIsClosed = true;
        }
        this.confirmVinModalData = {
            vinNumber: vinData.vinNumber,
            state: vinData.state,
            licensePlate: vinData.licensePlate,
            last4DigitsOfRadioId,
            vehicleInfo,
        };
        this.closeModal(VerifyDeviceModals.LicensePlateModal);
        this.openModal(VerifyDeviceModals.ConfirmVinModal, false);
    }

    private _hasNoClosedRadio(accountResponse): boolean {
        return !accountResponse.closedDevices || accountResponse.closedDevices.length === 0;
    }

    private _hasNoActiveRadio(accountResponse): boolean {
        return (
            !accountResponse.subscriptions ||
            accountResponse.subscriptions.length === 0 ||
            (accountResponse.subscriptions.length > 0 && accountResponse.subscriptions.every((subscription) => !subscription.radioService))
        );
    }

    onLoginFetchedAccountNumber(account: string): void {
        this._store.dispatch(behaviorEventReactionLookupByLoginSuccess());
        this.signInIsLoading = true;
        this._nonPiiSrv
            .build({
                accountNumber: account,
            })
            .subscribe((accountResponse) => {
                this._changeDetectorRef.markForCheck();
                this.signInIsLoading = false;

                this.closeModal(VerifyDeviceModals.LoginModal);
                if (this._hasNoClosedRadio(accountResponse) && this._hasNoActiveRadio(accountResponse)) {
                    this.flepzError = FlepzFormSearchErrors.NoRadiosOnAccount;
                } else if (this._dataAccount.accountHasActiveSubscription(accountResponse.subscriptions[0])) {
                    this._openActiveSubscriptionModal(accountResponse.subscriptions[0], undefined, true);
                } else {
                    this.selectedAccount = accountResponse;
                    this.closedRadios = accountResponse.closedDevices;
                    this.subscriptions = this.selectedAccount.subscriptions;
                    this.isYourInfoAccount = true;
                    this.modalTitle = 'identification.lookupRadioIdComponent.INFO_LOOKUP_LABEL';
                    this.accountInfo = {
                        firstName: accountResponse.firstName,
                    };
                    this.accountNumber = account;
                    this.openModal(VerifyDeviceModals.YourInfoModal);
                }
            });
    }

    onLoginError() {
        this.loginError.emit();
    }

    onSelectedFlepzInfo(flepzInfo: SharedFlepzFormFlepzInfo): void {
        this._store.dispatch(behaviorEventReactionLookupByFlepzSuccess());
        this.accountNumber = null;
        if (flepzInfo.subscriptions.length === 1 && this._dataAccount.accountHasActiveSubscription(flepzInfo.subscriptions[0])) {
            this._openActiveSubscriptionModal(flepzInfo.subscriptions[0], flepzInfo.flepz);
            return;
        }
        this.subscriptions = flepzInfo.subscriptions;
        this.accountInfo = flepzInfo.flepz;
        this.isYourInfoAccount = false;
        this.modalTitle = 'identification.lookupRadioIdComponent.RADIO_LOOKUP_LABEL';
        this.openModal(VerifyDeviceModals.YourInfoModal);
    }

    onDontSeeYourRadio() {
        this.closeModal(VerifyDeviceModals.YourInfoModal);
        this.openModal(VerifyDeviceModals.RadioLookupOptionsModal);
    }

    onSwitchAlternativeLookup() {
        this._initTabs();
        Object.keys(this.tabs).map((idx) => {
            if ((this.isCarInfoScenario && idx === 'car-info') || (this.isAccountInfoScenario && idx === 'radio-info')) {
                this.tabs[idx].isSelected = true;
            } else {
                this.tabs[idx].isSelected = false;
            }
        });
    }

    onNoAccountFound(radio: RadioModel) {
        this.radioToValidate = radio;
        this.closeModal(VerifyDeviceModals.RadioModal);
        this.createNewAccount();
    }

    onActiveSubscriptionFound(subscription: SubscriptionModel) {
        this._openActiveSubscriptionModal(subscription);
    }

    closeActiveSubscriptionModal(): void {
        this.onActiveSubscriptionModalClose();
        this.clearModalHistory();
        this.closeModal(VerifyDeviceModals.ActiveSubscriptionModal);
    }

    onActiveSubscriptionModalClose(): void {
        this.activeSubscriptionInfo = null;
    }

    onLoginRequested(): void {
        if (this._document && this._document.defaultView) {
            this._document.defaultView.location.href = this._translateService.instant('identification.verifyDeviceTabsComponent.LOGIN_LINK');
        }
    }

    onManageAccountRequested(): void {
        if (this._document && this._document.defaultView) {
            this._document.defaultView.location.href = this._translateService.instant('identification.verifyDeviceTabsComponent.MANAGE_LINK');
        }
    }

    onLookupNewRadioRequested(): void {
        this.closeModal(VerifyDeviceModals.ActiveSubscriptionModal);
        this.openModal(VerifyDeviceModals.RadioLookupOptionsModal);
    }

    onTryLicenseLookupAgain(): void {
        this.openModal(VerifyDeviceModals.LicensePlateModal);
        this.closeModal(VerifyDeviceModals.ConfirmVinModal);
    }

    onDeviceHelp(): void {
        this._closeExistingModalThenOpen(VerifyDeviceModals.deviceHelpModal);
    }

    onLicensePlateHelp(): void {
        this._closeExistingModalThenOpen(VerifyDeviceModals.LicensePlateModal);
    }

    private _openActiveSubscriptionModal(subscription: SubscriptionModel, flepz?: IdentityFlepzRequestModel, isSignedIn?: boolean): void {
        this.activeSubscriptionInfo = {
            subscription,
            flepzData: flepz,
            isSignedIn,
        };
        this._closeExistingModalThenOpen(VerifyDeviceModals.ActiveSubscriptionModal);
    }

    private _closeExistingModal(): void {
        const previousModal = this.backModalHistory[this.backModalHistory.length - 1];
        if (this[previousModal] && this[previousModal].open) {
            this[previousModal].close();
        }
    }

    private _closeExistingModalThenOpen(modal: VerifyDeviceModals): void {
        this._closeExistingModal();
        this.openModal(modal);
    }

    populateMarketingPromoCodeRedeemed(marketingPromoFormInfo: MarketingPromoFormInfo): void {
        this.marketingPromoRedeemedInfo = marketingPromoFormInfo;
        this.marketingPromoRedeemed.emit(marketingPromoFormInfo.promoCode);
    }

    onMarketingPromoCodeRemoved(): void {
        this.marketingPromoRedeemedInfo = {
            ...this.marketingPromoRedeemedInfo,
            promoCode: undefined,
            formExpand: false,
            redeemSuccess: false,
            isPromoValid: this.isPromoCodeValid,
            isCanadaMode: this._settingsService.isCanadaMode,
        };
        this.marketingPromoCodeRemoved.emit();
    }

    onInitMarketingPromoCode(): void {
        this.marketingPromoRedeemedInfo = {
            promoCode: this.isPromoCodeValid ? this.marketingPromoCode : undefined,
            formExpand: this.marketingPromoCode ? !this.isPromoCodeValid : false,
            redeemSuccess: this.isPromoCodeValid,
            isPromoValid: this.isPromoCodeValid,
            isCanadaMode: this._settingsService.isCanadaMode,
        };
    }

    openUpgradeOptionModal(payload: RequestModalPayload): void {
        this.upsellDetails = payload.details;
        this.upsellPackage = payload.package;
        this.openModal(VerifyDeviceModals.PlatformUpgradeOptionModal);
    }

    selectUpsell(upsell: PackageModel): void {
        this.upsellSelected.emit(upsell);
    }

    buyNow(): void {
        this.selectUpsell(this.upsellPackage);
        this.platformChangeAccepted();
    }

    closeAllModals(): void {
        this.backModalHistory.forEach((modal) => {
            this[modal].close();
        });
        this.clearModalHistory();
    }

    goToYourInfo(accountInfo: AccountModel & { last4DigitsOfAccountNumber?: string }): void {
        this._store.dispatch(behaviorEventReactionLookupByAccountNumberAndRadioIdSuccess());
        this.selectedAccount = accountInfo;
        this.accountNumber = accountInfo.last4DigitsOfAccountNumber;
        this.subscriptions = accountInfo.subscriptions;
        this.isYourInfoAccount = false;
        this.modalTitle = 'identification.lookupRadioIdComponent.RADIO_LOOKUP_LABEL';
        this.closedRadios = accountInfo.closedDevices;
        this.openModal(VerifyDeviceModals.YourInfoModal);
    }

    keepSelect(): void {
        this.selectUpsell(null);
        this.platformChangeAccepted();
    }

    isNFLOptInClick(value) {
        this.isNFLOptInChecked = value;
    }
}
