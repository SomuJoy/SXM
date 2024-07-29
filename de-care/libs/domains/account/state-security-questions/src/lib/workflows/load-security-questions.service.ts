import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { mapTo, tap } from 'rxjs/operators';
import { SecurityQuestionsService } from '../data-services/security-questions.service';
import { setTranslatedSecurityQuestions, setUntranslatedSecurityQuestions } from '../state/actions';

@Injectable({ providedIn: 'root' })
export class LoadSecurityQuestionsService implements DataWorkflow<void, boolean> {
    constructor(private readonly _securityQuestionsService: SecurityQuestionsService, private readonly _translateService: TranslateService, private readonly _store: Store) {}

    build(): Observable<boolean> {
        return this._securityQuestionsService.fetchSecurityQuestions().pipe(
            tap(untranslatedQuestions => {
                const translatedQuestions = untranslatedQuestions.map(q => {
                    return {
                        id: q.id,
                        question: this._translateService.instant(`securityQuestions.${q.id}`)
                    };
                });
                this._store.dispatch(setUntranslatedSecurityQuestions({ securityQuestions: untranslatedQuestions }));
                this._store.dispatch(setTranslatedSecurityQuestions({ securityQuestions: translatedQuestions }));
            }),
            mapTo(true)
        );
    }
}
