import { DOCUMENT } from '@angular/common';
import { Component, ChangeDetectionStrategy, NgModule, ViewChild, HostListener, Inject, OnInit } from '@angular/core';
import { ReactiveComponentModule } from '@ngrx/component';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import {
    SharedSxmUiAlertsPanelLoggedInModule,
    SxmUiAccountPresenceIconModule,
    SxmUiAlertsIconModule,
    SxmUiMyAccountPanelLoggedInComponentModule,
    SxmUiNavDropdownComponent,
    SxmUiNavDropdownModule,
} from '@de-care/shared/sxm-ui/navigation/ui-navigation';
import { SharedSxmUiUiDataClickTrackModule } from '@de-care/shared/sxm-ui/ui-data-click-track';
import { DeCareSharedUiPageFooterBasicModule } from '@de-care/de-care/shared/ui-page-footer-basic';
import { APP_BASE_HREF, CommonModule } from '@angular/common';
import { Params, Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { DomainsAccountStateAccountModule, getAccountBillingSummaryAmountDue, getAccountPresenceViewModel } from '@de-care/domains/account/state-account';
import { LogoutWorkflowService } from '@de-care/domains/account/state-login';
import { FullBrowserRedirect } from '@de-care/shared/browser-common/util-redirect';
import { DeCareSharedUiPageLayoutModule } from '@de-care/de-care-shared-ui-page-layout';
import { getNextBillingPaymentDate } from '@de-care/de-care-use-cases/account/state-my-account';
import {
    getNbaIdentificationState,
    getNbaAlerts,
    getAlertsToDisplay,
    getConvertTrialEndDate,
    getAlertsCount,
    getIsAlertCritical,
} from '@de-care/domains/account/state-next-best-actions';
import { take, takeUntil } from 'rxjs/operators';
import { behaviorEventImpressionForAccountSnapshotAlertDisplayed } from '@de-care/shared/state-behavior-events';
import { DOT_COM_URL } from '@de-care/shared/configuration-tokens-dot-com';
import { OAC_BASE_URL } from '@de-care/shared/configuration-tokens-oac';
import { Subject, combineLatest } from 'rxjs';
import { CountrySettingsToken, COUNTRY_SETTINGS } from '@de-care/shared/configuration-tokens-locales';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'de-care-page-shell-account-presence',
    templateUrl: './page-shell-account-presence.component.html',
    styleUrls: ['./page-shell-account-presence.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageShellAccountPresenceComponent implements ComponentWithLocale, OnInit {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    accountPresenceViewModel$ = this._store.select(getAccountPresenceViewModel);
    alerts$ = this._store.select(getNbaAlerts);
    alertsToDisplay$ = this._store.select(getAlertsToDisplay);
    convertTrialEndDate$ = this._store.select(getConvertTrialEndDate);
    alertCount$ = this._store.select(getAlertsCount);
    isAlertCritical$ = this._store.select(getIsAlertCritical);
    nextBillingPaymentDate$ = this._store.select(getNextBillingPaymentDate);
    identificationState$ = this._store.select(getNbaIdentificationState);
    billingSummaryAmountDue$ = this._store.select(getAccountBillingSummaryAmountDue);

    oacUrl = this._oacBaseUrl;
    showIcons = false;
    private readonly _window: Window;
    private readonly _unsubscribe$: Subject<void> = new Subject();
    @ViewChild('user') private readonly _userDropdownComponent: SxmUiNavDropdownComponent;
    @ViewChild('alerts') private readonly _alertsDropdownComponent: SxmUiNavDropdownComponent;
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
        private readonly _logoutWorkflowService: LogoutWorkflowService,
        @Inject(APP_BASE_HREF) private readonly _appBaseHref: string,
        @Inject(OAC_BASE_URL) private readonly _oacBaseUrl: string,
        @Inject(DOT_COM_URL) public readonly dotComUrl: string,
        @Inject(COUNTRY_SETTINGS) public readonly countrySettings: CountrySettingsToken,
        private readonly _router: Router,
        @Inject(DOCUMENT) document: Document
    ) {
        translationsForComponentService.init(this);
        this._window = document.defaultView;
    }
    ngOnInit(): void {
        this.showIcons = this.countrySettings.countryCode?.toLowerCase() !== 'ca';
    }

    logout() {
        this._logoutWorkflowService.build({ source: 'PHX' }).subscribe(() => {
            this._window.location.href = this.translationsForComponentService.instant(`${this.translateKeyPrefix}.SXM_URL_LINK`);
        });
    }
    onAlertsOpened() {
        this.alerts$.pipe(take(1)).subscribe((alerts) => {
            if (alerts.length == 0) return;
            const types = alerts.map((a) => a.type);
            return this._store.dispatch(behaviorEventImpressionForAccountSnapshotAlertDisplayed({ types }));
        });
    }

    onAlertLinkClicked($event: string) {
        combineLatest([this.alerts$, this.identificationState$, this.billingSummaryAmountDue$])
            .pipe(takeUntil(this._unsubscribe$))
            .subscribe(([alerts, state, billingSummaryAmountDue]) => {
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
                                }),
                                { replaceUrl: true }
                            );
                        }
                        break;
                    case 'UPGRADE':
                        if (state === 'LOGGEDIN') {
                            this._router.navigateByUrl(
                                this.translationsForComponentService.instant(`${this.translateKeyPrefix}.${$event}.LINK_ROUTER_LOGGEDIN`, {
                                    subscriptionId: matchedAlert.subscriptionId,
                                }),
                                { replaceUrl: true }
                            );
                        } else {
                            this._router.navigateByUrl(
                                this.translationsForComponentService.instant(`${this.translateKeyPrefix}.${$event}.LINK_ROUTER`, {
                                    radioId: matchedAlert.last4DigitsOfRadioId,
                                }),
                                { replaceUrl: true }
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

    closePanels(): void {
        this._userDropdownComponent.open = false;
        this._alertsDropdownComponent.open = false;
    }
}

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        TranslateModule.forChild(),
        ReactiveComponentModule,
        DeCareSharedUiPageFooterBasicModule,
        SharedSxmUiUiDataClickTrackModule,
        SxmUiAccountPresenceIconModule,
        SxmUiNavDropdownModule,
        SharedSxmUiAlertsPanelLoggedInModule,
        SxmUiAlertsIconModule,
        SxmUiMyAccountPanelLoggedInComponentModule,
        DeCareSharedUiPageLayoutModule,
        DomainsAccountStateAccountModule,
    ],
    declarations: [PageShellAccountPresenceComponent],
    exports: [PageShellAccountPresenceComponent],
})
export class DeCarePageShellAccountPresenceModule {}
