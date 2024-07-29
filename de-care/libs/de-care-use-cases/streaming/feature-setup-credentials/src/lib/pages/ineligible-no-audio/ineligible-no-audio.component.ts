import { AfterViewInit, Component, Inject } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { getFeatureFlagIapEnableContactUsTelephone } from '@de-care/shared/state-feature-flags';
import { selectSelectedSubscriptionSummaryViewModel } from '@de-care/de-care-use-cases/streaming/state-setup-credentials';
import { TranslateService } from '@ngx-translate/core';
import { DOCUMENT } from '@angular/common';
@Component({
    selector: 'de-care-ineligible-no-audio',
    templateUrl: './ineligible-no-audio.component.html',
    styleUrls: ['./ineligible-no-audio.component.scss'],
})
export class IneligibleNoAudioComponent implements AfterViewInit {
    private readonly _window: Window;
    translateKeyPrefix = 'DeCareUseCasesStreamingFeatureSetupCredentialsModule.IneligibleNoAudioComponent.';
    subscription$ = this._store.pipe(select(selectSelectedSubscriptionSummaryViewModel));
    params: string;
    radioId: any;
    act: any;
    subscriptionData: any;
    contactUsTelephoneEnabled$ = this._store.pipe(select(getFeatureFlagIapEnableContactUsTelephone));
    constructor(private readonly _store: Store, public translate: TranslateService, @Inject(DOCUMENT) document: Document) {
        this._window = document?.defaultView;
    }

    ngAfterViewInit(): void {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'noaudio' }));
    }
    onUpgradeClick(subscription, url) {
        const translateUrl = this.translate.instant(url);
        if (translateUrl === 'http://www.siriusxm.com/upgradeonboarding') {
            this.params = `?RadioID=${subscription.last4DigitsOfRadioId}&act=${subscription.last4DigitsOfAccountNumber}`;
        } else {
            this.params = `?RadioID=***${subscription.last4DigitsOfRadioId}&PROMOCODE=SXM-OFFER50AA&act=********${subscription.last4DigitsOfAccountNumber}`;
        }
        this._window.location.href = translateUrl + this.params;
    }
}
