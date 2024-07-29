import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { Offer } from '@de-care/domains/offers/state-offers';
import { LoadOffersAndFollowOnsForStreamingWithCmsContent } from '@de-care/domains/offers/state-offers-with-cms';
import { SettingsService } from '@de-care/settings';
import { select, Store } from '@ngrx/store';
import { combineLatest, EMPTY, Observable, of } from 'rxjs';
import { switchMap, catchError, map, concatMap, take } from 'rxjs/operators';
import { IPProvinceQuebecWorkflow } from '@de-care/data-workflows';
import { getNormalizedQueryParams } from '@de-care/shared/state-router-store';

export interface StudentVerificationRouteData {
    programCode: string;
    langPref: string;
}

@Injectable({
    providedIn: 'root',
})
export class StudentVerificationNeededResolver implements Resolve<Observable<StudentVerificationRouteData | never>> {
    constructor(
        private _store: Store<{}>,
        private readonly _loadOffersAndFollowOnsForStreamingWithCmsContent: LoadOffersAndFollowOnsForStreamingWithCmsContent,
        private _settingsService: SettingsService,
        private _ipProvinceQuebecWorkflow: IPProvinceQuebecWorkflow,
        private _router: Router
    ) {}

    resolve(): Observable<StudentVerificationRouteData | never> {
        return combineLatest([
            this._store.pipe(
                select(getNormalizedQueryParams),
                take(1),
                map(({ programcode: programCode, langpref: langPref }) => ({
                    programCode: this._handleProgramCode(programCode),
                    langPref,
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
            concatMap(({ programCode, langPref }) => {
                if (!this._settingsService.isCanadaMode) {
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

    private _handleProgramCode(code: string): string {
        return !!code && code !== '' ? code : this._settingsService.isCanadaMode ? 'CASTUDENTPS12MO' : 'STUDENTPS12MO';
    }
}
