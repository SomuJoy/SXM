import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostListener, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import {
    AccountLogoutWorkflowService,
    getAccountBillingSummaryAmountDue,
    getAccountPresenceViewModel,
    getAlerts,
    getAlertsCount,
    getAlertsToDisplay,
    getConvertTrialEndDate,
    getIdentificationState,
    getIsAlertCritical,
    userSetLanguage,
} from '@de-care/de-care-use-cases/account/state-my-account';
import { Store } from '@ngrx/store';
import { OAC_BASE_URL } from '@de-care/shared/configuration-tokens-oac';
import { FullBrowserRedirect } from '@de-care/shared/browser-common/util-redirect';
import { SxmUiNavDropdownComponent } from '@de-care/shared/sxm-ui/navigation/ui-navigation';
import { NavigationEnd, Params, Router } from '@angular/router';
import { filter, take, takeUntil, tap } from 'rxjs/operators';
import { behaviorEventImpressionForAccountSnapshotAlertDisplayed } from '@de-care/shared/state-behavior-events';
import { combineLatest, Subject } from 'rxjs';
import { APP_BASE_HREF } from '@angular/common';
import { ToastNotificationService } from '@de-care/shared/sxm-ui/ui-toast-notification';
import { ScrollService } from '@de-care/shared/browser-common/window-scroll';
import { SxmUiHoverDropdownComponent } from '@de-care/shared/sxm-ui/utility/ui-hover-dropdown';

type ExternalTabTypes = 'BILLING' | 'ACCOUNT_INFORMATION' | 'CONTACT_PREFERENCES';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'my-account-shell',
    templateUrl: './shell.component.html',
    styleUrls: ['./shell.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShellComponent implements ComponentWithLocale, OnInit, OnDestroy {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    accountPresenceViewModel$ = this._store.select(getAccountPresenceViewModel);
    alerts$ = this._store.select(getAlerts);
    alertsToDisplay$ = this._store.select(getAlertsToDisplay);
    convertTrialEndDate$ = this._store.select(getConvertTrialEndDate);
    alertCount$ = this._store.select(getAlertsCount);
    isAlertCritical$ = this._store.select(getIsAlertCritical);
    identificationState$ = this._store.select(getIdentificationState);
    billingSummaryAmountDue$ = this._store.select(getAccountBillingSummaryAmountDue);

    oacUrl = this._oacBaseUrl;
    toastNotification: string;
    showToastNotification = false;
    isAccountInformationRouteActive = false; //needed for firefox which does not support :has() so the account-info tab needs to be told when it's child routes are active
    isContactPreferencesRouteActive = false; //needed for firefox which does not support :has() so the account-info tab needs to be told when it's child routes are active
    isBillingRouteActive = false; // TODO: remove this when billing route gets added to CA
    @ViewChild('alerts') private readonly _alertsDropdownComponent: SxmUiNavDropdownComponent;
    @ViewChild('user') private readonly _userDropdownComponent: SxmUiNavDropdownComponent;
    @ViewChild('accountInfoDropdown') readonly accountInfoDropdownComponent: SxmUiHoverDropdownComponent;
    private readonly _window: Window;
    private readonly _unsubscribe$: Subject<void> = new Subject();

    @HostListener('click', ['$event.target']) onClick(event: HTMLElement) {
        if (event?.getAttribute('id') !== 'accountPresenceIcon' && this._userDropdownComponent?.isOpened) {
            this._userDropdownComponent.open = false;
        }
        if (event?.getAttribute('id') !== 'alertPresenceIcon' && this._alertsDropdownComponent?.isOpened) {
            this._alertsDropdownComponent.open = false;
        }
    }

    constructor(
        readonly translationsForComponentService: TranslationsForComponentService,
        private readonly _store: Store,
        private readonly _accountLogoutWorkflowService: AccountLogoutWorkflowService,
        private readonly _fullBrowserRedirect: FullBrowserRedirect,
        private _router: Router,
        private readonly _toastNotificationService: ToastNotificationService,
        private readonly _scrollService: ScrollService,
        @Inject(APP_BASE_HREF) private readonly _appBaseHref: string,
        @Inject(OAC_BASE_URL) private readonly _oacBaseUrl: string,
        @Inject(DOCUMENT) document: Document
    ) {
        translationsForComponentService.init(this);
        this._window = document.defaultView;

        // TODO: this is temporary until account-info and billing pages are built in phx for US and CA, then we can switch to routerlink
        this._router.events
            .pipe(
                takeUntil(this._unsubscribe$),
                filter((e) => e instanceof NavigationEnd),
                tap((evt: NavigationEnd) => {
                    // need to manually set this since we are not using routerLink
                    this.isBillingRouteActive = evt.url.includes('/billing');
                })
            )
            .subscribe();
    }

    ngOnInit(): void {
        this._toastNotificationService
            .getNotification()
            .pipe(takeUntil(this._unsubscribe$))
            .subscribe((notification) => {
                this._scrollService.scrollToTop();
                this.toastNotification = notification;
                this.showToastNotification = true;
            });
    }

    changeLanguage(lang: string) {
        this._store.dispatch(userSetLanguage({ lang }));
    }

    onAlertsOpened() {
        this.alerts$.pipe(take(1)).subscribe((alerts) => {
            if (alerts.length == 0) return;
            const types = alerts.map((a) => a.type);
            return this._store.dispatch(behaviorEventImpressionForAccountSnapshotAlertDisplayed({ types }));
        });
    }

    logout() {
        this._accountLogoutWorkflowService.build().subscribe(() => {
            this._window.location.href = this.translationsForComponentService.instant(`${this.translateKeyPrefix}.SXM_URL_LINK`);
        });
    }

    onAlertLinkClicked($event: string) {
        combineLatest([this.alerts$, this.identificationState$])
            .pipe(takeUntil(this._unsubscribe$))
            .subscribe(([alerts, state]) => {
                const matchedAlert = alerts.find((alert) => alert.type === $event);

                switch ($event) {
                    case 'PAYMENT':
                    case 'PAYMENT_REMINDER':
                        if (state === 'LOGGEDIN') {
                            this._router.navigateByUrl(this.translationsForComponentService.instant(`${this.translateKeyPrefix}.${$event}.LINK_ROUTER_LOGGEDIN`));
                        } else {
                            this._window.location.href = this.translationsForComponentService.instant(`${this.translateKeyPrefix}.${$event}.LINK_URL`, {
                                oacUrl: this.oacUrl,
                            });
                        }
                        break;
                    case 'SC_AC':
                        this._window.location.href =
                            new URL(this._window.location.href).origin +
                            this._appBaseHref +
                            this.translationsForComponentService.instant(`${this.translateKeyPrefix}.${$event}.LINK_ROUTER`);
                        break;
                    case 'CONVERT':
                        if (this.translationsForComponentService.instant(`${this.translateKeyPrefix}.${$event}.TARGET`) === 'openInNewTab') {
                            const queryParams: Params = { radioId: '**' + matchedAlert.last4DigitsOfRadioId, programcode: 'TRIALEXT', isIdentifiedUser: true };
                            const urlTree = this._router.createUrlTree(
                                [this._appBaseHref + this.translationsForComponentService.instant(`${this.translateKeyPrefix}.${$event}.LINK_ROUTER_WITHOUT_QUERYPARAMS`)],
                                { queryParams: queryParams }
                            );
                            const url = this._router.serializeUrl(urlTree);
                            this._window.open(url, this.translationsForComponentService.instant(`${this.translateKeyPrefix}.${$event}.TARGET`));
                        } else {
                            this._router.navigateByUrl(
                                this.translationsForComponentService.instant(`${this.translateKeyPrefix}.${$event}.LINK_ROUTER`, {
                                    radioId: matchedAlert.last4DigitsOfRadioId,
                                })
                            );
                        }
                        break;
                    case 'UPGRADE':
                        if (state === 'LOGGEDIN') {
                            this._router.navigateByUrl(
                                this.translationsForComponentService.instant(`${this.translateKeyPrefix}.${$event}.LINK_ROUTER_LOGGEDIN`, {
                                    subscriptionId: matchedAlert.subscriptionId,
                                })
                            );
                        } else {
                            this._router.navigateByUrl(
                                this.translationsForComponentService.instant(`${this.translateKeyPrefix}.${$event}.LINK_ROUTER`, {
                                    radioId: matchedAlert.last4DigitsOfRadioId,
                                })
                            );
                        }
                        break;
                    case 'DEVICES':
                        this.onRedirect(
                            this.translationsForComponentService.instant(`${this.translateKeyPrefix}.${$event}.LINK_URL`),
                            this.translationsForComponentService.instant(`${this.translateKeyPrefix}.${$event}.TARGET`)
                        );
                        break;

                    case 'CONTENT': {
                        this.onRedirect(
                            this.translationsForComponentService.instant(`${this.translateKeyPrefix}.${$event}.LINK_URL`),
                            this.translationsForComponentService.instant(`${this.translateKeyPrefix}.${$event}.TARGET`)
                        );
                        break;
                    }
                    case 'CREDENTIALS':
                        if (state === 'LOGGEDIN') {
                            this._window.location.href = this.translationsForComponentService.instant(`${this.translateKeyPrefix}.${$event}.LINK_URL_LOGGEDIN`, {
                                subscriptionId: matchedAlert.subscriptionId,
                                oacUrl: this.oacUrl,
                            });
                        } else {
                            this._router.navigateByUrl(
                                this.translationsForComponentService.instant(
                                    `${this.translateKeyPrefix}.${$event}.${
                                        !matchedAlert.subHasStreamingCredentials && matchedAlert.accountRegistered ? `LINK_URL` : `LINK_URL_NO_REGISTRATION`
                                    }`,
                                    {
                                        oacUrl: this.oacUrl,
                                        subscriptionId: matchedAlert.subscriptionId,
                                    }
                                )
                            );
                        }
                        break;
                    case 'REACTIVATE':
                        this._router.navigateByUrl(this.translationsForComponentService.instant(`${this.translateKeyPrefix}.${$event}.LINK_ROUTER`), {
                            state: { radioId: matchedAlert.last4DigitsOfRadioId },
                        });
                        break;
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

    ngOnDestroy() {
        this._unsubscribe$.next();
        this._unsubscribe$.complete();
    }

    closePanels(): void {
        this._userDropdownComponent.open = false;
        this._alertsDropdownComponent.open = false;
    }

    onToastAnimationFinished() {
        this.showToastNotification = false;
    }
}
