import { DOCUMENT } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, Inject, ViewChild, OnDestroy } from '@angular/core';
import {
    getPlatinumBundleNextOrForwardOverlayShowStatus,
    getPvipSubIdOnOverlayShowStatus,
    RemoveInactiveRadioIdWorkflowService,
    setPlatinumBundleOverlayShowStatus,
    setPvipOverlayShowStatus,
    getSkipCancelOverlay,
} from '@de-care/de-care-use-cases/account/state-my-account';
import { LoadNewHotAndTrendingWorkflowService, getDashboardVM } from '@de-care/de-care-use-cases/account/state-my-account-dashboard';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { select, Store } from '@ngrx/store';
import { suspensify } from '@jscutlery/operators';
import { SxmUiModalComponent } from '@de-care/shared/sxm-ui/ui-modal';
import { setSelectedSubscriptionId, loadNba } from '@de-care/de-care-use-cases/account/state-my-account';
import { Router } from '@angular/router';
import { behaviorEventImpressionForComponent, behaviorEventInteractionLinkClick } from '@de-care/shared/state-behavior-events';
import { DOT_COM_URL } from '@de-care/shared/configuration-tokens-dot-com';
import { OAC_BASE_URL } from '@de-care/shared/configuration-tokens-oac';
import { map, take } from 'rxjs/operators';
import { SxmUiRemoveInactiveRadioFormComponent } from '@de-care/shared/sxm-ui/subscriptions/ui-account-subscriptions';
import { TranslateDefaultParser } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { ToastNotificationService } from '@de-care/shared/sxm-ui/ui-toast-notification';
import * as uuid from 'uuid/v4';

interface EditCreateSubscriptionsDataModel {
    subId: string;
    sameAsAccountUsername?: boolean;
    redirectToPhx: boolean;
}

interface ManageSubscriptionsDataModel {
    subId: string;
    radioId?: string;
}
interface linkDataModel {
    types: string[];
    subscriptionId: string;
}

interface InactiveRadioModel {
    isAccountNonPay?: boolean;
    radioId?: string;
}

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'my-account-dashboard-page',
    templateUrl: './dashboard-page.component.html',
    styleUrls: ['./dashboard-page.component.scss'],
})
export class DashboardPageComponent implements ComponentWithLocale, AfterViewInit, OnDestroy {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    removeInactiveRadioLoading = false;
    selectedInactiveRadioId: string;
    selectedReasonToRemoveInactiveRadio: string;
    removeInactiveRadioServerError = false;
    linkData: linkDataModel = { types: [], subscriptionId: null };
    removeInactiveRadioModalAriaDescribedbyTextId = uuid();
    addSecondRadioPvipModalAriaDescribedbyTextId = uuid();
    platinumBundleNextOrFrwdModalAriaDescribedbyTextId = uuid();
    ReactivateSeasonalSuspendedModalAriaDescribedbyTextId = uuid();

    dashboardVM$ = this._store.pipe(select(getDashboardVM));
    pvipSubIdOnOverlayShowEligibile$ = this._store.pipe(select(getPvipSubIdOnOverlayShowStatus));
    platinumBundleOnOverlayShowEligibile$ = this._store.pipe(select(getPlatinumBundleNextOrForwardOverlayShowStatus));
    trending$ = this._loadNewHotAndTrendingWorkflowService.build().pipe(suspensify());

    currentLanguage$ = this.translationsForComponentService.currentLang$;
    allowOnlyCancelOnline$ = this.currentLanguage$.pipe(map((lang) => (lang === 'fr-CA' ? true : false)));

    private readonly _window: Window;
    private readonly _translateDefaultParser: TranslateDefaultParser;
    private _unsubscribe: Subject<void> = new Subject();
    @ViewChild('RemoveInactiveRadioFormModal') private readonly _RemoveInactiveRadioFormModal: SxmUiModalComponent;
    @ViewChild('CancelLinksHybridBauModal') private readonly _CancelLinksHybridBauModal: SxmUiModalComponent;
    @ViewChild('AddSecondRadioPvipModal') private readonly _AddSecondRadioPvipModal: SxmUiModalComponent;
    @ViewChild('PlatinumBundleNextOrForwardModal') private readonly _PlatinumBundleNextOrForwardModal: SxmUiModalComponent;
    @ViewChild('RemoveInactiveRadioForm') private _removeInactiveRadioFormComponent: SxmUiRemoveInactiveRadioFormComponent;
    @ViewChild('ReactivateSeasonalSuspendedSubscriptions') private readonly _ReactivateSuspendedFormModal: SxmUiModalComponent;

    constructor(
        readonly translationsForComponentService: TranslationsForComponentService,
        private readonly _store: Store,
        @Inject(DOCUMENT) document: Document,
        private readonly _loadNewHotAndTrendingWorkflowService: LoadNewHotAndTrendingWorkflowService,
        private readonly _removeInactiveRadioIdWorkflowService: RemoveInactiveRadioIdWorkflowService,
        private readonly _router: Router,
        private readonly _changeDetectorRef: ChangeDetectorRef,
        private readonly _toastNotificationService: ToastNotificationService,
        @Inject(OAC_BASE_URL) public readonly oacBaseUrl: string,
        @Inject(DOT_COM_URL) public readonly dotComUrl: string
    ) {
        translationsForComponentService.init(this);
        this._window = document.defaultView;
        this._translateDefaultParser = new TranslateDefaultParser();
    }

    ngAfterViewInit(): void {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'dashboard' }));
        this.pvipSubIdOnOverlayShowEligibile$.pipe(take(1)).subscribe((pvipSubId) => {
            if (pvipSubId) {
                this._AddSecondRadioPvipModal.open();
                this._changeDetectorRef.detectChanges();
            }
        });
        this.platinumBundleOnOverlayShowEligibile$.pipe(take(1)).subscribe((overlayShowEligibile) => {
            if (overlayShowEligibile) {
                this._PlatinumBundleNextOrForwardModal.open();
                this._changeDetectorRef.detectChanges();
            }
        });
    }

    ngOnDestroy(): void {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    onActivateFaq(link: string) {
        this._window.open(`${this.dotComUrl}${link}`);
    }

    keyup(evt, item) {
        if (evt.key === 'Enter') {
            this.onActivateFaq(item);
        }
    }

    onUserSelectedReasonToRemoveInactiveRadio(reason: string) {
        this.selectedReasonToRemoveInactiveRadio = reason;
        this.removeInactiveRadioLoading = true;
        this.removeInactiveRadioServerError = false;
        this._removeInactiveRadioIdWorkflowService.build({ radioId: this.selectedInactiveRadioId, reason: reason }).subscribe(
            () => {
                this.removeInactiveRadioLoading = false;
                this._RemoveInactiveRadioFormModal.close();
                this._store.dispatch(loadNba());
                this._toastNotificationService.showNotification(this.translationsForComponentService.instant(`${this.translateKeyPrefix}.RADIO_REMOVED`));
            },
            (error: any) => {
                this.removeInactiveRadioServerError = true;
            }
        );
    }

    openRemoveInactiveRadioFormModal(radioId: string) {
        this.selectedInactiveRadioId = radioId;
        this._RemoveInactiveRadioFormModal.open();
    }

    onRemoveInactiveRadioFormModalClose() {
        this.removeInactiveRadioLoading = false;
        this._removeInactiveRadioFormComponent.clearForm();
        this._RemoveInactiveRadioFormModal.close();
    }

    onManageSubscription($event: ManageSubscriptionsDataModel) {
        this._router.navigate(['account/manage/subscriptions/details'], { queryParams: { subscriptionId: $event.subId } });
    }

    onActivateSubscription($event: InactiveRadioModel) {
        if ($event.isAccountNonPay) {
            this._router.navigate(['account/pay/make-payment']);
        } else {
            this._router.navigate(['/subscribe/checkout/purchase/satellite/add-radio-router/activate-radio-init'], { state: { radioId: $event.radioId } });
        }
    }

    onTrendingClick($event) {
        const target = $event.target;
        if (target.tagName.toLowerCase() !== 'a') return;

        this._store.dispatch(
            behaviorEventInteractionLinkClick({
                linkName: target.innerHTML,
                linkType: 'exit',
                linkKey: 'Trending',
            })
        );
    }

    onEditOrCreateUsername($event: EditCreateSubscriptionsDataModel) {
        if ($event.redirectToPhx) {
            this._router.navigate(['/account/manage/account-info/account-information/edit-account-login']);
        } else {
            this._window.location.href = this.translationsForComponentService.instant(
                `${this.translateKeyPrefix}` +
                    ($event.sameAsAccountUsername ? '.EDIT_CREATE_USERNAME_USER_CREDENTIALS_URL' : '.EDIT_CREATE_USERNAME_INTERNET_CREDENTIALS_URL'),
                {
                    subscriptionId: $event.subId,
                    oacUrl: this.oacBaseUrl,
                }
            );
        }
    }

    onCarAndStreaming() {
        this._router.navigate(['/subscribe/checkout/purchase/satellite/add-radio-router']);
    }

    onStreaming() {
        this._router.navigate(['/subscribe/checkout/purchase/streaming/targeted/add-streaming']);
    }

    onMakePayment() {
        this._router.navigate(['account/pay/make-payment']);
    }

    cancelInactiveDevice($event: string) {
        this._store.dispatch(setSelectedSubscriptionId({ selectedSubscriptionId: $event }));
        this._store
            .select(getSkipCancelOverlay)
            .pipe(take(1))
            .subscribe((skipCancelOverlay) => {
                if (skipCancelOverlay) {
                    this._router.navigate(['subscription', 'cancel'], { queryParams: { subscriptionId: $event } });
                } else {
                    if (this.translationsForComponentService.currentLang?.toLowerCase() === 'en-ca') {
                        this.linkData = { types: ['CHAT_CANCEL', 'CALL'], subscriptionId: $event };
                    } else {
                        this.linkData = { types: ['CANCEL', 'CALL'], subscriptionId: $event };
                    }
                    this._CancelLinksHybridBauModal.open();
                }
            });
    }

    addSecondRadio(subscriptionId: string) {
        this.updateStatePvipOverlayShowStatus();
        this._router.navigate(['/subscribe/upgrade-vip/add-second-radio'], { queryParams: { subscriptionId: subscriptionId } });
    }

    updateStatePvipOverlayShowStatus() {
        this._AddSecondRadioPvipModal.close();
        this._store.dispatch(setPvipOverlayShowStatus({ pvipOverlayShowStatus: false }));
    }

    updateStatePlatinumBundleOverlayShowStatus() {
        this._AddSecondRadioPvipModal.close();
        this._store.dispatch(setPlatinumBundleOverlayShowStatus({ platinumBundleOverlayShowStatus: false }));
    }

    onOfferCtaClicked(urls: { routerLink: string; url: string; params; state }) {
        // navigate to route/url
        if (urls?.routerLink) {
            this._router.navigate([urls.routerLink], { queryParams: { ...urls.params }, state: { ...urls.state } });
        } else {
            this._window.location.href = this._translateDefaultParser.interpolate(urls?.url, { ...urls?.params, oacUrl: this.oacBaseUrl });
        }
    }

    closeActivateSeasonalSuspendedSubscriptionModal() {
        this._ReactivateSuspendedFormModal.close();
    }

    openActivateSeasonalSuspendedSubscriptionModal() {
        this._ReactivateSuspendedFormModal.open();
    }
}
