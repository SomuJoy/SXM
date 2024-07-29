import { Component, EventEmitter, Output, Input, ChangeDetectionStrategy } from '@angular/core';
import { SharedVerifyDeviceUserSelection, PrefilledAccountData } from '@de-care/identification';
import { ClosedDeviceModel, VehicleModel, OfferModel, ActivationProspectModel } from '@de-care/data-services';

export interface RadioInfo {
    state?: string;
    last4DigitsOfRadioId: string;
    vehicleInfo: VehicleModel;
    isNewAccount: boolean;
    closedDevice: ClosedDeviceModel;
    radioOffer: OfferModel;
    accountRegistered: boolean;
}

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'identification-step',
    templateUrl: './identification-step.component.html',
    styleUrls: ['./identification-step.component.scss']
})
export class IdentificationStepComponent {
    prefilledAccountData: PrefilledAccountData;
    isProspectTrial = false;
    @Input() set prospectData(prospectData: ActivationProspectModel) {
        if (!!prospectData) {
            this.prefilledAccountData = {
                firstName: prospectData.firstName,
                lastName: prospectData.lastName
            };
            this.isProspectTrial = true;
        } else {
            this.prefilledAccountData = null;
            this.isProspectTrial = false;
        }
    }

    @Input() programCode: string;
    @Input() isPromoCodeValid: boolean = false;
    @Input() isOfferNotAvailable: boolean = true;
    @Output() loginError = new EventEmitter<void>();
    @Output() radioSelected = new EventEmitter<RadioInfo>();

    onUserSelection({ selectedRadio, selectedAccount, radioOffer }: SharedVerifyDeviceUserSelection) {
        this.radioSelected.emit({
            state: selectedAccount && selectedAccount.serviceAddress && selectedAccount.serviceAddress.state ? selectedAccount.serviceAddress.state : null,
            last4DigitsOfRadioId: selectedRadio.last4DigitsOfRadioId,
            vehicleInfo: selectedRadio.vehicleInfo,
            isNewAccount: selectedAccount && selectedAccount.isNewAccount,
            closedDevice: selectedAccount.closedDevices && selectedAccount.closedDevices.length > 0 ? selectedAccount.closedDevices[0] : null,
            radioOffer,
            accountRegistered: selectedAccount && selectedAccount.accountProfile ? selectedAccount.accountProfile.accountRegistered : false
        });
    }
}
