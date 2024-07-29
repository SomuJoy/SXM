import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SxmUiNavDropdownComponent } from '@de-care/shared/sxm-ui/navigation/ui-navigation';
import { catchError, flatMap, map, switchMap, take, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { combineLatest, of, Subject, throwError } from 'rxjs';
import { NavigationElementsBaseUrls, NAVIGATION_ELEMENTS_BASE_URLS } from '../tokens';
import { AccountPresenceStore } from './account-presence-store.component';
import { AccountPresenceService } from './account-presence.service';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { behaviorEventImpressionForAccountSnapshotAlertDisplayed } from '@de-care/shared/state-behavior-events';
import { Store } from '@ngrx/store';
import { LogoutWorkflowService } from '@de-care/domains/account/state-login';
import { NextBestAction } from '@de-care/domains/account/state-next-best-actions';
import { TranslateService } from '@ngx-translate/core';

export interface AccountPresenceIconsComponentApi {
    closePanels: () => void;
}

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'account-presence-icons',
    templateUrl: './account-presence-icons.component.html',
    styleUrls: ['./account-presence-icons.component.scss'],
    providers: [AccountPresenceStore, AccountPresenceService],
})
export class AccountPresenceIconsComponent implements ComponentWithLocale, OnInit, OnDestroy, AccountPresenceIconsComponentApi {
    languageResources: LanguageResources;
    translateKeyPrefix: string;

    @ViewChild('alerts') private readonly _alertsDropdownComponent: SxmUiNavDropdownComponent;
    @ViewChild('user') private readonly _userDropdownComponent: SxmUiNavDropdownComponent;
    private readonly _window: Window;

    careUrl = this._baseUrls.careUrl;
    oacUrl = this._baseUrls.oacUrl;
    dotComUrl = this._baseUrls.dotComUrl?.length ? this._baseUrls.dotComUrl : 'https://www.siriusxm.com/';

    isKnown = false; // this indicates whether it is unidentified (false) or either identified or loggedIn (true)
    isLoading = true;
    showUserPanelLoading = true;
    identifiedThroughLogin = false;
    fadeIn = true;
    isProcessingLogin = false;
    failedToLoadAccount = false;

    firstName$ = this._accountPresenceStore.firstName$;
    alerts$ = this._accountPresenceStore.alerts$;
    alertsToDisplay$ = this._accountPresenceStore.alertsToDisplay$;
    identificationState$ = this._accountPresenceStore.identificationState$;
    loading$ = this._accountPresenceStore.loading$;
    alertCountFromStore$ = this._accountPresenceStore.alertCount$;
    nextBillingPaymentDate$ = this._accountPresenceStore.nextBillingPaymentDate$;
    convertTrialEndDate$ = this._accountPresenceStore.convertTrialEndDate$;

    // only send alert count when loading is finished
    alertCount$ = combineLatest([this.alertCountFromStore$, this.loading$]).pipe(
        map(([count, isLoading]) => {
            if (!isLoading) {
                return count;
            }
        })
    );
    isAlertCritical$ = this._accountPresenceStore.isAlertCritical$;
    private _destroy$ = new Subject<boolean>();

    constructor(
        private readonly _accountPresenceStore: AccountPresenceStore,
        private readonly _accountPresenceService: AccountPresenceService,
        readonly translationsForComponentService: TranslationsForComponentService,
        private readonly _logoutWorkflowService: LogoutWorkflowService,
        private readonly _translateService: TranslateService,
        @Inject(NAVIGATION_ELEMENTS_BASE_URLS) public readonly _baseUrls: NavigationElementsBaseUrls,
        private readonly _store: Store
    ) {
        translationsForComponentService.init(this);
        this._window = document.defaultView;
    }

    closePanels(): void {
        this._userDropdownComponent.open = false;
        this._alertsDropdownComponent.open = false;
    }

    ngOnInit(): void {
        this._accountPresenceStore.setloading(true);
        this._accountPresenceService
            .initializeLogin()
            .pipe(
                switchMap(() => this._accountPresenceService.loadNba()),
                take(1),
                withLatestFrom(this.identificationState$),
                flatMap(([, state]) => {
                    if (state === 'LOGGEDIN') {
                        return this._accountPresenceService.loadAccount().pipe(
                            tap(() => {
                                this._accountPresenceStore.setloading(false);
                            })
                        );
                    } else if (state === 'IDENTIFIED') {
                        return this._accountPresenceService.loadNonPiiAccount().pipe(
                            tap(() => {
                                this._accountPresenceStore.setloading(false);
                            })
                        );
                    } else {
                        // unidentified
                        this._clearAlerts();
                        this._accountPresenceStore.setloading(false);
                        return of(null);
                    }
                }),
                catchError((err) => {
                    // treat error like unidentified?
                    this._accountPresenceStore.setIdentificationState('UNIDENTIFIED');
                    this._clearAlerts();
                    this._accountPresenceStore.setloading(false);
                    return throwError(err);
                })
            )
            .subscribe();

        // only set isKnown when loading is complete
        combineLatest([this.identificationState$, this.loading$])
            .pipe(takeUntil(this._destroy$))
            .subscribe(([state, isLoading]) => {
                if (!isLoading) {
                    this.isKnown = state === 'IDENTIFIED' || state === 'LOGGEDIN' ? true : false;
                }
            });
        this.loading$
            .pipe(
                takeUntil(this._destroy$),
                tap((isLoading) => {
                    this.isLoading = isLoading;
                    if (this.isLoading === false) {
                        // only renders the fade-in in the half second after data is loaded (prevents user from seeing fade in from just clicking on panel toggle buttons)
                        this.fadeIn = true;
                        setTimeout(() => (this.fadeIn = false), 500);
                    }
                })
            )
            .subscribe();
    }

    ngOnDestroy(): void {
        this._destroy$.next(true);
        this._destroy$.unsubscribe();
    }

    onLoggedIn(): void {
        this._accountPresenceStore.setloading(true);
        this.isProcessingLogin = false;
        this.showUserPanelLoading = false;
        this.failedToLoadAccount = false;
        this._accountPresenceService
            .loadNba()
            .pipe(
                take(1),
                withLatestFrom(this.identificationState$),
                flatMap(([, state]) => {
                    this.identifiedThroughLogin = true;
                    if (state === 'LOGGEDIN') {
                        return this._accountPresenceService.loadAccount().pipe(
                            tap(() => {
                                this._accountPresenceStore.setloading(false);
                            })
                        );
                    } else {
                        return this._accountPresenceService.loadNonPiiAccount().pipe(
                            tap(() => {
                                this._accountPresenceStore.setloading(false);
                            })
                        );
                    }
                })
            )
            .subscribe({
                error: () => {
                    this._accountPresenceStore.setIdentificationState('UNIDENTIFIED');
                    this.isProcessingLogin = false;
                    this.isKnown = false;
                    this.failedToLoadAccount = true;
                    this._accountPresenceStore.setloading(false);
                },
            });
    }

    logout() {
        this._logoutWorkflowService.build({ source: 'PHX' }).subscribe(() => {
            this.onLoggedOut();
        });
    }

    onLoggedOut(): void {
        this.isKnown = false;
        this._accountPresenceStore.setIdentificationState('UNIDENTIFIED');
        this._clearAlerts();
    }

    onAlertsOpened() {
        this._userDropdownComponent.open = false;

        this.alerts$.pipe(take(1)).subscribe((alerts: NextBestAction[]) => {
            if (alerts.length == 0) return;
            const types = alerts.map((a) => a.type);
            return this._store.dispatch(behaviorEventImpressionForAccountSnapshotAlertDisplayed({ types }));
        });
    }

    onUserOpened() {
        this._alertsDropdownComponent.open = false;
    }

    onSignInClicked() {
        this._alertsDropdownComponent.open = false;
        this._userDropdownComponent.open = true;
    }

    private _clearAlerts() {
        this._accountPresenceStore.setNbaActions([]);
        this._accountPresenceStore.setAlerts([]);
    }

    onAlertLinkClicked($event: string) {
        combineLatest([this.alerts$, this.identificationState$, this._translateService.stream(`${this.translateKeyPrefix}.${$event}`)])
            .pipe(take(1))
            .subscribe(([alerts, state, alertRedirectingCopy]) => {
                const matchedAlert = alerts.find((alert) => alert.type === $event);
                if (state === 'LOGGEDIN' && alertRedirectingCopy.LINK_URL_LOGGEDIN) {
                    if (matchedAlert.type === 'PAYMENT_REMINDER' || matchedAlert.type === 'PAYMENT') {
                        const url = this._translateService.instant(`${this.translateKeyPrefix}.${$event}.LINK_URL_LOGGEDIN`, {
                            oacUrl: this.oacUrl,
                            careUrl: this.careUrl,
                        });
                        this.onRedirect(url, this._translateService.instant(`${this.translateKeyPrefix}.${$event}.TARGET`));
                    } else if (matchedAlert.type === 'UPGRADE' || matchedAlert.type === 'CREDENTIALS') {
                        const url = this._translateService.instant(`${this.translateKeyPrefix}.${$event}.LINK_URL_LOGGEDIN`, {
                            oacUrl: this.oacUrl,
                            careUrl: this.careUrl,
                            subscriptionId: matchedAlert.subscriptionId,
                        });
                        this.onRedirect(url, this._translateService.instant(`${this.translateKeyPrefix}.${$event}.TARGET`));
                    }
                } else {
                    if (matchedAlert.type === 'CREDENTIALS') {
                        const url = this._translateService.instant(
                            `${this.translateKeyPrefix}.${$event}.${
                                matchedAlert.accountRegistered ? `LINK_URL` : this.identifiedThroughLogin ? `LINK_URL_NO_REGISTRATION_STEP_UP` : `LINK_URL_NO_REGISTRATION`
                            }`,
                            {
                                oacUrl: this.oacUrl,
                                careUrl: this.careUrl,
                                subscriptionId: matchedAlert.subscriptionId,
                            }
                        );
                        this.onRedirect(url, this._translateService.instant(`${this.translateKeyPrefix}.${$event}.TARGET`));
                    } else {
                        const url = this._translateService.instant(`${this.translateKeyPrefix}.${$event}.LINK_URL`, {
                            oacUrl: this.oacUrl,
                            careUrl: this.careUrl,
                            radioId: matchedAlert.last4DigitsOfRadioId,
                            subscriptionId: matchedAlert.subscriptionId,
                        });
                        this.onRedirect(url, this._translateService.instant(`${this.translateKeyPrefix}.${$event}.TARGET`));
                    }
                }
            });
    }

    onRedirect(url: string, target: string) {
        if (target === 'openInNewTab') {
            this._window.open(url, target);
        } else {
            this._window.location.href = url;
        }
    }

    onLoginError() {
        this.isProcessingLogin = false;
    }
}
