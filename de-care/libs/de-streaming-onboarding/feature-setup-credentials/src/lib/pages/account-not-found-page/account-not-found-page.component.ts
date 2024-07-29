import { AfterViewInit, ChangeDetectionStrategy, Component } from '@angular/core';
import { backToWelcome } from '@de-care/de-streaming-onboarding/state-setup-credentials';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { Store } from '@ngrx/store';

@Component({
    selector: 'account-not-found-page',
    templateUrl: './account-not-found-page.component.html',
    styleUrls: ['./account-not-found-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountNotFoundPageComponent implements AfterViewInit {
    translateKeyPrefix = 'DeStreamingOnboardingFeatureSetupCredentialsModule.AccountNotFoundPageComponent.';

    constructor(private readonly _store: Store) {}

    onPreviewClick() {
        this._store.dispatch(backToWelcome());
    }

    ngAfterViewInit(): void {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'flepznotfoundtryrid' }));
    }
}
