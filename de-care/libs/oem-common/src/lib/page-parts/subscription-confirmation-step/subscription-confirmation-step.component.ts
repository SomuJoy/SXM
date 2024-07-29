import { Component, EventEmitter, Output } from '@angular/core';
import { SettingsService } from '@de-care/settings';

@Component({
    selector: 'subscription-confirmation-step',
    templateUrl: './subscription-confirmation-step.component.html',
    styleUrls: ['./subscription-confirmation-step.component.scss']
})
export class SubscriptionConfirmationStepComponent {
    @Output() done = new EventEmitter();

    constructor(public settingsService: SettingsService) {}
}
