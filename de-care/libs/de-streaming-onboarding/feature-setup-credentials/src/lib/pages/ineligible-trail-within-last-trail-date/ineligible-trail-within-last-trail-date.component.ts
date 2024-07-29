import { AfterViewInit, Component, OnInit } from '@angular/core';
import { backToWelcome } from '@de-care/de-streaming-onboarding/state-setup-credentials';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { Store } from '@ngrx/store';

@Component({
    selector: 'de-streaming-onboarding-ineligible-trail-within-last-trail-date',
    templateUrl: './ineligible-trail-within-last-trail-date.component.html',
    styleUrls: ['./ineligible-trail-within-last-trail-date.component.scss']
})
export class IneligibleTrailWithinLastTrailDateComponent implements OnInit, AfterViewInit {
    translateKeyPrefix = 'DeStreamingOnboardingFeatureSetupCredentialsModule.IneligibleMaxLifetimeTrialsComponent.';
    constructor(private readonly _store: Store) {}

    ngOnInit(): void {}

    ngAfterViewInit(): void {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'noteligiblefortrial' }));
    }

    onPreviewClick() {
        this._store.dispatch(backToWelcome());
    }
}
