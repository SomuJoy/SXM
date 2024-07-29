import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Details } from '../charge-agreement/charge-agreement.component';

@Component({
    selector: 'charge-agreement-with-validation',
    templateUrl: './charge-agreement-with-validation.component.html',
    styleUrls: ['./charge-agreement-with-validation.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChargeAgreementWithValidationComponent {
    @Input() submitted = false;
    @Output() checkChange = new EventEmitter<boolean>();
    @Input() details: Details;

    translateKeyPrefix = 'reviewOrder.chargeAgreementWithValidationComponent';
    agreementAccepted = false;
}
