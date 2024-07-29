import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { DataRegisterService } from '@de-care/data-services';
import { selectConfirmationData } from '@de-care/de-care-use-cases/roll-to-drop/state-streaming-tokenized';
import { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';
import { RegisterDataModel } from '@de-care/domains/account/state-account';
import { RegisterCredentialsState } from '@de-care/domains/account/ui-register';
import { setProvinceSelectionVisibleIfCanada } from '@de-care/domains/customer/state-locale';
import { behaviorEventImpressionForPage } from '@de-care/shared/state-behavior-events';
import { getFeatureFlagEnableQuoteSummary } from '@de-care/shared/state-feature-flags';
import { select, Store } from '@ngrx/store';
import { of, Subject } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';
import { getSubscriptionIdForNewAccount } from '@de-care/de-care-use-cases/roll-to-drop/state-shared';
import { ScrollService } from '@de-care/shared/browser-common/window-scroll';

@Component({
    selector: 'de-care-confirmation-page',
    templateUrl: './confirmation-page.component.html',
    styleUrls: ['./confirmation-page.component.scss'],
})
export class ConfirmationPageComponent implements OnInit, AfterViewInit, OnDestroy {
    translateKeyPrefix = 'deCareUseCasesRollToDropFeatureStreamingTokenized.confirmationPageComponent.';
    registerCredentialsState = RegisterCredentialsState.None;
    registrationCompleted = false;

    enableQuoteSummaryFeatureToggle$ = this._store.pipe(select(getFeatureFlagEnableQuoteSummary));
    confirmationData$ = this._store.pipe(select(selectConfirmationData));
    subscriptionIdForNewAccount$ = this._store.pipe(select(getSubscriptionIdForNewAccount));

    private unsubscribe$: Subject<void> = new Subject();

    constructor(private readonly _store: Store, private readonly _dataRegisterService: DataRegisterService, private readonly _scrollService: ScrollService) {}

    ngOnInit() {
        this._store.dispatch(setProvinceSelectionVisibleIfCanada({ isVisible: false }));
        this._store.dispatch(behaviorEventImpressionForPage({ pageKey: 'CHECKOUT', componentKey: 'Confirmation' }));
        this._store.dispatch(pageDataFinishedLoading());
    }

    ngAfterViewInit() {
        this._store.dispatch(pageDataFinishedLoading());
        this._scrollService.scrollToElementBySelector('listen-now');
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    onRegisterAccount($event: RegisterDataModel): void {
        const registerData = $event.userName ? $event : { ...$event };

        this._dataRegisterService
            .registerAccount(registerData)
            .pipe(
                takeUntil(this.unsubscribe$),
                catchError((err) => of(err))
            )
            .subscribe((response) => (this.registrationCompleted = response.status === 'SUCCESS'));
    }

    onSubmit(): void {
        // TODO: event tracking
    }
}
