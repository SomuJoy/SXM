import { Component, Inject, OnInit } from '@angular/core';
import { selectSelectedSubscriptionSummaryViewModel } from '@de-care/de-care-use-cases/streaming/state-setup-credentials';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { DOCUMENT } from '@angular/common';

@Component({
    selector: 'de-care-ineligible-audio-with-no-streaming-capability',
    templateUrl: './ineligible-audio-with-no-streaming-capability.component.html',
    styleUrls: ['./ineligible-audio-with-no-streaming-capability.component.scss'],
})
export class IneligibleAudioWithNoStreamingCapabilityComponent implements OnInit {
    private readonly _window: Window;
    translateKeyPrefix = 'DeCareUseCasesStreamingFeatureSetupCredentialsModule.IneligibleAudioWithNoStreamingCapabilityComponent.';
    subscription$ = this._store.pipe(select(selectSelectedSubscriptionSummaryViewModel));
    params: string;
    radioId: any;
    act: any;
    subscriptionData: any;
    constructor(private readonly _store: Store, public translate: TranslateService, @Inject(DOCUMENT) document: Document) {
        this._window = document?.defaultView;
    }

    ngOnInit(): void {
        console.log('Ineligible screen');
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
