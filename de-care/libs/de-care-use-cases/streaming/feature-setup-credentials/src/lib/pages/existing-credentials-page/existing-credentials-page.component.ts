import { AfterViewInit, Component, Inject, OnDestroy } from '@angular/core';
import {
    getRecoverLoginUrl,
    getStreamingPlayerLinkTokenInfoViewModel,
    selectSelectedSubscriptionSummaryViewModel,
} from '@de-care/de-care-use-cases/streaming/state-setup-credentials';
import { Store } from '@ngrx/store';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { take } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

@Component({
    selector: 'de-care-existing-credentials-page',
    templateUrl: './existing-credentials-page.component.html',
    styleUrls: ['./existing-credentials-page.component.scss'],
})
export class ExistingCredentialsPageComponent implements AfterViewInit, OnDestroy {
    translateKeyPrefix = 'DeCareUseCasesStreamingFeatureSetupCredentialsModule.ExistingCredentialsPageComponent.';
    translateKeyPrefixShared = 'DeCareUseCasesStreamingFeatureSetupCredentialsModule.Shared.';
    subscription$ = this._store.select(selectSelectedSubscriptionSummaryViewModel);
    legacyOnboardingBaseUrl$ = this._store.select(getRecoverLoginUrl);
    private readonly _window: Window;
    private _translateSubscription: Subscription;
    streamingPlayerLinkTokenInfoViewModel$ = this._store.select(getStreamingPlayerLinkTokenInfoViewModel);

    constructor(private readonly _store: Store, @Inject(DOCUMENT) document: Document, private readonly _translateService: TranslateService, private _titleService: Title) {
        this._translateSubscription = this._translateService.stream(`${this.translateKeyPrefixShared}PAGE_TITLE`).subscribe((pageTitle) => {
            this._titleService.setTitle(pageTitle);
        });
        this._window = document?.defaultView;
    }

    ngAfterViewInit(): void {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'singleaccountmatchexistingcredentials' }));
    }

    ngOnDestroy() {
        this._translateSubscription?.unsubscribe();
    }

    onCredentialsRecoveryRequested() {
        this.legacyOnboardingBaseUrl$.pipe(take(1)).subscribe((result) => {
            this._window.location.href = result;
        });
    }
}
