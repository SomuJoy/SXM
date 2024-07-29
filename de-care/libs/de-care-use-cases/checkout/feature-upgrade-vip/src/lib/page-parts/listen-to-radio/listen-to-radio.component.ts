import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export interface Device {
    radioId: string;
    vehicle?: {
        year: number;
        make: string;
        model: string;
    };
}

@Component({
    selector: 'de-care-listen-to-radio',
    templateUrl: './listen-to-radio.component.html',
    styleUrls: ['./listen-to-radio.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListenToRadioComponent {
    @Input() isFrench: boolean;
    @Input() device: Device;
    @Input() maskedUserName: string;
    @Input() subscriptionId: string;
    translateKeyPrefix = 'DeCareUseCasesCheckoutFeatureUpgradeVipModule.ConfirmationPageComponent.LISTEN_TO_RADIO.';
}
