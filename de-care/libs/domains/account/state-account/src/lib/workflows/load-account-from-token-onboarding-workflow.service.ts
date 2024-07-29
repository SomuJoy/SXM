import { Injectable } from '@angular/core';
import {
    behaviorEventReactionClosedDevicesInfo,
    behaviorEventReactionFordtok,
    behaviorEventReactionStreamingRadioIdVinLookupReturned,
} from '@de-care/shared/state-behavior-events';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { select, Store } from '@ngrx/store';
import { iif, Observable, of, throwError } from 'rxjs';
import { catchError, concatMap, map, tap, withLatestFrom } from 'rxjs/operators';
import { DataAccountTokenOnboardingService } from '../data-services/data-account-token-onboarding.service';
import { loadAccountError, patchSubscriptionWithStreamingEligibilityById, setAccount, setEmailId, setMarketingAccountId, setMaskedUserNameFromToken } from '../state/actions';
import { getFirstAccountSubscriptionFirstPlanType, getFirstAccountSubscriptionId, getRadioIdLast4OnAccount, getClosedDevicesStatus } from '../state/selectors';
import { CheckIfRadioIsStreamingEligibleWorkflowService } from './check-if-radio-is-streaming-eligible-workflow.service';
import { DataAccountNonPiiService } from '../data-services/data-account-non-pii.service';

export interface LookupCompletedDatas {
    ineligibleReason?:
        | 'NonPay'
        | 'NonConsumer'
        | 'TrialWithinLastTrialDate'
        | 'MaxLifetimeTrials'
        | 'InsufficientPackage'
        | 'ExpiredAATrial'
        | 'NeedsCredentials'
        | 'SingleMatchOAC'
        | 'NoAudio'
        | 'RadioNotActive';
    singleResultRadioIdLastFour?: string;
}

@Injectable({ providedIn: 'root' })
export class LoadAccountFromTokenOnboardingWorkflowService implements DataWorkflow<{ token: string; tokenType?: string; radioid: string; act: string }, LookupCompletedDatas> {
    constructor(
        private readonly _dataAccountTokenOnboardingService: DataAccountTokenOnboardingService,
        private readonly _checkIfRadioIsStreamingEligibleWorkflowService: CheckIfRadioIsStreamingEligibleWorkflowService,
        private readonly _store: Store,
        private readonly _dataAccountNonPiiService: DataAccountNonPiiService
    ) {}

    build({ token, tokenType, radioid, act }): Observable<LookupCompletedDatas> {
        if (token) {
            this._store.dispatch(behaviorEventReactionFordtok({ dtok: token }));
        }
        return iif(
            () => !!token && (tokenType === 'SALES_AUDIO' || !radioid),
            this._dataAccountTokenOnboardingService.getAccountFromToken(token, false, tokenType),
            this._dataAccountNonPiiService.getAccount({ radioId: radioid, accountNumber: act?.replace(/[^0-9]+/, '') })
        ).pipe(
            tap(({ nonPIIAccount, marketingId, marketingAcctId: marketingAccountId, email, maskedUserNameFromToken }) => {
                this._store.dispatch(setAccount({ account: nonPIIAccount }));
                this._store.dispatch(setMarketingAccountId({ marketingAccountId }));
                this._store.dispatch(setEmailId({ email }));
                this._store.dispatch(setMaskedUserNameFromToken({ maskedUserNameFromToken }));
                if (nonPIIAccount?.closedDevices?.length > 0) {
                    this._store.dispatch(
                        behaviorEventReactionClosedDevicesInfo({
                            closedDevices: nonPIIAccount?.closedDevices?.map((d) => {
                                return { dateClosed: d.closedDate, esnLast4Digits: d.last4DigitsOfRadioId };
                            }),
                        })
                    );
                }
            }),
            withLatestFrom(this._store.select(getRadioIdLast4OnAccount), this._store.select(getFirstAccountSubscriptionFirstPlanType)),
            tap(([, radioId, type]) => {
                this._store.dispatch(behaviorEventReactionStreamingRadioIdVinLookupReturned({ subscriptions: [{ type, last4DigitsOfRadioId: radioId }] }));
            }),
            map(([, radioId]) => radioId),
            withLatestFrom(this._store.pipe(select(getClosedDevicesStatus))),
            concatMap(([radioId, status]) =>
                status === 'closed' || status === 'inactive'
                    ? of<LookupCompletedDatas>({ ineligibleReason: 'RadioNotActive' })
                    : this._checkIfRadioIsStreamingEligibleWorkflowService.build({ radioId }).pipe(
                          withLatestFrom(this._store.select(getFirstAccountSubscriptionId)),
                          tap(([streamingEligibility, subscriptionId]) => {
                              this._store.dispatch(patchSubscriptionWithStreamingEligibilityById({ subscriptionId, streamingEligibility }));
                          }),
                          map(([streamingEligibility]) => {
                              const data: LookupCompletedDatas = { singleResultRadioIdLastFour: radioId };

                              if (!streamingEligibility) {
                                  throwError(streamingEligibility);
                              } else {
                                  if (streamingEligibility.statusCode) {
                                      if (streamingEligibility.ineligibleReasonCodes && streamingEligibility.ineligibleReasonCodes.length > 0) {
                                          const ineligibleReason = streamingEligibility.ineligibleReasonCodes[0].toLowerCase();
                                          if (ineligibleReason === 'paymentissues') {
                                              data.ineligibleReason = 'NonPay';
                                          } else if (ineligibleReason === 'nonconsumer') {
                                              data.ineligibleReason = 'NonConsumer';
                                          } else if (ineligibleReason === 'trialwithinlasttrialdate') {
                                              data.ineligibleReason = 'TrialWithinLastTrialDate';
                                          } else if (ineligibleReason === 'maxlifetimetrials') {
                                              data.ineligibleReason = 'MaxLifetimeTrials';
                                          } else if (ineligibleReason === 'insufficientpackage') {
                                              data.ineligibleReason = 'InsufficientPackage';
                                          } else if (ineligibleReason === 'expiredaatrial') {
                                              data.ineligibleReason = 'ExpiredAATrial';
                                          } else if (ineligibleReason === 'existingsxirnocredentials') {
                                              data.ineligibleReason = 'NeedsCredentials';
                                          } else if (ineligibleReason === 'existingsxir' && streamingEligibility.hasOACCredentials === false) {
                                              data.ineligibleReason = 'NeedsCredentials';
                                          } else if (ineligibleReason === 'existingsxir' && streamingEligibility.hasOACCredentials === true) {
                                              data.ineligibleReason = 'SingleMatchOAC';
                                          }
                                      } else if (streamingEligibility.eligibleService) {
                                          const eligibleService = streamingEligibility.eligibleService.toLowerCase();
                                          if (eligibleService === 'sxir_standalone') {
                                              data.ineligibleReason = 'NoAudio';
                                          }
                                      }
                                  }
                              }
                              return data;
                          }),
                          catchError((_) => throwError(_))
                      )
            ),
            catchError((error) => {
                this._store.dispatch(loadAccountError({ error }));
                return throwError(error);
            })
        );
    }
}
