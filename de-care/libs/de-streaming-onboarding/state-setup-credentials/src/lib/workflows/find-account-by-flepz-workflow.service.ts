import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap, withLatestFrom } from 'rxjs/operators';
import { collectFlepzData, collectSelectedRadioIdLastFour } from '../state/actions';
import { FlepzData } from '../state/reducer';
import {
    numberOfSubscriptionsFound,
    singleAccountResultFirstSubscriptionRadioIdLastFour,
    streamingFlepzLookupAccountsAsArray,
    StreamingFlepzLookupWorkflowService
} from '@de-care/domains/identity/state-streaming-flepz-lookup';
import { Router } from '@angular/router';

enum errorType {
    SYSTEM,
    BUSINESS
}

@Injectable({ providedIn: 'root' })
export class FindAccountByFlepzWorkflowService implements DataWorkflow<FlepzData, any[]> {
    subscriptionValue = this._store.select(streamingFlepzLookupAccountsAsArray);

    constructor(
        private readonly _store: Store,
        private readonly _streamingFlepzLookupWorkflowService: StreamingFlepzLookupWorkflowService,
        private readonly _router: Router
    ) {}

    build(flepzData: FlepzData): Observable<any> {
        return this._streamingFlepzLookupWorkflowService.build(flepzData).pipe(
            tap(() => this._store.dispatch(collectFlepzData({ flepzData }))),
            withLatestFrom(
                this._store.select(streamingFlepzLookupAccountsAsArray),
                this._store.select(numberOfSubscriptionsFound),
                this._store.select(singleAccountResultFirstSubscriptionRadioIdLastFour)
            ),
            tap(([, , totalSubscriptionsFound, firstAccountSubscriptionRadioIdLastFour]) => {
                if (totalSubscriptionsFound === 1) {
                    this._store.dispatch(collectSelectedRadioIdLastFour({ selectedRadioIdLastFour: firstAccountSubscriptionRadioIdLastFour }));
                }
            }),
            map(([_, results]) => {
                switch (results.length) {
                    case 1: {
                        if (results[0].subscriptions && results[0].subscriptions.length === 1) {
                            if (results[0].subscriptions[0].status) {
                                const status = results[0].subscriptions[0].status.toLowerCase();
                                if (status === 'closed' || 'inactive') {
                                    this._router.navigate(['/setup-credentials/closed-subscription']);
                                }
                            }
                            if (results[0].subscriptions[0].inEligibleReasonCode) {
                                const ineligibleReason = results[0].subscriptions[0].inEligibleReasonCode.toLowerCase();
                                if (ineligibleReason === 'paymentissues') {
                                    this._router.navigate(['/setup-credentials/ineligible-non-pay']);
                                } else if (ineligibleReason === 'nonconsumer') {
                                    this._router.navigate(['/setup-credentials/ineligible-non-consumer']);
                                } else if (ineligibleReason === 'trialwithinlasttrialdate') {
                                    this._router.navigate(['/setup-credentials/ineligible-trial-within-last-trial-date']);
                                } else if (ineligibleReason === 'maxlifetimetrials') {
                                    this._router.navigate(['/setup-credentials/ineligible-max-lifetime-trials']);
                                } else if (ineligibleReason === 'insufficientpackage') {
                                    this._router.navigate(['/setup-credentials/ineligible-insufficient-package']);
                                } else if (ineligibleReason === 'expiredaatrial') {
                                    this._router.navigate(['/setup-credentials/ineligible-expired-AA-trial']);
                                } else if (ineligibleReason === 'existingsxirnocredentials') {
                                    this._router.navigate(['/setup-credentials/credential-setup']);
                                } else if (ineligibleReason === 'existingsxir' && results[0].subscriptions[0].hasOACCredentials === false) {
                                    this._router.navigate(['/setup-credentials/credential-setup']);
                                } else if (ineligibleReason === 'existingsxir' && results[0].subscriptions[0].hasOACCredentials === true) {
                                    this._router.navigate(['/setup-credentials/singlematch-oac']);
                                }
                            } else if (results[0].subscriptions[0].eligibleService) {
                                const eligibleService = results[0].subscriptions[0].eligibleService.toLowerCase();
                                if (eligibleService === 'sxir_standalone') {
                                    this._router.navigate(['/setup-credentials/ineligible-no-audio']);
                                }
                            }
                        } else if (results[0].subscriptions && results[0].subscriptions.length > 1) {
                            this._router.navigate(['/setup-credentials/multiple-subscriptions-page']);
                        } else {
                            this._router.navigate(['/setup-credentials/no-match']);
                        }
                        break;
                    }
                    case 0: {
                        this._router.navigate(['/setup-credentials/no-match']);
                        break;
                    }
                    default: {
                        if (results) {
                            let subscriptionLength = 0;
                            results.forEach(element => {
                                if (element && element.subscriptions) {
                                    subscriptionLength += element.subscriptions.length;
                                }
                            });
                            if (subscriptionLength !== 0) {
                                this._router.navigate(['/setup-credentials/multiple-subscriptions-page']);
                            } else {
                                this._router.navigate(['/setup-credentials/no-match']);
                            }
                        }
                    }
                }
            }),
            catchError(error => {
                const errorResponse = error?.error?.error;
                if (errorResponse?.fieldErrors) {
                    if (errorResponse?.fieldErrors[0].errorType === 'BUSINESS') {
                        return throwError({ errorType: errorType.BUSINESS });
                    }
                }
                return throwError({ errorType: errorType.SYSTEM });
            })
        );
    }
}
