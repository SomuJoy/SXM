import { Component, Inject, OnDestroy } from '@angular/core';
import {
    collectFlepzData,
    collectSelectedRadioIdLastFour,
    selectInvalidEmailError,
    selectInvalidFirstNameError,
    selectInboundQueryParamsFreeListenCampaignId,
    LoadAccountForSelectedRadioIdService,
} from '@de-care/de-care-use-cases/streaming/state-setup-credentials';
import { LookupCompletedData } from '@de-care/domains/identity/ui-streaming-flepz-lookup-form';
import { ActivatedRoute, Router } from '@angular/router';
import { OpenNativeAppService } from '@de-care/domains/utility/state-native-app-integration';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { DOCUMENT } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

@Component({
    selector: 'de-care-find-account-page',
    templateUrl: './find-account-page.component.html',
    styleUrls: ['./find-account-page.component.scss'],
})
export class FindAccountPageComponent implements OnDestroy {
    private _translateSubscription: Subscription;
    translateKeyPrefix = 'DeCareUseCasesStreamingFeatureSetupCredentialsModule.FindAccountPageComponent.';
    translateKeyPrefixShared = 'DeCareUseCasesStreamingFeatureSetupCredentialsModule.Shared.';
    private readonly _window: Window;

    isInvalidEmailError: any;
    isInvalidFirstNameError: any;
    isFreeListenCopy: boolean;
    freeListen$ = this._store.pipe(select(selectInboundQueryParamsFreeListenCampaignId));

    constructor(
        private readonly _router: Router,
        private readonly _activatedRoute: ActivatedRoute,
        private readonly _store: Store,
        private readonly _openNativeAppService: OpenNativeAppService,
        private readonly _translateService: TranslateService,
        @Inject(DOCUMENT) document,
        private _titleService: Title,
        private _loadAccountForSelectedRadioIdService: LoadAccountForSelectedRadioIdService
    ) {
        this._translateSubscription = this._translateService.stream(`${this.translateKeyPrefixShared}PAGE_TITLE`).subscribe((pageTitle) => {
            this._titleService.setTitle(pageTitle);
        });
        this._window = document && document.defaultView;
        this._store.select(selectInvalidEmailError).subscribe((data) => {
            this.isInvalidEmailError = data;
        });
        this._store.select(selectInvalidFirstNameError).subscribe((data) => {
            this.isInvalidFirstNameError = data;
        });
    }
    ngOnDestroy() {
        this._translateSubscription?.unsubscribe();
    }

    onSignInRequested() {
        const link = this._translateService.instant('DeCareUseCasesStreamingFeatureSetupCredentialsModule.Shared.PLAYER_LINK');
        if (link) {
            this._window.open(link, '_self');
        } else {
            this._openNativeAppService.openSxmPlayerApp();
        }
    }

    onLookupCompleted({ flepzData, totalSubscriptionsFound, ineligibleReason, singleResultRadioIdLastFour }: LookupCompletedData) {
        this._store.dispatch(collectFlepzData({ flepzData }));
        if (totalSubscriptionsFound === 0) {
            this._router.navigate(['./no-match'], { relativeTo: this._activatedRoute });
        } else if (totalSubscriptionsFound === 1) {
            this._store.dispatch(collectSelectedRadioIdLastFour({ selectedRadioIdLastFour: singleResultRadioIdLastFour }));
            switch (ineligibleReason) {
                case 'NoAudio': {
                    this._router.navigate(['./ineligible-no-audio'], { relativeTo: this._activatedRoute });
                    break;
                }
                case 'SingleMatchOAC': {
                    this._loadAccountForSelectedRadioIdService.build().subscribe();
                    this._router.navigate(['./existing-credentials'], { relativeTo: this._activatedRoute });
                    break;
                }
                case 'NeedsCredentials': {
                    this._router.navigate(['./credential-setup'], { relativeTo: this._activatedRoute });
                    break;
                }
                case 'NonPay': {
                    this._router.navigate(['./ineligible-non-pay'], { relativeTo: this._activatedRoute });
                    break;
                }
                case 'NonConsumer': {
                    this._router.navigate(['./ineligible-non-consumer'], { relativeTo: this._activatedRoute });
                    break;
                }
                case 'TrialWithinLastTrialDate': {
                    this._router.navigate(['./ineligible-trial-within-last-trial-date'], { relativeTo: this._activatedRoute });
                    break;
                }
                case 'MaxLifetimeTrials': {
                    this._router.navigate(['./ineligible-max-lifetime-trials'], { relativeTo: this._activatedRoute });
                    break;
                }
                case 'InsufficientPackage': {
                    this._router.navigate(['./ineligible-insufficient-package'], { relativeTo: this._activatedRoute });
                    break;
                }
                case 'ExpiredAATrial': {
                    this._router.navigate(['./ineligible-expired-AA-trial'], { relativeTo: this._activatedRoute });
                    break;
                }
                case 'InActive': {
                    this._router.navigate(['./inactive-subscription'], { relativeTo: this._activatedRoute });
                    break;
                }
                case 'MultipleSubscription': {
                    this._router.navigate(['./multiple-subscriptions-page'], { relativeTo: this._activatedRoute });
                    break;
                }
                case 'NoMatch': {
                    this._router.navigate(['./no-match'], { relativeTo: this._activatedRoute });
                    break;
                }
            }
        } else if (totalSubscriptionsFound > 1) {
            this._router.navigate(['./multiple-subscriptions-page'], { relativeTo: this._activatedRoute });
        }
    }
}
