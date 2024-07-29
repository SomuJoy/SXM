import { Component, Inject, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import {
    FindAccountByRadioIdOrVinOrLicensePlateWorkflowError,
    FindAccountByRadioIdOrVinOrLicensePlateWorkflowService,
    getLookupByLicensePlateAllowed,
} from '@de-care/de-care-use-cases/streaming/state-setup-credentials';
import { ActivatedRoute, Router } from '@angular/router';
import { DeviceIdSelection, DeviceLookupIdOptionsFormComponent, DeviceLookupIdOptionsFormComponentApi } from '@de-care/domains/identity/ui-device-lookup';
import { DOCUMENT } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'de-care-account-not-found-page',
    templateUrl: './account-not-found-page.component.html',
    styleUrls: ['./account-not-found-page.component.scss'],
})
export class AccountNotFoundPageComponent {
    translateKeyPrefix = 'DeCareUseCasesStreamingFeatureSetupCredentialsModule.AccountNotFoundPageComponent.';
    private readonly _window: Window;
    @ViewChild(DeviceLookupIdOptionsFormComponent) deviceLookupFormComponentApi: DeviceLookupIdOptionsFormComponentApi;
    canLookupByLicensePlate$ = this._store.select(getLookupByLicensePlateAllowed);

    constructor(
        private readonly _store: Store,
        private readonly _findAccountByRadioIdOrVinWorkflowService: FindAccountByRadioIdOrVinOrLicensePlateWorkflowService,
        private readonly _router: Router,
        private readonly _activatedRoute: ActivatedRoute,
        @Inject(DOCUMENT) document: Document,
        private readonly _translateService: TranslateService
    ) {
        this._window = document?.defaultView;
    }

    onDeviceIdSelected(deviceIdSelection: DeviceIdSelection) {
        this._findAccountByRadioIdOrVinWorkflowService.build(deviceIdSelection).subscribe({
            next: ({ ineligibleReason, isInPreTrial }) => {
                if (isInPreTrial) {
                    if (deviceIdSelection.lookupType === 'vin') {
                        this._navigateTo('../radio-id-lookup');
                        return;
                    }
                    this._navigateTo('../registration');
                    return;
                }
                switch (ineligibleReason) {
                    case 'NonPay': {
                        this._navigateTo('../ineligible-non-pay');
                        break;
                    }
                    case 'NonConsumer': {
                        this._navigateTo('../ineligible-non-consumer');
                        break;
                    }
                    case 'TrialWithinLastTrialDate': {
                        this._navigateTo('../ineligible-trial-within-last-trial-date');
                        break;
                    }
                    case 'MaxLifetimeTrials': {
                        this._navigateTo('../ineligible-max-lifetime-trials');
                        break;
                    }
                    case 'InsufficientPackage': {
                        this._navigateTo('../ineligible-insufficient-package');
                        break;
                    }
                    case 'ExpiredAATrial': {
                        this._navigateTo('../ineligible-expired-AA-trial');
                        break;
                    }
                    case 'NeedsCredentials': {
                        this._navigateTo('../credential-setup');
                        break;
                    }
                    case 'SingleMatchOAC': {
                        this._navigateTo('../existing-credentials');
                        break;
                    }
                    case 'NoAudio': {
                        this._navigateTo('../ineligible-no-audio');
                        break;
                    }
                    default:
                        this.deviceLookupFormComponentApi.showRadioIdError();
                        break;
                }
                this.deviceLookupFormComponentApi.completedProcessing();
            },
            error: (error: { errorType: FindAccountByRadioIdOrVinOrLicensePlateWorkflowError }) => {
                if (error && error.errorType) {
                    if (
                        error.errorType === FindAccountByRadioIdOrVinOrLicensePlateWorkflowError.RADIO_ID_NOT_FOUND ||
                        error.errorType === FindAccountByRadioIdOrVinOrLicensePlateWorkflowError.RADIO_NOT_ACTIVE
                    ) {
                        this.deviceLookupFormComponentApi.showRadioIdError();
                    } else if (error.errorType === FindAccountByRadioIdOrVinOrLicensePlateWorkflowError.VIN_NOT_FOUND) {
                        this.deviceLookupFormComponentApi.showVinError();
                    } else if (error.errorType === FindAccountByRadioIdOrVinOrLicensePlateWorkflowError.LICENSE_PLATE_DATA_NOT_FOUND) {
                        this.deviceLookupFormComponentApi.showLicensePlateError();
                    } else if (error.errorType === FindAccountByRadioIdOrVinOrLicensePlateWorkflowError.BUSINESS) {
                        switch (deviceIdSelection.lookupType) {
                            case 'radioId':
                                this.deviceLookupFormComponentApi.showRadioIdError();
                                break;
                            case 'vin':
                                this.deviceLookupFormComponentApi.showVinError();
                                break;
                            case 'licensePlate':
                                this.deviceLookupFormComponentApi.showLicensePlateError();
                                break;
                        }
                    } else if (error.errorType === FindAccountByRadioIdOrVinOrLicensePlateWorkflowError.CLOSED_RADIO_ID) {
                        this._navigateTo('../inactive-subscription');
                    } else {
                        this.deviceLookupFormComponentApi.showSystemError();
                    }
                } else {
                    this.deviceLookupFormComponentApi.showSystemError();
                }
                this.deviceLookupFormComponentApi.completedProcessing();
            },
            complete: () => {
                this.deviceLookupFormComponentApi.completedProcessing();
            },
        });
    }
    onSubscribeClick(url) {
        this._translateService.get(url).subscribe((translateUrl) => {
            this._window.location.href = translateUrl;
        });
    }

    private _navigateTo(destination: string): void {
        this._router.navigate([destination], { relativeTo: this._activatedRoute }).then(() => {
            this.deviceLookupFormComponentApi.completedProcessing();
        });
    }
}
