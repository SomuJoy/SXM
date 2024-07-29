import { setProvinceSelectionVisibleIfCanada } from '@de-care/domains/customer/state-locale';
import { takeUntil, catchError } from 'rxjs/operators';
import { RegisterDataModel, DataRegisterService } from '@de-care/data-services';
import { RegisterCredentialsState } from '@de-care/domains/account/ui-register';
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Subject, of } from 'rxjs';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { getFeatureFlagEnableQuoteSummary } from '@de-care/shared/state-feature-flags';
import { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';
import { selectConfirmationData } from '@de-care/de-care-use-cases/roll-to-drop/state-streaming';
import { getSubscriptionIdForNewAccount } from '@de-care/de-care-use-cases/roll-to-drop/state-shared';
import { ScrollService } from '@de-care/shared/browser-common/window-scroll';

@Component({
    selector: 'de-care-confirmation-page',
    templateUrl: './confirmation-page.component.html',
    styleUrls: ['./confirmation-page.component.scss'],
})
export class ConfirmationPageComponent implements OnInit, AfterViewInit, OnDestroy {
    translateKeyPrefix = 'deCareUseCasesRollToDropFeatureStreaming.confirmationPageComponent.';
    registerCredentialsState = RegisterCredentialsState.None;
    registrationCompleted = false;

    enableQuoteSummaryFeatureToggle$ = this._store.pipe(select(getFeatureFlagEnableQuoteSummary));
    confirmationData$ = this._store.pipe(select(selectConfirmationData));
    subscriptionIdForNewAccount$ = this._store.pipe(select(getSubscriptionIdForNewAccount));

    private unsubscribe$: Subject<void> = new Subject();

    constructor(private readonly _store: Store, private readonly _dataRegisterService: DataRegisterService, private readonly _scrollService: ScrollService) {}

    ngOnInit() {
        this._store.dispatch(setProvinceSelectionVisibleIfCanada({ isVisible: false }));
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'Confirmation' }));
        this._store.dispatch(pageDataFinishedLoading());
    }

    ngAfterViewInit() {
        this._store.dispatch(pageDataFinishedLoading());
        this._scrollService.scrollToElementBySelector('listen-now');
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    onRegisterAccount($event: RegisterDataModel): void {
        const registerData = $event.userName ? $event : { ...$event };

        this._dataRegisterService
            .registerAccount(registerData)
            .pipe(
                takeUntil(this.unsubscribe$),
                catchError((err) => {
                    // TODO: event tracking
                    return of(err);
                })
            )
            .subscribe((resp) => {
                this.registrationCompleted = resp.status === 'SUCCESS';
            });
    }

    onSubmit(): void {
        // TODO: event tracking
    }
}
