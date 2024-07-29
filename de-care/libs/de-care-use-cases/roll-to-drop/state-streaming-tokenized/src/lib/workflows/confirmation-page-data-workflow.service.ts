import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { map, take, withLatestFrom } from 'rxjs/operators';
import { LoadSecurityQuestionsService } from '@de-care/domains/account/state-security-questions';
import { selectConfirmationData } from '../state/selectors';

@Injectable({ providedIn: 'root' })
export class ConfirmationPageDataWorkflow implements DataWorkflow<void, void> {
    constructor(private readonly _store: Store, private readonly _loadSecurityQuestionsService: LoadSecurityQuestionsService) {}

    build(): Observable<void> {
        return this._loadSecurityQuestionsService.build().pipe(
            withLatestFrom(this._store.select(selectConfirmationData)),
            take(1),
            map(([hasSecurityQuestions, confirmationData]) => {
                if (
                    !!hasSecurityQuestions &&
                    !!confirmationData &&
                    !!confirmationData?.registerCompData &&
                    !!confirmationData?.offersData &&
                    !!confirmationData?.quotes &&
                    !!confirmationData?.registerCompData?.email
                ) {
                    return;
                } else {
                    throw new Error('Missing confirmation data');
                }
            })
        );
    }
}
