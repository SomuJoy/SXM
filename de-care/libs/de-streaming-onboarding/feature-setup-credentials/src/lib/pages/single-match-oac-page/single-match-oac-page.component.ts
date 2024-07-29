import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import {
    FindAccountByFlepzWorkflowService,
    backToSignInOverlay,
    getInboundQueryParamsAsString,
    selectSelectedSubscriptionSummaryViewModel
} from '@de-care/de-streaming-onboarding/state-setup-credentials';
import { select, Store } from '@ngrx/store';
import { getLegacyOnboardingBaseUrl } from '@de-care/de-streaming-onboarding/state-settings';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { map, takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { getIsCanadaMode } from '@de-care/shared/state-settings';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';

@Component({
    selector: 'de-streaming-onboarding-single-match-oac-page',
    templateUrl: './single-match-oac-page.component.html',
    styleUrls: ['./single-match-oac-page.component.scss']
})
export class SingleMatchOACPageComponent implements AfterViewInit, OnDestroy {
    subscriptions$ = this._store.pipe(select(selectSelectedSubscriptionSummaryViewModel));
    translateKeyPrefix = 'DeStreamingOnboardingFeatureSetupCredentialsModule.SingleMatchOACPageComponent.';
    accountDetails: any;
    accountNumber: string;
    currentPlanId: string;
    radioId: string;
    deviceYear: Number;
    deviceModel: string;
    deviceMake: string;
    private _currentLang$ = new BehaviorSubject<string>('');
    private _destroy$ = new Subject<boolean>();
    legacyOnboardingBaseUrl$ = combineLatest([
        this._store.select(getLegacyOnboardingBaseUrl),
        this._store.select(getInboundQueryParamsAsString),
        this._store.select(getIsCanadaMode),
        this._currentLang$
    ]).pipe(
        map(([baseUrl, queryParams, isCanadaMode, lang]) => {
            let finalUrl = `${baseUrl}?recoverlogin=true`;
            if (isCanadaMode) {
                const langPref = lang?.split('-')?.[0]?.toLowerCase();
                if (langPref) {
                    finalUrl = `${finalUrl}&langpref=${langPref}`;
                }
            }
            return queryParams ? `${finalUrl}&${queryParams}` : finalUrl;
        })
    );

    constructor(
        private readonly _findAccountByFlepzWorkflowService: FindAccountByFlepzWorkflowService,
        private readonly _store: Store,
        private readonly _translateService: TranslateService
    ) {
        this._currentLang$.next(this._translateService.currentLang);
        this._translateService.onLangChange.pipe(takeUntil(this._destroy$)).subscribe(({ lang }) => this._currentLang$.next(lang));
    }

    ngAfterViewInit(): void {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'singleaccountmatchexistingcredentials' }));
    }

    onSignInClick() {
        this._store.dispatch(backToSignInOverlay());
    }

    ngOnDestroy(): void {
        this._destroy$.next(true);
        this._destroy$.unsubscribe();
    }
    recover() {
        this.legacyOnboardingBaseUrl$.subscribe(result => {
            window.location.href = result;
        });
    }
}
