import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DataBillingActivityService } from '../data-services/data-billing-activity.service';
import { setBillingActivity, setHasActivityServerError } from '../state/actions';
import { setHasInitLoaded } from '../state/public.actions';
import { locales } from '../state/reducer';

interface WorkflowPayload {
    startDate?: string;
    endDate?: string;
    transactionType?: 'subscription' | 'payment';
    locales?: locales[];
}
export type LoadMoreBillingActivityWorkflowErrors = 'SYSTEM';

@Injectable({ providedIn: 'root' })
export class LoadMoreBillingActivityRecordsWorkflowService implements DataWorkflow<WorkflowPayload, boolean> {
    constructor(private readonly _store: Store, private readonly _dataBillingActivityService: DataBillingActivityService) {}

    build(payload: WorkflowPayload): Observable<boolean> {
        // endpoint request does not accept locales yet, so removing from request here to be used after response
        const { locales, ...request } = payload;
        return this._dataBillingActivityService.getBillingActivity(request).pipe(
            map((billingActivity) => {
                const billingActivityForState = locales?.flatMap((locale) => billingActivity?.billItems?.map((billItem) => ({ ...billItem, locale })));
                this._store.dispatch(
                    setBillingActivity({
                        billingActivity: billingActivityForState,
                    })
                );
                this._store.dispatch(setHasInitLoaded({ hasInitLoaded: true }));
                return true;
            }),
            catchError((error) => {
                if (error.errorCode === 'SYSTEM') {
                    this._store.dispatch(setHasActivityServerError({ hasActivityServerError: true }));
                }
                return throwError('SYSTEM' as LoadMoreBillingActivityWorkflowErrors);
            })
        );
    }
}
