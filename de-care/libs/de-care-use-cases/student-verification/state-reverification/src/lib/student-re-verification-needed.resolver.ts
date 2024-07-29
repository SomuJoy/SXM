import { LoadOffersWithCmsContent } from '@de-care/domains/offers/state-offers-with-cms';
import { setStudentReverificationData } from './state/actions/actions';
import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { combineLatest, EMPTY, Observable, of } from 'rxjs';
import { concatMap, map, take, tap } from 'rxjs/operators';
import { getQueryParamsAndSettings } from '@de-care/de-care-use-cases/student-verification/state-common';
import { LoadOffersWorkflowService } from '@de-care/domains/offers/state-offers';

@Injectable({
    providedIn: 'root',
})
export class StudentReVerificationNeededResolver implements Resolve<Observable<null | never>> {
    constructor(
        private _store: Store,
        private readonly _loadOffersWithCmsContent: LoadOffersWithCmsContent,
        private readonly _loadOffersWorkflowService: LoadOffersWorkflowService,
        private _router: Router
    ) {}

    resolve(): Observable<null | never> {
        return combineLatest([
            this._store.pipe(
                select(getQueryParamsAndSettings),
                take(1),
                map(({ programcode: programCode, langpref: langPref, tkn, isCannada, isQuebec }) => ({
                    programCode: this._handleProgramCode(programCode, isCannada),
                    langPref,
                    tkn,
                    isCannada,
                    isQuebec,
                }))
            ),
        ]).pipe(
            concatMap(([context]) => {
                return this._loadOffersWithCmsContent.build({ programCode: context.programCode, streaming: true, student: true }).pipe(map(() => context));
            }),
            tap(({ programCode, langPref, tkn }) => this._store.dispatch(setStudentReverificationData({ programCode, langPref, tkn }))),
            concatMap(({ programCode, isCannada, isQuebec }) => {
                if (isCannada) {
                    return of(null);
                }
                        if (isQuebec) {
                            this._router.navigate(['/subscribe', 'checkout', 'streaming'], { queryParams: { programcode: programCode }, queryParamsHandling: 'merge' });
                            return EMPTY;
                        }
                        return of(null);
                    })
                );
    }

    private _handleProgramCode(code: string, isCannada: boolean): string {
        return !!code && code !== '' ? code : isCannada ? 'CASTUDENTPS12MO' : 'STUDENTPS12MO';
    }
}
