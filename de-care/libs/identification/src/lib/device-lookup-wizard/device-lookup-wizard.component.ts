import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { buildAndJoinTranslation, initiateTranslationOverride, TranslationOverrides } from '@de-care/app-common';
import { SettingsService } from '@de-care/settings';
import { SxmUiModalComponent } from '@de-care/shared/sxm-ui/ui-modal';
import { TranslateService } from '@ngx-translate/core';
import { RadioLookupOptionsComponentValues } from '../flepz/radio-lookup-options/radio-lookup-options.component';
import { ConfirmVinInputData } from '../radio/confirm-vin/confirm-vin.component';
import { LookupLicensePlateSelectedVin } from '../radio/lookup-license-plate/lookup-license-plate.component';
import { LookupRadioIdSelectedData } from '../radio/lookup-radio-id/lookup-radio-id.component';
import { LookupVinSelectedData } from '../radio/lookup-vin/lookup-vin.component';
import { Store } from '@ngrx/store';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import * as uuid from 'uuid/v4';

// TODO update those models once legacy stuff components are removed from this component
type AccountModel = Record<string, any>;
type AccountVerify = Record<string, any>;
type RadioModel = Record<string, any>;

export type DeviceLookupWizardAccount = AccountModel & { last4DigitsOfAccountNumber?: string };

export interface PrefilledValidateUserAccountData {
    lastName?: string;
}

export interface DeviceLookupWizardOptions {
    displayValidateUserRadioModal: boolean;
    radioLookupOptionsSubtitle?: string;
    prefilledValidateUserAccountData?: PrefilledValidateUserAccountData;
    translationOverrides?: TranslationOverrides;
}

export interface DeviceLookupWizardOutput {
    selectedAccount: DeviceLookupWizardAccount;
    selectedRadio: RadioModel;
    selectedRadioIsClosed: boolean;
    verifyInfo: AccountVerify;
}

@Component({
    selector: 'device-lookup-wizard',
    templateUrl: './device-lookup-wizard.component.html',
    styleUrls: ['./device-lookup-wizard.component.scss']
})
export class DeviceLookupWizardComponent implements OnChanges {
    readonly translateKey = 'identification.deviceLookupWizardComponent.';

    @Input() options: DeviceLookupWizardOptions = {
        displayValidateUserRadioModal: true
    };

    @Output() selectionFinished = new EventEmitter<DeviceLookupWizardOutput>();
    @Output() accountActiveSubscription = new EventEmitter<DeviceLookupWizardOutput>();
    @Output() vinError = new EventEmitter<DeviceLookupWizardOutput>();
    @Output() licencePlateError = new EventEmitter<DeviceLookupWizardOutput>();
    @Output() noAccountFound = new EventEmitter<DeviceLookupWizardOutput>();
    @Output() invalidUserRadioInfo = new EventEmitter<DeviceLookupWizardOutput>();
    @ViewChild('radioLookupOptionsModal', { static: true }) radioLookupOptionsModal: SxmUiModalComponent;
    @ViewChild('radioModal', { static: true }) radioModal: SxmUiModalComponent;
    @ViewChild('validateUserRadioModal', { static: true }) validateUserRadioModal: SxmUiModalComponent;
    @ViewChild('deviceHelpModal', { static: true }) deviceHelpModal: SxmUiModalComponent;
    @ViewChild('vinModal', { static: true }) vinModal: SxmUiModalComponent;
    @ViewChild('licensePlateModal', { static: true }) licensePlateModal: SxmUiModalComponent;
    @ViewChild('confirmVinModal', { static: true }) confirmVinModal: SxmUiModalComponent;
    @ViewChild('vinErrorModal', { static: true }) vinErrorModal: SxmUiModalComponent;

    deviceLookupWizardOutput: DeviceLookupWizardOutput = {
        selectedAccount: null,
        selectedRadio: null,
        selectedRadioIsClosed: false,
        verifyInfo: null
    };

    confirmVinModalData: ConfirmVinInputData;

    isCanadaMode = false;

    radioLookupOptionsModalAriaDescribedbyTextId = uuid();
    confirmVinModalAriaDescribedbyTextId = uuid();
    lookupLicensePlateModalAriaDescribedbyTextId = uuid();
    lookupRadioIdModalAriaDescribedbyTextId = uuid();
    lookupVinModalAriaDescribedbyTextId = uuid();
    validateUserRadioModalAriaDescribedbyTextId = uuid();
    deviceHelpModalAriaDescribedbyTextId = uuid();
    vinErrorModalAriaDescribedbyTextId = uuid();

    constructor(readonly _settingsService: SettingsService, private readonly _translateService: TranslateService, private _store: Store) {
        this.isCanadaMode = _settingsService.isCanadaMode;
    }

    open() {
        this._closeAllModals();
        this.radioLookupOptionsModal.open();
    }

    close() {
        this._closeAllModals();
    }

    ngOnChanges(changes: SimpleChanges) {
        const options = changes.options;
        if (options?.currentValue?.translationOverrides) {
            initiateTranslationOverride(this.options.translationOverrides).map(flatTranslation =>
                flatTranslation
                    .map(buildAndJoinTranslation('identification', 'deviceLookupWizardComponent'))
                    .forEach(({ locale, translation }) => this._translateService.setTranslation(locale, translation, true))
            );
        }
    }

    onRadioLookupOptionsSelectedValue(selectedValue: RadioLookupOptionsComponentValues) {
        this.radioLookupOptionsModal.close();
        switch (selectedValue) {
            case RadioLookupOptionsComponentValues.Radio:
                this.radioModal.open();
                this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'Overlay:EnterRID' }));
                break;
            case RadioLookupOptionsComponentValues.Vin:
                this.vinModal.open();
                this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'Overlay:EnterVIN' }));

                break;
            case RadioLookupOptionsComponentValues.LicencePlate:
                this.licensePlateModal.open();
                this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'Overlay:EnterLicensePlate' }));
                break;
        }
    }

    onLookupRadioIdSelectedData(data: LookupRadioIdSelectedData) {
        this.radioModal.close();
        this._handleAccountAndRadioSelect(data.selectedAccount, data.selectedRadio);
    }

    onLookupVinSelectedData(data: LookupVinSelectedData) {
        this.vinModal.close();
        this._handleAccountAndRadioSelect(data.selectedAccount, data.selectedRadio);
    }

    onSelectedRadio(radio: RadioModel) {
        this.deviceLookupWizardOutput.selectedRadio = radio;
    }

    onSelectedAccount(account: DeviceLookupWizardAccount) {
        this.deviceLookupWizardOutput.selectedAccount = account;
    }

    onValidUserInfoFromValidateUserRadio(verifiedAccountData: AccountModel) {
        this.deviceLookupWizardOutput.selectedAccount.lastName = verifiedAccountData.lastName;
    }

    onInvalidUserInfoFromValidateUserRadio(verifyInfo: AccountVerify) {
        this.deviceLookupWizardOutput.verifyInfo = verifyInfo;
        this.invalidUserRadioInfo.emit(this.deviceLookupWizardOutput);
    }

    onValidateUserBackButton() {
        this.validateUserRadioModal.close();
        this.radioModal.open();
    }

    onLookupRadioIdBackButton() {
        this.radioModal.close();
        this.radioLookupOptionsModal.open();
    }

    onRadioIdLookupNoAccountFound(radio: RadioModel) {
        this.deviceLookupWizardOutput.selectedRadio = radio;
        this.radioModal.close();
        this.noAccountFound.emit(this.deviceLookupWizardOutput);
    }

    onDeviceHelp() {
        this.radioModal.close();
        this.deviceHelpModal.open();
    }

    onDeviceHelpBackButton() {
        this.deviceHelpModal.close();
        this.radioModal.open();
    }

    onLookupVinBackButton() {
        this.vinModal.close();
        this.radioLookupOptionsModal.open();
    }

    onVinError() {
        this.vinErrorModal.open();
        this.vinError.emit(this.deviceLookupWizardOutput);
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'Overlay:ErrorVIN' }));
    }

    onVinNoAccountFound(radio: RadioModel) {
        this.vinModal.close();
        this.deviceLookupWizardOutput.selectedRadio = radio;
        this.noAccountFound.emit(this.deviceLookupWizardOutput);
    }

    onLicencePlateError() {
        this.vinErrorModal.open();
        this.licencePlateError.emit(this.deviceLookupWizardOutput);
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'Overlay:ErrorLP' }));
    }

    onLookupLicencePlateBackButton() {
        this.licensePlateModal.close();
        this.radioLookupOptionsModal.open();
    }

    onSelectedLicensePlateVin(vinData: LookupLicensePlateSelectedVin): void {
        this.licensePlateModal.close();
        this.deviceLookupWizardOutput.selectedAccount = vinData.account;
        const subscription = vinData.account.subscriptions && vinData.account.subscriptions.length > 0 ? vinData.account.subscriptions[0] : null;
        const closedDevice = vinData.account.closedDevices && vinData.account.closedDevices.length > 0 ? vinData.account.closedDevices[0] : null;
        if (subscription && subscription.radioService) {
            this.deviceLookupWizardOutput.selectedRadio = subscription.radioService;
        } else if (closedDevice) {
            this.deviceLookupWizardOutput.selectedRadioIsClosed = true;
            this.deviceLookupWizardOutput.selectedRadio = closedDevice;
        }

        this.confirmVinModalData = {
            vinNumber: vinData.vinNumber,
            state: vinData.state,
            licensePlate: vinData.licensePlate,
            last4DigitsOfRadioId: this.deviceLookupWizardOutput.selectedRadio.last4DigitsOfRadioId,
            vehicleInfo: this.deviceLookupWizardOutput.selectedRadio.vehicleInfo
        };
        this.confirmVinModal.open();
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'Overlay:ConfirmVIN' }));
    }

    vinConfirmedAction() {
        this.confirmVinModal.close();
        this._emitSelectionFinished();
    }

    vinErrorBackAction() {
        this.vinErrorModal.close();
    }

    onVinRadioIdSearch() {
        this._closeAllModals();
        this.radioModal.open();
    }

    onLookupLicencePlateAccountNotFound(radio: RadioModel) {
        this.licensePlateModal.close();
        this.deviceLookupWizardOutput.selectedRadio = radio;
        this.noAccountFound.emit(this.deviceLookupWizardOutput);
    }

    private _emitSelectionFinished() {
        this.selectionFinished.emit(this.deviceLookupWizardOutput);
    }

    private _handleAccountAndRadioSelect(selectedAccount: AccountModel, selectedRadio: RadioModel) {
        this.onSelectedAccount(selectedAccount);
        const selectedRadioIsCLosed = selectedAccount?.closedDevices.find(device => device.last4DigitsOfRadioId === selectedRadio.last4DigitsOfRadioId);
        if (selectedRadioIsCLosed) {
            this.onSelectedRadio(selectedRadioIsCLosed);
        } else {
            const foundSubscription = selectedAccount.subscriptions.find(subs => subs.radioService.last4DigitsOfRadioId === selectedRadio.last4DigitsOfRadioId);
            this.onSelectedRadio({
                ...selectedRadio,
                vehicleInfo: foundSubscription.radioService.vehicleInfo
            });
        }
        if (this.options?.displayValidateUserRadioModal) {
            this.validateUserRadioModal.open();
        } else {
            this._emitSelectionFinished();
        }
    }

    onTryLicenseLookupAgain() {
        this.confirmVinModal.close();
        this.licensePlateModal.open();
    }

    private _closeAllModals() {
        this.radioLookupOptionsModal.close();
        this.radioModal.close();
        this.validateUserRadioModal.close();
        this.deviceHelpModal.close();
        this.vinModal.close();
        this.licensePlateModal.close();
        this.confirmVinModal.close();
        this.vinErrorModal.close();
    }
}
