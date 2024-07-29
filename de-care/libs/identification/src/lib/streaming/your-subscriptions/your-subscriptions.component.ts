import { Component, EventEmitter, Input, Output } from '@angular/core';
import { YourSubscriptionOptions, SubscriptionActionTypeEnum, IdentityLookupPhoneOrEmailResponseModel } from '@de-care/data-services';
import * as uuid from 'uuid/v4';

export interface StreamingEligibleSubscription {
    plans: { packageName: string }[];
    radioService: { vehicleInfo: { model: string; make: string; year: string } };
    streamingService?: { status: string; randomCredentials: boolean; hasCredentials: boolean };
}

@Component({
    selector: 'your-subscriptions',
    templateUrl: './your-subscriptions.component.html',
    styleUrls: ['./your-subscriptions.component.scss']
})
export class YourSubscriptionsComponent {
    @Input() subscriptions: YourSubscriptionOptions;
    @Input() ariaDescribedbyTextId = uuid();
    @Output() actionClicked = new EventEmitter<IdentityLookupPhoneOrEmailResponseModel>();
}
