import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import {
    numberOfSubscriptionsFound,
    singleAccountResultFirstSubscription,
    streamingFlepzLookupAccountsAsArray,
    StreamingFlepzLookupWorkflowService,
} from '@de-care/domains/identity/state-streaming-flepz-lookup';
import { Store } from '@ngrx/store';
import { map, withLatestFrom } from 'rxjs/operators';
import { FlepzData, StreamingFlepzLookupFormComponent, StreamingFlepzLookupFormComponentApi } from '../../streaming-flepz-lookup-form/streaming-flepz-lookup-form.component';
export interface LookupCompletedData {
    flepzData: {
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber: string;
        zipCode: string;
    };
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
        | 'NoAudio'
        | 'InActive'
        | 'NoMatch'
        | 'MultipleSubscription';
    singleResultRadioIdLastFour?: string;
}

@Component({
    selector: 'streaming-flepz-lookup',
    templateUrl: './streaming-flepz-lookup.component.html',
    styleUrls: ['./streaming-flepz-lookup.component.scss'],
})
export class StreamingFlepzLookupComponent {
    translateKeyPrefix = 'DomainsIdentityUiStreamingFlepzLookupFormModule.StreamingFlepzLookupComponent.';
    @Output() signInRequested = new EventEmitter();
    @Output() lookupCompleted = new EventEmitter<LookupCompletedData>();
    @Input() isInvalidEmailErrors: boolean;
    @Input() isInvalidFirstNameErrors: boolean;
    @Input() hideHeadlineAndInstructions: string;
    @ViewChild(StreamingFlepzLookupFormComponent) private readonly _flepzForm: StreamingFlepzLookupFormComponentApi;

    constructor(private readonly _store: Store, private readonly _streamingFlepzLookupWorkflowService: StreamingFlepzLookupWorkflowService) {}

    onFormSubmitted(flepzData: FlepzData) {
        this._streamingFlepzLookupWorkflowService
            .build(flepzData)
            .pipe(
                withLatestFrom(
                    this._store.select(streamingFlepzLookupAccountsAsArray),
                    this._store.select(numberOfSubscriptionsFound),
                    this._store.select(singleAccountResultFirstSubscription)
                ),
                map(([, results, totalSubscriptionsFound, singleAccountFirstSubscription]) => ({ results, totalSubscriptionsFound, singleAccountFirstSubscription }))
            )
            .subscribe({
                next: ({ results, totalSubscriptionsFound, singleAccountFirstSubscription }) => {
                    const data: LookupCompletedData = {
                        flepzData: flepzData,
                        totalSubscriptionsFound,
                        singleResultRadioIdLastFour: singleAccountFirstSubscription?.radioService?.last4DigitsOfRadioId,
                    };
                    switch (results.length) {
                        case 1: {
                            if (results[0].subscriptions && results[0].subscriptions.length === 1) {
                                if (singleAccountFirstSubscription.status) {
                                    const status = singleAccountFirstSubscription.status.toLowerCase();
                                    if (status === 'closed' || status === 'inactive') {
                                        data.ineligibleReason = 'InActive';
                                    }
                                }
                                if (singleAccountFirstSubscription.inEligibleReasonCode) {
                                    const ineligibleReason = singleAccountFirstSubscription.inEligibleReasonCode.toLowerCase();
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
                                    } else if (ineligibleReason === 'existingsxir' && singleAccountFirstSubscription.hasOACCredentials === false) {
                                        data.ineligibleReason = 'NeedsCredentials';
                                    } else if (ineligibleReason === 'existingsxir' && singleAccountFirstSubscription.hasOACCredentials === true) {
                                        data.ineligibleReason = 'SingleMatchOAC';
                                    }
                                } else if (singleAccountFirstSubscription.eligibleService) {
                                    const eligibleService = singleAccountFirstSubscription.eligibleService.toLowerCase();
                                    if (eligibleService === 'sxir_standalone') {
                                        data.ineligibleReason = 'NoAudio';
                                    }
                                }
                            } else if (results[0].subscriptions && results[0].subscriptions.length > 1) {
                                data.ineligibleReason = 'MultipleSubscription';
                            } else {
                                data.ineligibleReason = 'NoMatch';
                            }
                            break;
                        }
                        case 0: {
                            data.ineligibleReason = 'NoMatch';
                            break;
                        }
                        default: {
                            if (results) {
                                let subscriptionLength = 0;
                                results.forEach((element) => {
                                    if (element && element.subscriptions) {
                                        subscriptionLength += element.subscriptions.length;
                                    }
                                });
                                if (subscriptionLength !== 0) {
                                    data.ineligibleReason = 'MultipleSubscription';
                                } else {
                                    data.ineligibleReason = 'NoMatch';
                                }
                            }
                        }
                    }
                    this.lookupCompleted.emit(data);
                    this._flepzForm.completedProcessing();
                },
                error: () => {
                    this._flepzForm.showSystemError();
                    this._flepzForm.completedProcessing();
                },
            });
    }
}
