import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable, throwError } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { concatMap, take, tap, catchError } from 'rxjs/operators';
import { getChangeSubscriptionSubmitData } from './state/selectors/state.selectors';
import { ChangeSubscriptionWorkflowService } from '@de-care/domains/purchase/state-change-subscription';
import {
    setSubmitChangeSubscriptionDataAsProcessing,
    setSubmitChangeSubscriptionDataAsNotProcessing,
    newTransactionIdDueToCreditCardError,
    setIsRefreshAllowed,
} from './state/actions';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class SubmitChangeSubscriptionWorkflowService implements DataWorkflow<void, void> {
    constructor(
        private readonly _store: Store,
        private readonly _changeSubscriptionWorkflowService: ChangeSubscriptionWorkflowService,
        private readonly _translationService: TranslateService
    ) {}

    build(): Observable<any> {
        return this._store.pipe(
            select(getChangeSubscriptionSubmitData),
            take(1),
            tap(() => this._store.dispatch(setSubmitChangeSubscriptionDataAsProcessing())),
            concatMap((data) =>
                this._changeSubscriptionWorkflowService.build({ ...data, languagePreference: this._translationService.currentLang }).pipe(
                    tap((response) => this._store.dispatch(setIsRefreshAllowed({ isRefreshAllowed: response.isRefreshAllowed }))),
                    tap(() => this._store.dispatch(setSubmitChangeSubscriptionDataAsNotProcessing())),
                    catchError((error) => {
                        if (error === 'CREDIT_CARD_FAILURE') {
                            this._store.dispatch(newTransactionIdDueToCreditCardError());
                        }
                        this._store.dispatch(setSubmitChangeSubscriptionDataAsNotProcessing());
                        return throwError(error);
                    })
                )
            )
        );
    }
}
