import { Injectable, Inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, concatMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { LoadMoreBillingActivityRecordsWorkflowService } from '@de-care/domains/account/state-billing-activity';
import { setHasInitLoaded } from '@de-care/domains/account/state-billing-activity';
import { TranslationSettingsToken, TRANSLATION_SETTINGS } from '@de-care/shared/configuration-tokens-locales';

@Injectable({ providedIn: 'root' })
export class LoadBillingHistoryRecordsWorkflowService implements DataWorkflow<null, boolean> {
    constructor(
        private readonly _store: Store,
        private readonly _loadMoreBillingActivityRecordsWorkflowService: LoadMoreBillingActivityRecordsWorkflowService,
        @Inject(TRANSLATION_SETTINGS) private readonly _translationSettings: TranslationSettingsToken
    ) {}

    build(): Observable<boolean> {
        const oneYearAgo = new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString();
        const today = new Date().toISOString();
        this._store.dispatch(setHasInitLoaded({ hasInitLoaded: false }));
        return this._loadMoreBillingActivityRecordsWorkflowService
            .build({ startDate: oneYearAgo, endDate: today, transactionType: 'subscription', locales: this._translationSettings.languagesSupported })
            .pipe(
                concatMap(() => {
                    // load the rest of the data from MS
                    return this._loadMoreBillingActivityRecordsWorkflowService.build({
                        transactionType: 'subscription',
                        locales: this._translationSettings.languagesSupported,
                    });
                }),
                catchError((error) => {
                    return throwError(error);
                })
            );
    }
}
