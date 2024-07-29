import { Injectable } from '@angular/core';
import { CreateAccountRequest, CreateNewAccountWithSubscriptionWorkflowService } from '@de-care/domains/subscriptions/state-new-account';
import { CreditCardUnexpectedError } from '@de-care/shared/de-microservices-common';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { select, Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, concatMap, mapTo, tap } from 'rxjs/operators';
import { getCreateAccountFormDataForSubmission } from '../state/selectors';
import { newTransactionIdDueToCreditCardError, setSuccessfulTransactionData } from '../state/actions';
import { TranslateService } from '@ngx-translate/core';

export const enum CreateAccountWorkflowStatus {
    'success' = 'success',
    'creditCardError' = 'creeditCardError',
    'fail' = 'fail',
}

@Injectable({ providedIn: 'root' })
export class CreateAccountWorkflowService implements DataWorkflow<void, CreateAccountWorkflowStatus> {
    constructor(
        private readonly _createAccountService: CreateNewAccountWithSubscriptionWorkflowService,
        private readonly _store: Store,
        private readonly _translationService: TranslateService
    ) {}

    build() {
        return this._store.pipe(
            select(getCreateAccountFormDataForSubmission),
            concatMap((formValues) => {
                if (formValues === null) {
                    return of(CreateAccountWorkflowStatus.fail);
                }
                return this.sendRequest(formValues as CreateAccountRequest);
            }),
            catchError(() => of(CreateAccountWorkflowStatus.fail))
        );
    }

    sendRequest(formValues: CreateAccountRequest) {
        return this._createAccountService.build({ ...formValues, languagePreference: this._translationService.currentLang }).pipe(
            tap(({ isEligibleForRegistration, subscriptionId, radioId, accountNumber }) => {
                this._store.dispatch(setSuccessfulTransactionData({ isEligibleForRegistration, subscriptionId, radioId, accountNumber }));
            }),
            mapTo(CreateAccountWorkflowStatus.success),
            catchError((err) => {
                if (err instanceof CreditCardUnexpectedError) {
                    this._store.dispatch(newTransactionIdDueToCreditCardError());
                    return of(CreateAccountWorkflowStatus.creditCardError);
                }
                return of(CreateAccountWorkflowStatus.fail);
            })
        );
    }
}
