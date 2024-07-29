import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { iif, of } from 'rxjs';
import { concatMap, map, withLatestFrom } from 'rxjs/operators';
import { SecurityQuestionsService } from './../data-services/security-questions.service';
import { fetchSecurityQuestions, setTranslatedSecurityQuestions, setUntranslatedSecurityQuestions } from './actions';
import { getUntranslatedSecurityQuestions } from './selectors';

@Injectable({
    providedIn: 'root'
})
export class SecurityQuestionsEffects {
    constructor(private _actions: Actions, private _store: Store, private _translateService: TranslateService, private _securityQuestionsService: SecurityQuestionsService) {}

    translatedSecurityQuestions$ = createEffect(() =>
        this._translateService.onLangChange.pipe(
            withLatestFrom(this._store.pipe(select(getUntranslatedSecurityQuestions))),
            map(([_, untranslatedQuestions]) => {
                const translatedQuestions = untranslatedQuestions.map(q => ({
                    id: q.id,
                    question: this._translateService.instant(`securityQuestions.${q.id}`)
                }));

                return setTranslatedSecurityQuestions({ securityQuestions: translatedQuestions });
            })
        )
    );

    fetchSecurityQuestions$ = createEffect(() =>
        this._actions.pipe(
            ofType(fetchSecurityQuestions),
            concatMap(({ accountRegistered }) => {
                return iif(() => accountRegistered, of(setTranslatedSecurityQuestions({ securityQuestions: [] })), this._fetchAndSetSecurityQuestions());
            })
        )
    );

    private _fetchAndSetSecurityQuestions() {
        return this._securityQuestionsService.fetchSecurityQuestions().pipe(
            concatMap(untranslatedQuestions => {
                const translatedQuestions = untranslatedQuestions.map(q => {
                    return {
                        id: q.id,
                        question: this._translateService.instant(`securityQuestions.${q.id}`)
                    };
                });
                return [
                    setUntranslatedSecurityQuestions({ securityQuestions: untranslatedQuestions }),
                    setTranslatedSecurityQuestions({ securityQuestions: translatedQuestions })
                ];
            })
        );
    }
}
