import { Inject, Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable, throwError, of } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { ChangeSubscriptionOffersError } from '@de-care/domains/offers/state-offers';
import { LoadChangeSubscriptionOffersWithCmsContent } from '@de-care/domains/offers/state-offers-with-cms';
import {
    getFirstAccountSubscriptionId,
    inTrialPostTrialSelfPayCustomerType,
    LoadAccountFromTokenWorkflowService,
    LoadAccountWorkflowService,
    getLastFourDigitsOfAccountNumber,
    selectAccount,
    setSelectedSubscriptionId,
    LoadAccountFromAccountDataWorkflow,
} from '@de-care/domains/account/state-account';
import { concatMap, map, mapTo, mergeMap, take, tap, withLatestFrom, catchError, switchMap } from 'rxjs/operators';
import { UserSettingsService, SettingsService } from '@de-care/settings';
import { setChangeSubscriptionOffersError, setChangeTermOnlyModeOn, setSubscriptionId, setTokenMode, setTransactionId } from './state/actions';
import {
    behaviorEventReactionForCustomerType,
    behaviorEventReactionForTransactionType,
    behaviorEventReactionCustomerInfoAuthenticationType,
    behaviorEventReactionAuthenticationToken,
    behaviorEventReactionForTransactionId,
} from '@de-care/shared/state-behavior-events';
import { getPvtTime, LoadEnvironmentInfoWorkflowService } from '@de-care/domains/utility/state-environment-info';
import { getNormalizedQueryParams } from '@de-care/shared/state-router-store';
import { AuthenticationTypeEnum } from '@de-care/data-services';
import { getLoadOffersPayload } from './state/selectors/package-selection.selectors';
import * as uuid from 'uuid/v4';
import { DOCUMENT } from '@angular/common';
import { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';

interface WorkflowRequest {
    changeTermOnly: boolean;
}

export type LoadChangeSubscriptionErrors = ChangeSubscriptionOffersError | 'TOKEN_ERROR' | 'NO_SUBSCRIPTION_FOUND' | 'UNAUTHENTICATED_CUSTOMER';

@Injectable({ providedIn: 'root' })
export class LoadChangeSubscriptionPurchaseWorkflowService implements DataWorkflow<WorkflowRequest, boolean> {
    private readonly _window: Window;
    private readonly newPaymentTransactionEvent = 'NewPaymentTransactionEvent';

    constructor(
        private readonly _store: Store,
        private readonly _userSettingsSrv: UserSettingsService,
        private readonly _settingsSrv: SettingsService,
        @Inject(DOCUMENT) document: Document,
        private readonly _loadAccountWorkflowService: LoadAccountWorkflowService,
        private readonly _loadChangeSubscriptionOffersWithCmsContent: LoadChangeSubscriptionOffersWithCmsContent,
        private readonly _loadEnvironmentInfoWorkflowService: LoadEnvironmentInfoWorkflowService,
        private readonly _loadAccountFromTokenWorkflowService: LoadAccountFromTokenWorkflowService,
        private readonly _loadAccountFromAccountDataWorkflow: LoadAccountFromAccountDataWorkflow
    ) {
        this._window = document.defaultView;
    }

    loadCorrectWorkflowService({ isTokenMode, tkn }, { isRadioIDAndMaskedActMode, accountNumber, radioId, lastName }) {
        if (isRadioIDAndMaskedActMode) {
            return this._store.pipe(
                select(getPvtTime),
                take(1),
                concatMap((pvtTime) => {
                    return this._loadAccountFromAccountDataWorkflow
                        .build({
                            ...(accountNumber && { accountNumber: getLastFourDigitsOfAccountNumber(accountNumber) }),
                            radioId,
                            pvtTime,
                            ...(lastName && { lastName }),
                        })
                        .pipe(
                            tap(() => {
                                this._store.dispatch(setTokenMode({ isTokenMode: isRadioIDAndMaskedActMode }));
                            })
                        );
                })
            );
        } else if (isTokenMode) {
            return this._loadAccountFromTokenWorkflowService
                .build({ token: tkn, isStreaming: false, student: false, allowErrorHandler: false, tokenType: 'SALES_AUDIO' })
                .pipe(
                    tap(() => {
                        this._store.dispatch(setTokenMode({ isTokenMode }));
                    }),
                    mapTo(true),
                    catchError((error) => {
                        return throwError('TOKEN_ERROR' as LoadChangeSubscriptionErrors);
                    })
                );
        }
        return this._loadAccountWorkflowService.build({}).pipe(
            mapTo(true),
            catchError((error) => {
                if (error?.errorCode === 'UNAUTHENTICATED_CUSTOMER') {
                    return throwError('UNAUTHENTICATED_CUSTOMER' as LoadChangeSubscriptionErrors);
                } else {
                    return throwError(error);
                }
            })
        );
    }

    build({ changeTermOnly }: WorkflowRequest): Observable<boolean> {
        this._store.dispatch(behaviorEventReactionForTransactionType({ transactionType: changeTermOnly ? 'CHANGE_TERM' : 'CHANGE_PLAN' }));
        if (changeTermOnly) {
            this._store.dispatch(setChangeTermOnlyModeOn());
        }

        return this._store.pipe(select(getNormalizedQueryParams), take(1)).pipe(
            concatMap(({ subscriptionid, tkn, task, radioid, act, lname }) => {
                const isTokenMode = !!(tkn && task);
                const isRadioIDAndMaskedActMode = !!(radioid && (act || lname) && task);

                const shouldLoadOtherDataValidation = subscriptionid || isTokenMode || isRadioIDAndMaskedActMode;
                if (!shouldLoadOtherDataValidation) {
                    const errorMessage = 'SubscriptionID(subscriptionid) or Token(tkn) or radioid + last4digits account(act) Required';
                    throw new Error(errorMessage);
                }
                return this._loadEnvironmentInfoWorkflowService.build().pipe(
                    concatMap(() => {
                        return this.loadCorrectWorkflowService(
                            { isTokenMode, tkn },
                            {
                                isRadioIDAndMaskedActMode,
                                accountNumber: act,
                                radioId: radioid,
                                lastName: lname,
                            }
                        ).pipe(
                            switchMap(() => {
                                if (isTokenMode || isRadioIDAndMaskedActMode) {
                                    return this._store.pipe(select(getFirstAccountSubscriptionId), take(1));
                                }
                                return of(subscriptionid);
                            }),
                            withLatestFrom(this._store.pipe(select(getPvtTime)), this._store.pipe(select(selectAccount))),
                            tap(([subscriptionId, pvtTime, account]) => {
                                if (!subscriptionId) {
                                    throw 'NO_SUBSCRIPTION_FOUND' as LoadChangeSubscriptionErrors;
                                }
                                if (this._settingsSrv.isCanadaMode) {
                                    const state = account && account.serviceAddress && account.serviceAddress.state;
                                    this._userSettingsSrv.setSelectedCanadianProvince(state);
                                }

                                this._store.dispatch(setSubscriptionId({ subscriptionId: +subscriptionId }));
                                this._store.dispatch(setSelectedSubscriptionId({ selectedSubscriptionId: +subscriptionId }));

                                this._store.dispatch(behaviorEventReactionCustomerInfoAuthenticationType({ authenticationType: AuthenticationTypeEnum.TokenURL }));
                                this._store.dispatch(behaviorEventReactionAuthenticationToken({ authenticationToken: tkn }));
                                this._store.dispatch(
                                    behaviorEventReactionForCustomerType({ customerType: inTrialPostTrialSelfPayCustomerType(account, pvtTime, false, subscriptionid) })
                                );
                            }),
                            tap(() => {
                                const transactionId = `OAC-${uuid()}`;
                                this._store.dispatch(setTransactionId({ transactionId }));
                                this._store.dispatch(behaviorEventReactionForTransactionId({ transactionId }));
                                //TODO: refactor this to send direct call to Launch instead of window event
                                const newTransactionEvent = new CustomEvent(this.newPaymentTransactionEvent, {
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
                            withLatestFrom(this._store.select(getLoadOffersPayload)),
                            mergeMap(([, loadOffersPayload]) => {
                                return this._loadChangeSubscriptionOffersWithCmsContent.build(loadOffersPayload).pipe(
                                    map(() => true),
                                    catchError((error) => {
                                        this._store.dispatch(setChangeSubscriptionOffersError({ error }));
                                        if (error?.message?.endsWith('missing from transformers')) {
                                            return throwError('OTHERS');
                                        }
                                        return throwError(error);
                                    })
                                );
                            }),
                            tap(() => {
                                this._stopPageLoader();
                            }),
                            catchError((err) => {
                                this._stopPageLoader();
                                return throwError(err);
                            })
                        );
                    })
                );
            })
        );
    }

    private _stopPageLoader() {
        this._store.dispatch(pageDataFinishedLoading());
    }
}
