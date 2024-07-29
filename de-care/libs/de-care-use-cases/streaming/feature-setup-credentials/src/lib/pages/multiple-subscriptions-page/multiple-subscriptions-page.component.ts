import { AfterViewInit, Component, Inject } from '@angular/core';
import {
    collectSelectedRadioIdLastFour,
    LoadAccountForSelectedRadioIdService,
    selectFlepzSubscriptionsFoundSummaryViewModel,
} from '@de-care/de-care-use-cases/streaming/state-setup-credentials';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { Store } from '@ngrx/store';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { OpenNativeAppService } from '@de-care/domains/utility/state-native-app-integration';
import { DOCUMENT } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
@Component({
    selector: 'de-care-multiple-subscriptions-page',
    templateUrl: './multiple-subscriptions-page.component.html',
    styleUrls: ['./multiple-subscriptions-page.component.scss'],
})
export class MultipleSubscriptionsPageComponent implements AfterViewInit {
    translateKeyPrefix = 'DeCareUseCasesStreamingFeatureSetupCredentialsModule.MultipleSubscriptionsPageComponent.';
    private readonly _window: Window;
    private _subscriptions$ = this._store.select(selectFlepzSubscriptionsFoundSummaryViewModel);
    headlineContent$ = this._subscriptions$.pipe(
        map(({ subscriptionsWithStreaming, subscriptionsInactive, subscriptionsNeedingUpgrade }) => {
            if (subscriptionsWithStreaming.length > 0) {
                return {
                    e2eAttributeSuffix: 'WithStreamingHeadlineContent',
                    headlineKey: 'HEADLINE_SETS.WITH_STREAMING.HEADLINE',
                    instructionsKey: 'HEADLINE_SETS.WITH_STREAMING.INSTRUCTIONS',
                };
            }
            if (subscriptionsWithStreaming.length === 0 && subscriptionsInactive.length > 0 && subscriptionsNeedingUpgrade.length === 0) {
                return {
                    e2eAttributeSuffix: 'InactiveHeadlineContent',
                    headlineKey: 'HEADLINE_SETS.INACTIVE.HEADLINE',
                    instructionsKey: 'HEADLINE_SETS.INACTIVE.INSTRUCTIONS',
                };
            }
            if (subscriptionsWithStreaming.length === 0 && subscriptionsInactive.length > 0 && subscriptionsNeedingUpgrade.length > 0) {
                return {
                    e2eAttributeSuffix: 'UpgradeNeededHeadlineContent',
                    headlineKey: 'HEADLINE_SETS.UPGRADE.HEADLINE',
                    instructionsKey: 'HEADLINE_SETS.UPGRADE.INSTRUCTIONS',
                };
            }
            return {
                e2eAttributeSuffix: 'OtherAccountsHeadlineContent',
                headlineKey: 'HEADLINE_SETS.WITHOUT_STREAMING.HEADLINE',
                instructionsKey: 'HEADLINE_SETS.WITHOUT_STREAMING.INSTRUCTIONS',
            };
        })
    );
    private _allSubscriptions$ = this._subscriptions$.pipe(
        map((subscriptions) => [
            ...subscriptions.subscriptionsWithStreaming,
            ...subscriptions.subscriptionsNeedingUpgrade,
            ...subscriptions.subscriptionsInactive,
            ...subscriptions.subscriptionsNeedingPayment,
        ])
    );
    private _showAllRequested$ = new BehaviorSubject(false);
    subscriptionsToShow$ = combineLatest([this._allSubscriptions$, this._showAllRequested$, this.headlineContent$]).pipe(
        map(([allSubscriptions, showAllRequested, { headlineKey }]) => {
            const subscriptions = allSubscriptions.length <= 3 || showAllRequested ? allSubscriptions : allSubscriptions.slice(0, 3);
            let othersHeadlineShown = headlineKey !== 'HEADLINE_SETS.WITH_STREAMING.HEADLINE';
            return subscriptions.map((subscription, index) => {
                const qualifiesForOthersHeadline = index > 0 && subscription.ctaType !== 'CreateLogin' && subscription.ctaType !== 'ListenNow';
                const sub = {
                    ...subscription,
                    showOtherAccountsHeadlineBefore: !othersHeadlineShown && qualifiesForOthersHeadline,
                };
                if (sub.showOtherAccountsHeadlineBefore) {
                    othersHeadlineShown = true;
                }
                return sub;
            });
        })
    );
    showLoadMoreButton$ = combineLatest([this._allSubscriptions$, this.subscriptionsToShow$]).pipe(
        map(([allSubscriptions, subscriptionsToShow]) => allSubscriptions.length > subscriptionsToShow.length)
    );

    constructor(
        private readonly _store: Store,
        private readonly _openNativeAppService: OpenNativeAppService,
        @Inject(DOCUMENT) document: Document,
        public translate: TranslateService,
        private _loadAccountForSelectedRadioIdService: LoadAccountForSelectedRadioIdService,
        private _router: Router
    ) {
        this._window = document?.defaultView;
    }

    ngAfterViewInit(): void {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'multipleaccountsfound' }));
    }

    onListenNowClick() {
        const link = this.translate.instant('DeCareUseCasesStreamingFeatureSetupCredentialsModule.Shared.PLAYER_LINK');
        if (link) {
            this._window.open(link, '_self');
        } else {
            this._openNativeAppService.openSxmPlayerApp();
        }
    }

    onCreateLoginClick(event) {
        this._store.dispatch(collectSelectedRadioIdLastFour({ selectedRadioIdLastFour: event?.last4DigitsOfRadioId }));
    }

    onReactivateClick(subs) {
        this._store.dispatch(collectSelectedRadioIdLastFour({ selectedRadioIdLastFour: subs.last4DigitsOfRadioId }));
        this._loadAccountForSelectedRadioIdService.build().subscribe((data) => {
            if (data) {
                const radioId = subs.last4DigitsOfRadioId;
                const act = subs.last4DigitsOfAccountNumber;
                this._router.navigate(['subscribe', 'checkout'], { queryParams: { RadioID: radioId, act: act, isIdentifiedUser: true } });
            }
        });
    }

    onUpgradeClick(subs, url) {
        const radioId = subs.last4DigitsOfRadioId;
        const act = subs.last4DigitsOfAccountNumber;
        const translateUrl = this.translate.instant(url);
        this._window.location.href = translateUrl + `?RadioID=${radioId}&act=${act}`;
    }

    makePayment(subs, url) {
        const translateUrl = this.translate.instant(url);
        const token = subs.deviceToken;
        this._window.location.href = translateUrl + `?dtok=${token}&ref=Onboarding`;
    }

    loadMoreRadios() {
        this._showAllRequested$.next(true);
    }
}
