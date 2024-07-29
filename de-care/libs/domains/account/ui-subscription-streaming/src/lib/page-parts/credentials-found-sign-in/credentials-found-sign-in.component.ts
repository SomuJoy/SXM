import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { SubscriptionSummaryData } from '../../models';

@Component({
    selector: 'credentials-found-sign-in',
    templateUrl: './credentials-found-sign-in.component.html',
    styleUrls: ['./credentials-found-sign-in.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CredentialsFoundSignInComponent {
    translateKeyPrefix = 'DomainsAccountUiSubscriptionStreamingModule.CredentialsFoundSignInComponent.';

    @Input() subscription: SubscriptionSummaryData;
    @Output() credentialsRecoveryRequested = new EventEmitter();
}
