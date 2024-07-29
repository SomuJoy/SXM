import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DeviceCredentialsStatus } from '@de-care/de-care-use-cases/checkout/state-upgrade-vip';
import { RegisterCredentialsState } from '@de-care/domains/account/ui-register';

@Component({
    selector: 'de-care-dynamic-form-for-radios',
    templateUrl: './dynamic-form-for-radios.component.html',
    styles: [
        `
            .new-line-margin {
                margin-bottom: 24px;
                display: block;
            }
            .radio-header-margin {
                margin-top: 24px;
                margin-bottom: 4px;
            }
            .radio-text-margin {
                margin-bottom: 16px;
            }
        `,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicFormForRadiosComponent {
    registerCredentialState: RegisterCredentialsState = RegisterCredentialsState.All;
    @Input() confirmationData;
    @Input() isFrench: boolean;
    @Input() primaryRadioSubscriptionId: string;
    @Input() secondaryRadioSubscriptionId: string;
    DeviceCredentialsStatusEnum = DeviceCredentialsStatus;
    firstRadioMaskedUsername: string;
    secondRadioMaskedUsername: string;

    translateKeyPrefix = 'DeCareUseCasesCheckoutFeatureUpgradeVipModule.ConfirmationPageComponent.DYNAMIC_FORM_FOR_RADIOS.';
}
