import { DOCUMENT } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, Inject, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { getSelectedRadioId, getSelectedSubscriptionId } from '@de-care/de-care-use-cases/account/state-my-account';
import {
    getModifyAndCancelSubscriptionOptions,
    getDoNotUseModifyOptionRouterLink,
    SubscriptionNicknameWorkflowService,
    getDoNotUseCancelModal,
    getSubscriptionDetailsVM,
    getToShowSpecialCancelModal,
    getToShowPvipAlert,
} from '@de-care/de-care-use-cases/account/state-my-account-subscriptions';
import { OAC_BASE_URL } from '@de-care/shared/configuration-tokens-oac';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { SxmUiAddNicknameFormComponent } from '@de-care/shared/sxm-ui/subscriptions/ui-account-subscriptions';
import { SxmUiModalComponent } from '@de-care/shared/sxm-ui/ui-modal';
import { ToastNotificationService } from '@de-care/shared/sxm-ui/ui-toast-notification';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { select, Store } from '@ngrx/store';
import { TranslateDefaultParser, TranslateService } from '@ngx-translate/core';
import { combineLatest } from 'rxjs';
import { concatMap, map, tap } from 'rxjs/operators';
import { EditCreateSubscriptionsDataModel } from '../../interface';
import * as uuid from 'uuid/v4';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'my-account-subscription-details-page',
    templateUrl: './subscription-details-page.component.html',
    styleUrls: ['./subscription-details-page.component.scss'],
})
export class SubscriptionDetailsPageComponent implements ComponentWithLocale, AfterViewInit {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    editNicknameData: { vehicle?: string; radioId?: string; nickname?: string };
    editNicknameLoading = false;
    editNicknameError = false;
    noInitialNickname = false;
    selectedSubscriptionId$ = this._store.select(getSelectedSubscriptionId);
    subscriptionDetailsVM$ = this.selectedSubscriptionId$.pipe(
        concatMap((subscriptionId) =>
            this._store.pipe(
                select(getSubscriptionDetailsVM(subscriptionId)),
                tap((detailsVM) => {
                    this.editNicknameData = {
                        nickname: detailsVM.headerData.nickname,
                        vehicle: detailsVM.headerData.yearMakeModelInfo,
                        radioId: detailsVM.headerData.radioId,
                    };
                    if (this.editNicknameData.nickname === null) {
                        this.noInitialNickname = true;
                    }
                })
            )
        )
    );

    @ViewChild('EditNicknameFormModal') private readonly _editNicknameFormModal: SxmUiModalComponent;
    modifySubscriptionDropdownOptions$ = this.selectedSubscriptionId$.pipe(
        concatMap((subscriptionId) => this._store.select(getModifyAndCancelSubscriptionOptions(subscriptionId)))
    );
    modifySubscriptionOptions$;
    @ViewChild('AddNicknameForm') private _addNicknameFormComponent: SxmUiAddNicknameFormComponent;
    private readonly _window: Window;
    private readonly _translateDefaultParser: TranslateDefaultParser;

    addNicknameModalAriaDescribedbyTextId = uuid();

    constructor(
        readonly translationsForComponentService: TranslationsForComponentService,
        private readonly _store: Store,
        @Inject(DOCUMENT) private readonly _document: Document,
        private readonly _subscriptionNicknameWorkflowService: SubscriptionNicknameWorkflowService,
        private readonly _changeDetectorRef: ChangeDetectorRef,
        private readonly _translateService: TranslateService,
        @Inject(OAC_BASE_URL) private readonly _oacBaseUrl: string,
        private readonly _router: Router,
        private readonly _toastNotificationService: ToastNotificationService
    ) {
        translationsForComponentService.init(this);
        this._window = document.defaultView;
        this._translateDefaultParser = new TranslateDefaultParser();

        this.modifySubscriptionOptions$ = combineLatest([
            this.modifySubscriptionDropdownOptions$,
            this._translateService.stream(`${this.translateKeyPrefix}.MODIFY_SUBSCRIPTION_OPTIONS`),
            this.selectedSubscriptionId$,
            this._store.pipe(select(getSelectedRadioId)),
            this._store.pipe(select(getDoNotUseModifyOptionRouterLink)),
            this._store.pipe(select(getDoNotUseCancelModal)),
            this._store.pipe(select(getToShowSpecialCancelModal)),
            this._store.pipe(select(getToShowPvipAlert)),
        ]).pipe(
            map(([subscriptionOptions, copies, subscriptionId, radioId, doNotUseRouterLink, doNotUseCancelModal, showSpecialCancelModal, showPvipAlertModal]) => {
                const showCancelOnline = subscriptionOptions?.cancelSubscriptionOptionInfo?.showCancelOnline;
                const tempCopies = JSON.parse(JSON.stringify(copies));
                let dropdownOptions = [];
                for (const [key, value] of Object.entries(tempCopies)) {
                    if (subscriptionOptions?.options?.indexOf(key as any) > -1) {
                        const url = value['url']
                            ? this._translateService.instant(`${this.translateKeyPrefix}.MODIFY_SUBSCRIPTION_OPTIONS.${key}.url`, {
                                  oacUrl: this._oacBaseUrl,
                                  radioId: radioId,
                              })
                            : null;
                        value['url'] = url;
                        const subId = value['subscriptionId']
                            ? this._translateService.instant(`${this.translateKeyPrefix}.MODIFY_SUBSCRIPTION_OPTIONS.${key}.subscriptionId`, {
                                  subscriptionId: subscriptionId,
                              })
                            : null;
                        value['subscriptionId'] = subId;
                        const routerLink = value['routerLink']
                            ? this._translateService.instant(`${this.translateKeyPrefix}.MODIFY_SUBSCRIPTION_OPTIONS.${key}.routerLink`, {
                                  subscriptionId: subscriptionId,
                              })
                            : null;
                        value['routerLink'] = routerLink;
                        const modalId = value['modalId'] ? this._translateService.instant(`${this.translateKeyPrefix}.MODIFY_SUBSCRIPTION_OPTIONS.${key}.modalId`) : null;
                        const paymentAlertModalId = value['paymentAlertModalId']
                            ? this._translateService.instant(`${this.translateKeyPrefix}.MODIFY_SUBSCRIPTION_OPTIONS.${key}.paymentAlertModalId`)
                            : null;

                        const pvipAlertId = value['pvipAlertModalId']
                            ? this._translateService.instant(`${this.translateKeyPrefix}.MODIFY_SUBSCRIPTION_OPTIONS.${key}.pvipAlertModalId`)
                            : null;
                        if (modalId) {
                            value['routerLinkObject'] = [{ outlets: { modal: [modalId] } }];
                        }
                        if (key === 'CHANGE_PLAN' || key === 'CHANGE_TERM') {
                            if (doNotUseRouterLink) {
                                value['routerLink'] = null;
                            } else {
                                value['url'] = null;
                            }
                        } else if (key === 'CANCEL_SUBSCRIPTION') {
                            // This will be removed once all problems cleared/improve chat feature for US
                            if (doNotUseCancelModal) {
                                value['routerLinkObject'] = null;
                            } else {
                                value['routerLink'] = null;
                            }
                            if (paymentAlertModalId && showSpecialCancelModal && showCancelOnline) {
                                value['routerLink'] = null;
                                value['routerLinkObject'] = [{ outlets: { modal: [paymentAlertModalId] } }];
                            }
                            // If Subscription has two PVIP, we would always show special pvip cancel modal
                            if (pvipAlertId && showPvipAlertModal && showCancelOnline) {
                                value['routerLink'] = null;
                                value['routerLinkObject'] = [{ outlets: { modal: [pvipAlertId] } }];
                            }
                        }
                        dropdownOptions = [...dropdownOptions, value];
                    }
                }
                return dropdownOptions;
            })
        );
    }

    ngAfterViewInit(): void {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'subscriptiondetails' }));
    }

    onBack(): void {
        // TODO: do we need a fallback here in case future version allows customer to land here initially without having gone to dashboard/subscription page
        this._document.defaultView.history.back();
    }

    onEditNickname(): void {
        this._editNicknameFormModal.open();
    }

    onEditNicknameModalClosed(): void {
        this._addNicknameFormComponent.clearForm();
        this.editNicknameLoading = false;
        this._editNicknameFormModal.close();
    }

    onEditNicknameSubmit(nickname): void {
        this.editNicknameLoading = true;
        this.editNicknameError = false;

        this._subscriptionNicknameWorkflowService.build({ nickName: nickname }).subscribe(
            () => {
                this._toastNotificationService.showNotification(
                    this.translationsForComponentService.instant(`${this.translateKeyPrefix}.${this.noInitialNickname ? `NICKNAME_ADDED` : `NICKNAME_UPDATED`}`)
                );
                this.noInitialNickname = false;
                this.editNicknameLoading = false;
                this._editNicknameFormModal.close();
            },
            () => {
                this.editNicknameError = true;
                this.editNicknameLoading = false;
                this._changeDetectorRef.detectChanges();
            }
        );
    }

    onEditOrCreateUsername($event: EditCreateSubscriptionsDataModel) {
        if ($event.redirectToPhx) {
            this._router.navigate(['/account/manage/account-info/account-information/edit-account-login']);
        } else {
            const link =
                this._oacBaseUrl +
                ($event.sameAsAccountUsername ? '/updateusercredentials_view' : '/updateinternetcredentials_view') +
                `.action?subscriptionNumber=` +
                $event.subId;
            this._window.location.href = link;
        }
    }

    onOfferCtaClicked(urls: { routerLink: string; url: string; params; state }) {
        // navigate to route/url
        if (urls?.routerLink) {
            this._router.navigate([urls.routerLink], { queryParams: { ...urls.params }, state: { ...urls.state } });
        } else {
            this._window.location.href = this._translateDefaultParser.interpolate(urls?.url, { ...urls?.params, oacUrl: this._oacBaseUrl });
        }
    }
}
