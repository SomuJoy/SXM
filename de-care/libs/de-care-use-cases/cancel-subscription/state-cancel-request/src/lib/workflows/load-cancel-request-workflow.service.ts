import { Injectable, Inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { concatMap, withLatestFrom, tap } from 'rxjs/operators';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { LoadAccountWorkflowService, inTrialPostTrialSelfPayCustomerType, setSelectedSubscriptionId } from '@de-care/domains/account/state-account';
import { Store, select } from '@ngrx/store';
import { setSubscriptionId, setTransactionId, setCancelOnlyModeOn, setCancelByChatAllowed, setPreselectedPlanIsEnabled, trackCancelOnlineRules } from '../state/actions';
import * as uuid from 'uuid/v4';
import {
    behaviorEventReactionForTransactionId,
    behaviorEventReactionForCustomerType,
    behaviorEventReactionForTransactionType,
    behaviorEventReactionCustomerInfoAuthenticationType,
    behaviorEventReactionActiveSubscriptionRadioId,
} from '@de-care/shared/state-behavior-events';
import { AuthenticationTypeEnum, CustomEventNameEnum } from '@de-care/data-services';
import { DOCUMENT } from '@angular/common';
import { getPvtTime, LoadEnvironmentInfoWorkflowService } from '@de-care/domains/utility/state-environment-info';
import { SettingsService, UserSettingsService } from '@de-care/settings';
import { loadAdobeFeatureFlagsByFlagName } from '@de-care/shared/state-feature-flags';
import { AdobeFlagEnum } from '../adobe-flag.enum';
import { ModifySubscriptionOptionsWorkflowService } from '@de-care/domains/account/state-management';
import { CountrySettingsToken, COUNTRY_SETTINGS } from '@de-care/shared/configuration-tokens-locales';
import { UpdateUsecaseWorkflowService } from '@de-care/domains/utility/state-update-usecase';
import { LoadAllPackageDescriptionsWorkflowService } from '@de-care/domains/offers/state-package-descriptions';

interface WorkflowRequest {
    subscriptionId: number;
    accountNumber?: string;
    cancelOnly?: boolean;
}

@Injectable({ providedIn: 'root' })
export class LoadCancelRequestWorkflowService implements DataWorkflow<WorkflowRequest, boolean> {
    private readonly _window: Window;

    constructor(
        private readonly _loadAccountWorkflowService: LoadAccountWorkflowService,
        private readonly _store: Store,
        private readonly _loadEnvironmentInfoWorkflowService: LoadEnvironmentInfoWorkflowService,
        private readonly _settingsSrv: SettingsService,
        private readonly _userSettingsSrv: UserSettingsService,
        private readonly _modifySubscriptionOptionsWorkflowService: ModifySubscriptionOptionsWorkflowService,
        private readonly _updateUsecaseWorkflowService: UpdateUsecaseWorkflowService,
        private readonly _loadAllPackageDescriptionsWorkflowService: LoadAllPackageDescriptionsWorkflowService,
        @Inject(COUNTRY_SETTINGS) private readonly _countrySettings: CountrySettingsToken,
        @Inject(DOCUMENT) readonly document
    ) {
        this._window = document.defaultView;
    }

    // TODO: Remove accountNumber once we have SSO simulation solution in place
    build({ subscriptionId, accountNumber, cancelOnly }: WorkflowRequest): Observable<boolean> {
        this._store.dispatch(setSubscriptionId({ subscriptionId }));
        this._store.dispatch(setSelectedSubscriptionId({ selectedSubscriptionId: subscriptionId }));
        if (cancelOnly) {
            this._store.dispatch(setCancelOnlyModeOn());
        }
        this._store.dispatch(behaviorEventReactionForTransactionType({ transactionType: 'CANCEL_SUB' }));
        return this._updateUsecaseWorkflowService.build({ useCase: 'ONLINE_CANCELLATION' }).pipe(
            concatMap(() => {
                return this._loadEnvironmentInfoWorkflowService.build().pipe(
                    concatMap(() => this._loadAllPackageDescriptionsWorkflowService.build()),
                    concatMap(() => {
                        // temporarily make account number optional so SSO can be tested and careQA can still function with account number in url
                        const accountRequest = accountNumber ? { accountNumber } : {};
                        return this._loadAccountWorkflowService.build(accountRequest).pipe(
                            withLatestFrom(this._store.pipe(select(getPvtTime))),
                            tap(([account, pvtTime]) => {
                                if (this._settingsSrv.isCanadaMode) {
                                    const state = account && account.serviceAddress && account.serviceAddress.state;
                                    this._userSettingsSrv.setSelectedCanadianProvince(state);
                                }
                                if (subscriptionId && account?.subscriptions) {
                                    for (const subscription of account.subscriptions) {
                                        if (subscription.id === subscriptionId.toString()) {
                                            this._store.dispatch(behaviorEventReactionActiveSubscriptionRadioId({ radioId: subscription.radioService?.radioId }));
                                        }
                                    }
                                }
                                this._store.dispatch(behaviorEventReactionCustomerInfoAuthenticationType({ authenticationType: AuthenticationTypeEnum.Login }));
                                this._store.dispatch(
                                    behaviorEventReactionForCustomerType({ customerType: inTrialPostTrialSelfPayCustomerType(account, pvtTime, false, subscriptionId) })
                                );
                            }),
                            tap(() => {
                                const transactionId = `OAC-${uuid()}`;
                                this._store.dispatch(setTransactionId({ transactionId }));
                                this._store.dispatch(behaviorEventReactionForTransactionId({ transactionId }));
                                //TODO: refactor this to send direct call to Launch instead of window event
                                const newTransactionEvent = new CustomEvent(CustomEventNameEnum.NewPaymentTransaction, {
                                    detail: {
                                        id: transactionId,
                                        message: 'New credit card transaction event',
                                        time: new Date(),
                                    },
                                    bubbles: true,
                                    cancelable: true,
                                });
                                this._window.dispatchEvent(newTransactionEvent);
                            }),
                            /* A/B testing grid block */
                            // Flags are loaded independently of the conditions. The flags values will be used later to control the flows
                            tap(() => {
                                const isCanada = this._countrySettings.countryCode.toLowerCase() === 'ca';
                                this._store.dispatch(setCancelByChatAllowed({ cancelByChatAllowed: isCanada }));
                                this._store.dispatch(setPreselectedPlanIsEnabled({ preselectedPlanIsEnabled: !isCanada }));
                            }),
                            concatMap(() =>
                                this._modifySubscriptionOptionsWorkflowService
                                    .build({ subscriptionId })
                                    .pipe(tap(() => this._store.dispatch(trackCancelOnlineRules({ subscriptionId }))))
                            ),
                            tap(() => this._store.dispatch(loadAdobeFeatureFlagsByFlagName({ flagNames: [AdobeFlagEnum.CancelInterstitial] }))),
                            concatMap(() => of(true))
                        );
                    })
                );
            })
        );
    }
}
