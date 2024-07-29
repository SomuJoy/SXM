import { AfterViewInit, Component } from '@angular/core';
import {
    backToSignInOverlay,
    backToWelcome,
    getFlepzEmail,
    collectSelectedRadioIdLastFour,
    selectFlepzSubscriptionsFoundSummaryViewModel
} from '@de-care/de-streaming-onboarding/state-setup-credentials';
import { Store } from '@ngrx/store';
import { map, take, tap } from 'rxjs/operators';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { BehaviorSubject, combineLatest } from 'rxjs';

@Component({
    selector: 'de-streaming-onboarding-multiple-subscriptions-page',
    templateUrl: './multiple-subscriptions-page.component.html',
    styleUrls: ['./multiple-subscriptions-page.component.scss']
})
export class MultipleSubscriptionsPageComponent implements AfterViewInit {
    translateKeyPrefix = 'DeStreamingOnboardingFeatureSetupCredentialsModule.MultipleSubscriptionsPageComponent.';
    isNostreaming = false;
    _maxPerPage = 3;
    _currentPageIndex = 0;
    _pageIndex$ = new BehaviorSubject(this._currentPageIndex);
    _totalPages$ = new BehaviorSubject(0);

    // stream of subscriptions for display
    subscriptions$ = combineLatest([
        this._store.select(selectFlepzSubscriptionsFoundSummaryViewModel).pipe(
            tap(subscriptions => {
                this._totalPages$.next(Math.ceil(subscriptions.length / this._maxPerPage));
                this.isNostreaming = subscriptions.every(subscription => subscription.eligibilityType === 'FREE_PREVIEW');
            }),
            // sort by CTA
            map(subscriptions => [
                ...subscriptions.filter(subscription => subscription.eligibilityType === 'CREATE_LOGIN'),
                ...subscriptions.filter(subscription => subscription.eligibilityType === 'LISTEN_NOW'),
                ...subscriptions.filter(subscription => subscription.eligibilityType === 'FREE_PREVIEW')
            ])
        ),
        this._pageIndex$.pipe(
            map(pageIndex => {
                const startIndex = pageIndex * this._maxPerPage;
                return {
                    startIndex,
                    endIndex: startIndex + this._maxPerPage
                };
            })
        )
    ]).pipe(
        // pagination
        map(([subscriptions, indexes]) => subscriptions.slice(indexes.startIndex, indexes.endIndex))
    );

    constructor(private readonly _store: Store) {}

    ngAfterViewInit(): void {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'multipleaccountsfound' }));
    }
    onSignInClick() {
        this._store.dispatch(backToSignInOverlay());
    }

    onPreviewClick() {
        this._store.dispatch(backToWelcome());
    }
    createLogin(event) {
        this._store.dispatch(collectSelectedRadioIdLastFour({ selectedRadioIdLastFour: event?.last4DigitsOfRadioId }));
        if (event) {
            const data = {
                event: event,
                type: 'multiple',
                flepzEmail: ''
            };
            this._store
                .select(getFlepzEmail)
                .pipe(take(1))
                .subscribe(flepzEmail => {
                    data.flepzEmail = flepzEmail;
                });
        }
    }

    loadMoreradios() {
        this._currentPageIndex++;
        this._pageIndex$.next(this._currentPageIndex);
    }

    loadPreviousradios() {
        this._currentPageIndex--;
        this._pageIndex$.next(this._currentPageIndex);
    }
}
