import { Injectable } from '@angular/core';
import { numberOfSubscriptionsFound, singleAccountResultFirstSubscription, StreamingFlepzLookupWorkflowService } from '@de-care/domains/identity/state-streaming-flepz-lookup';
import { getNormalizedQueryParams } from '@de-care/shared/state-router-store';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { concatMap, map, tap, withLatestFrom } from 'rxjs/operators';
import { collectFlepzData, collectSelectedRadioIdLastFour } from '../state/public.actions';

export interface LookupCompletedData {
    totalSubscriptionsFound: number;
    ineligibleReason?:
        | 'NonPay'
        | 'NonConsumer'
        | 'TrialWithinLastTrialDate'
        | 'MaxLifetimeTrials'
        | 'InsufficientPackage'
        | 'ExpiredAATrial'
        | 'NeedsCredentials'
        | 'SingleMatchOAC'
        | 'InActive'
        | 'NoAudio';
    singleResultRadioIdLastFour?: string;
}

@Injectable({ providedIn: 'root' })
export class FindAccountByFlepzUrlDataWorkflowService implements DataWorkflow<void, LookupCompletedData> {
    constructor(private readonly _store: Store, private readonly _streamingFlepzLookupWorkflowService: StreamingFlepzLookupWorkflowService) {}

    build(): Observable<LookupCompletedData> {
        // Get the flepz query param (which is a base64 encoded value of the flepz data as a JSON string),
        //  decode it to turn it back into a javascript object,
        //  then run the streaming flepz lookup logic and return LookupCompletedData to represent the results
        return this._store.select(getNormalizedQueryParams).pipe(
            map<any, { firstName: string; lastName: string; email: string; phoneNumber: string; zipCode: string }>(({ flepz }) => JSON.parse(atob(flepz))),
            concatMap(flepz =>
                this._streamingFlepzLookupWorkflowService.build(flepz).pipe(
                    withLatestFrom(this._store.select(numberOfSubscriptionsFound), this._store.select(singleAccountResultFirstSubscription)),
                    tap(() => {
                        this._store.dispatch(collectFlepzData({ flepzData: flepz }));
                    }),
                    map(([_, totalSubscriptionsFound, singleAccountFirstSubscription]) => {
                        const data: LookupCompletedData = {
                            totalSubscriptionsFound,
                            singleResultRadioIdLastFour: singleAccountFirstSubscription?.radioService?.last4DigitsOfRadioId
                        };
                        if (totalSubscriptionsFound === 1) {
                            this._store.dispatch(collectSelectedRadioIdLastFour({ selectedRadioIdLastFour: data.singleResultRadioIdLastFour }));
                            if (singleAccountFirstSubscription.status) {
                                const status = singleAccountFirstSubscription.status.toLowerCase();
                                if (status === 'closed' || status === 'inactive') {
                                    data.ineligibleReason = 'InActive';
                                } else if (singleAccountFirstSubscription.inEligibleReasonCode) {
                                    switch (singleAccountFirstSubscription.inEligibleReasonCode.toLowerCase()) {
                                        case 'paymentissues': {
                                            data.ineligibleReason = 'NonPay';
                                            break;
                                        }
                                        case 'nonconsumer': {
                                            data.ineligibleReason = 'NonConsumer';
                                            break;
                                        }
                                        case 'trialwithinlasttrialdate': {
                                            data.ineligibleReason = 'TrialWithinLastTrialDate';
                                            break;
                                        }
                                        case 'maxlifetimetrials': {
                                            data.ineligibleReason = 'MaxLifetimeTrials';
                                            break;
                                        }
                                        case 'insufficientpackage': {
                                            data.ineligibleReason = 'InsufficientPackage';
                                            break;
                                        }
                                        case 'expiredaatrial': {
                                            data.ineligibleReason = 'ExpiredAATrial';
                                            break;
                                        }
                                        case 'existingsxirnocredentials': {
                                            data.ineligibleReason = 'NeedsCredentials';
                                            break;
                                        }
                                        case 'existingsxir': {
                                            data.ineligibleReason = singleAccountFirstSubscription.hasOACCredentials ? 'SingleMatchOAC' : 'NeedsCredentials';
                                            break;
                                        }
                                    }
                                } else if (singleAccountFirstSubscription.eligibleService) {
                                    if (singleAccountFirstSubscription.eligibleService.toLowerCase() === 'sxir_standalone') {
                                        data.ineligibleReason = 'NoAudio';
                                    }
                                }
                            }
                        }
                        return data;
                    })
                )
            )
        );
    }
}
