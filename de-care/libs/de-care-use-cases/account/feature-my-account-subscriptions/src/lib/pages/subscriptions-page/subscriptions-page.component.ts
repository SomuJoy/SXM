import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, Inject, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import {
    getSubscriptionsExpanded,
    RemoveInactiveRadioIdWorkflowService,
    setSubscriptionsExpanded,
    getSkipCancelOverlay,
    loadNba,
} from '@de-care/de-care-use-cases/account/state-my-account';
import { getSubscriptionCardsVM, ModifySubscriptionDropdownOptionsWorkflowService } from '@de-care/de-care-use-cases/account/state-my-account-subscriptions';
import { OAC_BASE_URL } from '@de-care/shared/configuration-tokens-oac';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { SxmUiRemoveInactiveRadioFormComponent } from '@de-care/shared/sxm-ui/subscriptions/ui-account-subscriptions';
import { SxmUiModalComponent } from '@de-care/shared/sxm-ui/ui-modal';
import { ToastNotificationService } from '@de-care/shared/sxm-ui/ui-toast-notification';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { select, Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { EditCreateSubscriptionsDataModel, ManageSubscriptionsDataModel, InactiveRadioModel } from '../../interface';
import * as uuid from 'uuid/v4';

interface linkDataModel {
    types: string[];
    subscriptionId: string;
}

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'my-account-subscriptions-page',
    templateUrl: './subscriptions-page.component.html',
    styleUrls: ['./subscriptions-page.component.scss'],
})
export class SubscriptionsPageComponent implements ComponentWithLocale, AfterViewInit, OnDestroy {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    subscriptionCardsVM$ = this._store.pipe(select(getSubscriptionCardsVM));
    subscriptionsExpanded$ = this._store.pipe(take(1), select(getSubscriptionsExpanded));
    private readonly _window: Window;
    @ViewChild('RemoveInactiveRadioFormModal') private readonly _RemoveInactiveRadioFormModal: SxmUiModalComponent;
    @ViewChild('RemoveInactiveRadioForm') private _removeInactiveRadioFormComponent: SxmUiRemoveInactiveRadioFormComponent;
    @ViewChild('CancelLinksHybridBauModal') private readonly _CancelLinksHybridBauModal: SxmUiModalComponent;
    @ViewChild('ReactivateSeasonalSuspendedSubscriptions') private readonly _ReactivateSuspendedFormModal: SxmUiModalComponent;

    removeInactiveRadioLoading = false;
    selectedInactiveRadioId: string;
    selectedReasonToRemoveInactiveRadio: string;
    removeInactiveRadioServerError = false;
    linkData: linkDataModel = { types: [], subscriptionId: null };
    currentLanguage$ = this.translationsForComponentService.currentLang$;
    allowOnlyCancelOnline$ = this.currentLanguage$.pipe(map((lang) => (lang === 'fr-CA' ? true : false)));
    private _unsubscribe: Subject<void> = new Subject();

    removeInactiveRadioModalAriaDescribedbyTextId = uuid();
    ReactivateSeasonalSuspendedModalAriaDescribedbyTextId = uuid();

    constructor(
        readonly translationsForComponentService: TranslationsForComponentService,
        private readonly _store: Store,
        @Inject(DOCUMENT) document: Document,
        private readonly _removeInactiveRadioIdWorkflowService: RemoveInactiveRadioIdWorkflowService,
        private readonly _router: Router,
        private readonly _modifySubscriptionOptionsWorkflowService: ModifySubscriptionDropdownOptionsWorkflowService,
        @Inject(OAC_BASE_URL) private readonly _oacBaseUrl: string,
        private readonly _toastNotificationService: ToastNotificationService
    ) {
        translationsForComponentService.init(this);
        this._window = document.defaultView;
    }

    ngAfterViewInit(): void {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'subscriptions' }));
    }

    ngOnDestroy(): void {
        this._unsubscribe.next();
        this._unsubscribe.complete();
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

    removeInactiveRadioFormModalOpen(radioId: string) {
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

    onActivateRadio($event: InactiveRadioModel) {
        if ($event.isAccountNonPay) {
            this._router.navigate(['account/pay/make-payment']);
        } else {
            this._router.navigate(['/subscribe/checkout/purchase/satellite/add-radio-router/activate-radio-init'], { state: { radioId: $event.radioId } });
        }
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
                    oacUrl: this._oacBaseUrl,
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

    onFindSubscription() {
        this._router.navigate(['/subscribe/checkout/purchase/satellite/add-radio-router/find-subscription-init']);
    }

    cancelInactiveDevice($event: string) {
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

    onShowAllSubscriptions(subscriptionsExpanded) {
        this._store.dispatch(setSubscriptionsExpanded({ subscriptionsExpanded }));
    }

    closeActivateSeasonalSuspendedSubscriptionModal() {
        this._ReactivateSuspendedFormModal.close();
    }

    openActivateSeasonalSuspendedSubscriptionModal() {
        this._ReactivateSuspendedFormModal.open();
    }
}
