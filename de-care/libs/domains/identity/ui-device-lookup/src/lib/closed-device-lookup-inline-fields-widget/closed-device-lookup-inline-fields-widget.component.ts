import { CommonModule } from '@angular/common';
import { Component, NgModule, ChangeDetectionStrategy, Output, EventEmitter, ViewChild, Input } from '@angular/core';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { TranslateModule } from '@ngx-translate/core';
import {
    DeviceIdSelection,
    DeviceLookupIdOptionsFormComponent,
    DeviceLookupIdOptionsFormComponentApi,
} from '../device-lookup-id-options-form/device-lookup-id-options-form.component';
import { DomainsIdentityUiDeviceLookupModule } from '../domains-identity-ui-device-lookup.module';
import { ValidateDeviceDataWorkflowService, ValidateDeviceDataWorkflowServiceErrors } from '@de-care/domains/device/state-device-validate';
import { SharedSxmUiUiModalModule, SxmUiModalComponent } from '@de-care/shared/sxm-ui/ui-modal';
import { GetDeviceInfoWorkflowService } from '@de-care/domains/device/state-device-info';
import * as uuid from 'uuid/v4';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'sxm-ui-closed-device-lookup-inline-fields-widget',
    templateUrl: './closed-device-lookup-inline-fields-widget.component.html',
    styleUrls: ['./closed-device-lookup-inline-fields-widget.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SxmUiClosedDeviceLookupInlineFieldsWidgetComponent implements ComponentWithLocale {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    licensePlateSummaryInfo;

    @Output() deviceIdSelected = new EventEmitter<string>();
    @Input() allowLicensePlate;
    @ViewChild(DeviceLookupIdOptionsFormComponent) private readonly _deviceLookupFormComponentApi: DeviceLookupIdOptionsFormComponentApi;
    @ViewChild('confirmVinModal') private readonly _confirmVinModal: SxmUiModalComponent;
    closeDeviceLookupModalAriaDescribedbyTextId = uuid();

    constructor(
        readonly translationsForComponentService: TranslationsForComponentService,
        private readonly _validateDeviceDataWorkflowService: ValidateDeviceDataWorkflowService,
        private readonly _getDeviceInfoWorkflowService: GetDeviceInfoWorkflowService
    ) {
        translationsForComponentService.init(this);
    }

    onDeviceIdSelected(deviceIdSelection: DeviceIdSelection) {
        this._validateDeviceDataWorkflowService.build(deviceIdSelection).subscribe({
            next: (data) => {
                // Only allow closed radios
                const { last4DigitsOfRadioId, deviceStatus } = data;

                if (deviceStatus === 'NEW') {
                    this._deviceLookupFormComponentApi.completedProcessing();
                    if (deviceIdSelection.lookupType === 'licensePlate') {
                        this._getDeviceInfoWorkflowService.build(last4DigitsOfRadioId).subscribe({
                            next: (deviceInfo) => {
                                this.licensePlateSummaryInfo = {
                                    vehicleInfo: deviceInfo?.vehicle,
                                    vinNumber: data?.last4DigitsOfVin,
                                    last4DigitsOfRadioId,
                                    state: deviceIdSelection.identifier?.['state'],
                                    licensePlate: deviceIdSelection.identifier?.['licensePlate'],
                                    nickname: data.nickName,
                                };
                                this._confirmVinModal.open();
                            },
                            error: () => {
                                this._deviceLookupFormComponentApi.showSystemError();
                            },
                        });
                    } else {
                        this.deviceIdSelected.emit(last4DigitsOfRadioId);
                    }
                } else if (deviceStatus === 'USED') {
                    this.deviceIdSelected.emit(last4DigitsOfRadioId);
                } else {
                    switch (deviceIdSelection.lookupType) {
                        case 'radioId': {
                            this._deviceLookupFormComponentApi.showRadioIdError();
                            break;
                        }
                        case 'vin': {
                            this._deviceLookupFormComponentApi.showVinError();
                            break;
                        }
                        case 'licensePlate': {
                            this._deviceLookupFormComponentApi.showLicensePlateError();
                            break;
                        }
                    }
                }
            },
            error: (error: ValidateDeviceDataWorkflowServiceErrors) => {
                this._deviceLookupFormComponentApi.completedProcessing();
                switch (error) {
                    case 'Radio ID not found': {
                        this._deviceLookupFormComponentApi.showRadioIdError();
                        break;
                    }
                    case 'VIN not found': {
                        this._deviceLookupFormComponentApi.showVinError();
                        break;
                    }
                    case 'License plate data not found': {
                        this._deviceLookupFormComponentApi.showLicensePlateError();
                        break;
                    }
                    default: {
                        this._deviceLookupFormComponentApi.showSystemError();
                        break;
                    }
                }
            },
        });
    }
}

@NgModule({
    declarations: [SxmUiClosedDeviceLookupInlineFieldsWidgetComponent],
    exports: [SxmUiClosedDeviceLookupInlineFieldsWidgetComponent],
    imports: [CommonModule, TranslateModule.forChild(), DomainsIdentityUiDeviceLookupModule, SharedSxmUiUiModalModule],
})
export class SxmUiClosedDeviceLookupInlineFieldsWidgetComponentModule {}
