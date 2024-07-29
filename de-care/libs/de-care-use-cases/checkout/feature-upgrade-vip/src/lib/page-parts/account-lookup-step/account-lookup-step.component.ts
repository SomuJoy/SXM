import { Component, AfterViewInit, Output, EventEmitter, ViewChild, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { RadioIdAndAccountNumberLookupFormComponentApi } from '@de-care/domains/identification/ui-radio-id-and-account-number-lookup-form';
import {
    getIsCanadaMode,
    LookupRadioByIdAndAccountFieldWorkflowService,
    setErrorCode,
    UseRadioIdAfterLpzSuccessWorkflowService,
} from '@de-care/de-care-use-cases/checkout/state-upgrade-vip';
import { SxmUiModalComponent } from '@de-care/shared/sxm-ui/ui-modal';
import { ValidateLpzFormComponentApi } from '@de-care/domains/identification/ui-validate-lpz-form';
import { TranslateService } from '@ngx-translate/core';
import { map, take } from 'rxjs/operators';
import { LANGUAGE_CODES } from '@de-care/shared/translation';
import { Router } from '@angular/router';
import { ClosedDeviceModel, RadioModel, VehicleModel } from '@de-care/data-services';
import { RadioIdAndALastnameLookupFormComponent } from '@de-care/domains/identification/ui-radio-id-and-lastname-lookup-form';
import * as uuid from 'uuid/v4';

export interface AccountLookupStepData {
    currentVehicle: {
        year: string;
        make: string;
        model: string;
    };
    currentRadioId: string;
    currentPackageName: string;
    isFirstRadioTrial: boolean;
}

type LookupInput = {
    radioId: string;
    accountNumber?: string;
    lastName?: string;
};
export interface ConfirmVinInputData {
    vinNumber: string;
    state: string;
    licensePlate: string;
    last4DigitsOfRadioId: string;
    vehicleInfo?: VehicleModel;
}

export enum VerifyDeviceModals {
    LicensePlateModal = 'licensePlateModal',
    DeviceHelpModal = 'deviceHelpModal',
    RadioModal = 'radioModal',
    ConfirmVinModal = 'confirmVinModal',
}

export const enum OtherModals {
    LPZ_MODAL = 'lpzModal',
}
@Component({
    selector: 'account-lookup-step',
    templateUrl: './account-lookup-step.component.html',
    styleUrls: ['./account-lookup-step.component.scss'],
})
export class AccountLookupStepComponent implements AfterViewInit {
    translateKeyPrefix = 'DeCareUseCasesCheckoutFeatureUpgradeVipModule.AccountLookupStepComponent.';

    @Input() data: AccountLookupStepData;
    @Output() continue = new EventEmitter();
    @ViewChild('lookupFormComponent', { static: false }) private _lookupFormComponent: RadioIdAndAccountNumberLookupFormComponentApi;
    @ViewChild('lookupFormComponentCanada', { static: false }) private _lookupFormComponentCanada: RadioIdAndALastnameLookupFormComponent;
    @ViewChild('lpzFormComponent') private _lpzFormComponent: ValidateLpzFormComponentApi;
    @ViewChild('lpzModal', { static: true }) private _lpzModal: SxmUiModalComponent;
    @ViewChild('successModal') private _successModal: SxmUiModalComponent;
    @ViewChild('deviceHelpModal', { static: true }) deviceHelpModal: SxmUiModalComponent;

    radioIdSubmitted: string;
    radioToValidate: RadioModel | ClosedDeviceModel;
    isCanadaMode$ = this._store.select(getIsCanadaMode);
    currentLangIsFrench$ = this._translateService.onLangChange.pipe(map((ev) => ev?.lang === LANGUAGE_CODES.FR_CA));
    confirmVinModalData: ConfirmVinInputData;
    deviceHelpModalAriaDescribedbyTextId = uuid();

    tabs = {
        'RADIO-ID-AND-ACCOUNT': {
            id: 'RIDACCT',
            qaTag: null,
            index: 0,
            isSelected: true,
        },
    };

    constructor(
        private readonly _store: Store,
        private readonly _lookupRadioByIdAndAccountNumberFieldflowService: LookupRadioByIdAndAccountFieldWorkflowService,
        private readonly _useRadioIdAfterLpzSuccessWorkflowService: UseRadioIdAfterLpzSuccessWorkflowService,
        private readonly _translateService: TranslateService,
        private readonly _router: Router
    ) {}

    ngAfterViewInit(): void {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: '' }));
    }

    doLookup(input: LookupInput) {
        this.radioIdSubmitted = input.radioId;
        this.isCanadaMode$.pipe(take(1)).subscribe((isCanada) => {
            this._doLookupProcess(input, isCanada);
        });
    }

    lpzValidated(valid: boolean) {
        if (valid) {
            this._useRadioIdAfterLpzSuccessWorkflowService.build({ radioId: this.radioIdSubmitted }).subscribe({
                next: (result) => {
                    switch (result) {
                        case 'ok': {
                            this._successModal.open();
                            break;
                        }
                        case 'alreadyHaveVIP':
                            this._store.dispatch(setErrorCode({ errorCode: 'SUBSCRIPTION_HAS_VIP_PLATINUM_PACKAGE' }));
                            this._router.navigateByUrl('/subscribe/upgrade-vip/error');
                            break;
                        case 'notQualifiedForVIP':
                            this._store.dispatch(setErrorCode({ errorCode: 'SUBSCRIPTION_HAS_INELIGIBLE_PLAN' }));
                            this._router.navigateByUrl('/subscribe/upgrade-vip/error');
                            break;
                        case 'fallback':
                            this._router.navigateByUrl('/subscribe/upgrade-vip/fallback');
                            break;
                    }
                    this._lpzFormComponent.setProcessingCompleted();
                },
            });
        } else {
            this._lpzFormComponent.setProcessingCompleted();
        }
    }

    closeLpzModal() {
        this._lpzModal.close();
        this._lpzFormComponent.reset();
        this.closeModal(OtherModals.LPZ_MODAL);
    }

    closeModal(modal: VerifyDeviceModals | OtherModals) {
        this[modal].close();
    }

    openModal(modal: VerifyDeviceModals | OtherModals, saveHistory = true) {
        this[modal].open();
    }

    onDeviceHelp(): void {
        this.openModal(VerifyDeviceModals.DeviceHelpModal);
    }

    onValidateUserModalClose(): void {
        this.radioToValidate = null;
    }

    private _doLookupProcess({ radioId, accountNumber, lastName }: LookupInput, isCanada: boolean) {
        const lookupComponentInstance = this._getLookupComponentInstance(isCanada);
        this._lookupRadioByIdAndAccountNumberFieldflowService.build({ radioId, accountNumber, lastName }).subscribe({
            next: (result) => {
                switch (result) {
                    case 'found': {
                        lookupComponentInstance.completedLookupSuccess();
                        this._successModal.open();
                        break;
                    }
                    case 'notFound': {
                        lookupComponentInstance.completedLookupFail();
                        break;
                    }
                    case 'needsLPZ': {
                        lookupComponentInstance.completedLookupSuccess();
                        this.openModal(OtherModals.LPZ_MODAL);
                        break;
                    }
                    case 'alreadyHaveVIP':
                        this._store.dispatch(setErrorCode({ errorCode: 'SUBSCRIPTION_HAS_VIP_PLATINUM_PACKAGE' }));
                        this._router.navigateByUrl('/subscribe/upgrade-vip/error');
                        break;
                    case 'fallback': {
                        this._router.navigateByUrl('/subscribe/upgrade-vip/fallback');
                        this._store.dispatch(setErrorCode({ errorCode: 'fallback' }));
                        break;
                    }
                    case 'notQualifiedForVIP':
                        this._store.dispatch(setErrorCode({ errorCode: 'SUBSCRIPTION_HAS_INELIGIBLE_PLAN' }));
                        this._router.navigateByUrl('/subscribe/upgrade-vip/error');
                        break;
                }
            },
            error: () => {
                lookupComponentInstance.showSystemError();
            },
        });
    }

    private _getLookupComponentInstance(isCanada: boolean) {
        if (isCanada) {
            return this._lookupFormComponentCanada;
        }

        return this._lookupFormComponent;
    }
}
