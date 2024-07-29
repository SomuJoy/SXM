import { Component, OnInit, OnDestroy, AfterViewInit, Inject } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';
import {
    getConfirmationData,
    getSubscriptionInfo,
    getTransferFromInfo,
    getIsModeServiceContinuity,
    getRemoveOldRadioId,
    getIsLoggedIn,
} from '@de-care/de-care-use-cases/transfer/state-acsc-targeted';
import { getFeatureFlagEnableQuoteSummary } from '@de-care/shared/state-feature-flags';
import { PrintService } from '@de-care/shared/browser-common/window-print';
import { tap, takeUntil, catchError, withLatestFrom } from 'rxjs/operators';
import { PasswordError, RegisterCredentialsState } from '@de-care/domains/account/ui-register';
import { RegisterWorkflowService } from '@de-care/domains/account/state-account';
import { Subject, of } from 'rxjs';
import { scrollToTop } from '@de-care/browser-common';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { getLanguagePrefix } from '@de-care/domains/customer/state-locale';
import { DOCUMENT } from '@angular/common';
import { SettingsService } from '@de-care/settings';

@Component({
    selector: 'de-care-confirmation-page',
    templateUrl: './confirmation-page.component.html',
    styleUrls: ['./confirmation-page.component.scss'],
})
export class ConfirmationPageComponent implements OnInit, AfterViewInit, OnDestroy {
    translateKeyPrefix = 'DeCareUseCasesTransferFeatureACSCTargetedModule.ConfirmationPageComponent.';
    confirmationData$ = this._store.pipe(
        select(getConfirmationData),
        tap((data) => {
            this.setupRegisterCredentialsState(data.registerData.account);
        })
    );
    subscriptionData$ = this._store.pipe(select(getSubscriptionInfo));
    transferFromData$ = this._store.pipe(select(getTransferFromInfo));
    enableQuoteSummaryFeatureToggle$ = this._store.pipe(select(getFeatureFlagEnableQuoteSummary));
    getIsModeServiceContinuity$ = this._store.pipe(select(getIsModeServiceContinuity));
    getRemoveOldRadioId$ = this._store.pipe(select(getRemoveOldRadioId));
    getIsLoggedIn$ = this._store.pipe(select(getIsLoggedIn));
    registerCredentialState: RegisterCredentialsState = RegisterCredentialsState.All;
    registrationCompleted: boolean;
    passwordError: PasswordError = null;
    private unsubscribe$: Subject<void> = new Subject();
    private readonly _window: Window;

    constructor(
        private readonly _printService: PrintService,
        private readonly _store: Store,
        private readonly _registerWorkFlowService: RegisterWorkflowService,
        private readonly _settingsService: SettingsService,
        @Inject(DOCUMENT) document
    ) {
        this._window = document && document.defaultView;
    }

    ngOnInit() {
        this._store.dispatch(pageDataFinishedLoading());
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'confirmation' }));
    }
    ngAfterViewInit() {
        scrollToTop();
    }
    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    onPrintClick(): void {
        this._printService.print();
    }

    onRegisterAccount($event) {
        const registrationData = $event.userName ? $event : { ...$event };
        this._registerWorkFlowService
            .build({ registrationData })
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

    onGoToMyAccount(): void {
        this._store.pipe(select(getLanguagePrefix)).subscribe((lang) => {
            const langPref = lang === 'en' ? '' : `&langpref=${lang}`;
            this._window.location.href = `${this._settingsService.settings.oacUrl}login_view.action?reset=true${langPref}`;
        });
    }

    private setupRegisterCredentialsState(data): void {
        const useEmailAsUserName = data.useEmailAsUserName;
        this.registerCredentialState = useEmailAsUserName ? RegisterCredentialsState.PasswordOnly : RegisterCredentialsState.All;
    }
}
