import { AfterViewInit, Component, Inject, OnDestroy } from '@angular/core';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { select, Store } from '@ngrx/store';
import { selectSelectedSubscriptionSummaryViewModel } from '@de-care/de-care-use-cases/streaming/state-setup-credentials';
import { TranslateService } from '@ngx-translate/core';
import { DOCUMENT } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

@Component({
    selector: 'de-care-ineligible-non-pay-page',
    templateUrl: './ineligible-non-pay-page.component.html',
    styleUrls: ['./ineligible-non-pay-page.component.scss'],
})
export class IneligibleNonPayPageComponent implements AfterViewInit, OnDestroy {
    translateKeyPrefix = 'DeCareUseCasesStreamingFeatureSetupCredentialsModule.IneligibleNonPayPageComponent.';
    translateKeyPrefixShared = 'DeCareUseCasesStreamingFeatureSetupCredentialsModule.Shared.';
    private readonly _window: Window;
    subscription$ = this._store.pipe(select(selectSelectedSubscriptionSummaryViewModel));
    private _translateSubscription: Subscription;

    constructor(private readonly _store: Store, public translate: TranslateService, @Inject(DOCUMENT) document: Document, private _titleService: Title) {
        this._translateSubscription = this.translate.stream(`${this.translateKeyPrefixShared}PAGE_TITLE`).subscribe((pageTitle) => {
            this._titleService.setTitle(pageTitle);
        });
        this._window = document?.defaultView;
    }

    ngAfterViewInit(): void {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'subscriptionpastdue' }));
    }

    ngOnDestroy() {
        this._translateSubscription?.unsubscribe();
    }

    makePayment(subs, url) {
        const translateUrl = this.translate.instant(url);
        const token = subs.deviceToken;
        this._window.location.href = translateUrl + `?dtok=${token}&ref=Onboarding`;
    }
}
