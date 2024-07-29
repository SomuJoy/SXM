import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { openPrivacyPolicyOverlay } from '@de-care/de-streaming-onboarding/state-setup-credentials';

@Component({
    selector: 'de-streaming-onboarding-privacy-policy',
    template: `
        <a class="text-link" (click)="openPrivacyPolicy()" sxmUiDataClickTrack="download">
            {{ translateKeyPrefix + '.LINK_TEXT' | translate }}
        </a>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrivacyPolicyComponent {
    translateKeyPrefix = 'DeStreamingOnboardingFeatureSetupCredentialsModule.PrivacyPolicyComponent';

    constructor(private readonly _store: Store) {}

    openPrivacyPolicy() {
        this._store.dispatch(openPrivacyPolicyOverlay());
    }
}
