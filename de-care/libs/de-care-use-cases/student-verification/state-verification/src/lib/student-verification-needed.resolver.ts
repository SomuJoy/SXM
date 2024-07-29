import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { Offer } from '@de-care/domains/offers/state-offers';
import { LoadOffersAndFollowOnsForStreamingWithCmsContent } from '@de-care/domains/offers/state-offers-with-cms';
import { select, Store } from '@ngrx/store';
import { combineLatest, EMPTY, Observable, of } from 'rxjs';
import { switchMap, catchError, map, concatMap, take } from 'rxjs/operators';
import { IPProvinceQuebecWorkflow } from '@de-care/data-workflows';
import { getQueryParamsAndSettings } from '@de-care/de-care-use-cases/student-verification/state-common';

export interface StudentVerificationRouteData {
    programCode: string;
    langPref: string;
}

@Injectable({
    providedIn: 'root',
})
export class StudentVerificationNeededResolver implements Resolve<Observable<StudentVerificationRouteData | never>> {
    constructor(
        private _store: Store,
        private readonly _loadOffersAndFollowOnsForStreamingWithCmsContent: LoadOffersAndFollowOnsForStreamingWithCmsContent,
        private _ipProvinceQuebecWorkflow: IPProvinceQuebecWorkflow,
        private _router: Router
    ) {}

    resolve(): Observable<StudentVerificationRouteData | never> {
        return combineLatest([
            this._store.pipe(
                select(getQueryParamsAndSettings),
                take(1),
                map(({ programcode: programCode, langpref: langPref, isCanada }) => ({
                    programCode: this._handleProgramCode(programCode, isCanada),
                    langPref,
                    isCanada,
                }))
            ),
        ]).pipe(
            concatMap(([context]) => {
                return this._loadOffersAndFollowOnsForStreamingWithCmsContent
                    .build({
                        programCode: context.programCode,
                        streaming: true,
                        student: true,
                        doesOfferNeedFollowOn: (offer: Offer) => offer.student && offer.type === 'RTP_OFFER',
                    })
                    .pipe(map(() => context));
            }),
            concatMap(({ programCode, langPref, isCanada }) => {
                if (!isCanada) {
                    return of({ programCode, langPref });
                }

                return this._ipProvinceQuebecWorkflow.build().pipe(
                    switchMap((isQuebec) => {
                        if (isQuebec) {
                            this._router.navigate(['/subscribe', 'checkout', 'streaming'], { queryParams: { programcode: programCode }, queryParamsHandling: 'merge' });
                            return EMPTY;
                        }

                        const routeData: StudentVerificationRouteData = {
                            programCode,
                            langPref,
                        };

                        return of(routeData);
                    }),
                    catchError(() =>
                        of({
                            programCode,
                            langPref,
                        })
                    )
                );
            })
        );
    }

    private _handleProgramCode(code: string, isCanada: boolean): string {
        return !!code && code !== '' ? code : isCanada ? 'CASTUDENTPS12MO' : 'STUDENTPS12MO';
    }
}
