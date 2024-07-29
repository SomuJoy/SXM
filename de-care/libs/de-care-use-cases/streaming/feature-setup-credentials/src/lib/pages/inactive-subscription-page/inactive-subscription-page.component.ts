import { AfterViewInit, Component, Inject } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { getFeatureFlagIapEnableContactUsTelephone } from '@de-care/shared/state-feature-flags';
import {
    collectSelectedRadioIdLastFour,
    LoadAccountForSelectedRadioIdService,
    selectSelectedSubscriptionSummaryViewModel,
} from '@de-care/de-care-use-cases/streaming/state-setup-credentials';
import { TranslateService } from '@ngx-translate/core';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
@Component({
    selector: 'de-care-inactive-subscription-page',
    templateUrl: './inactive-subscription-page.component.html',
    styleUrls: ['./inactive-subscription-page.component.scss'],
})
export class InactiveSubscriptionPageComponent implements AfterViewInit {
    private readonly _window: Window;
    translateKeyPrefix = 'DeCareUseCasesStreamingFeatureSetupCredentialsModule.InactiveSubscriptionPageComponent.';
    subscription$ = this._store.pipe(select(selectSelectedSubscriptionSummaryViewModel));
    contactUsTelephoneEnabled$ = this._store.pipe(select(getFeatureFlagIapEnableContactUsTelephone));
    params: string;
    radioId: any;
    act: any;
    subscriptionData: any;
    constructor(
        private readonly _store: Store,
        public translate: TranslateService,
        @Inject(DOCUMENT) document: Document,
        private _loadAccountForSelectedRadioIdService: LoadAccountForSelectedRadioIdService,
        private _router: Router
    ) {
        this._window = document?.defaultView;
    }

    ngAfterViewInit(): void {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'subscriptioninactive' }));
    }

    onReactivateClick(subscription) {
        this._store.dispatch(collectSelectedRadioIdLastFour({ selectedRadioIdLastFour: subscription.last4DigitsOfRadioId }));
        this._loadAccountForSelectedRadioIdService.build().subscribe((data) => {
            if (data) {
                const radioId = subscription.last4DigitsOfRadioId;
                const act = subscription.last4DigitsOfAccountNumber;
                this._router.navigate(['subscribe', 'checkout'], { queryParams: { RadioID: radioId, act: act, isIdentifiedUser: true } });
            }
        });
    }
}
