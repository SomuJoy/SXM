import { Inject, Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { combineLatest, Observable } from 'rxjs';
import { LoadCustomerOffersWithCmsContent } from '@de-care/domains/offers/state-offers-with-cms';
import { mapTo, switchMap, take, tap, withLatestFrom } from 'rxjs/operators';
import { behaviorEventReactionForProgramCode } from '@de-care/shared/state-behavior-events';
import { select, Store } from '@ngrx/store';
import { getLandingPageInboundUrlParams } from './state/selectors/state.selectors';
import { getOffersPackageNames } from './state/selectors/plan.selectors';
import { setAccountNumber, setCanUseDetailedGrid, setPickAPlanSelectedOfferPackageName, setRadioId } from './state/actions';
import { getSelectedProvince } from '@de-care/domains/customer/state-locale';
import { CountrySettingsToken, COUNTRY_SETTINGS } from '@de-care/shared/configuration-tokens-locales';

interface WorkflowRequest {
    radioId: string;
    accountNumber: string;
}

@Injectable({ providedIn: 'root' })
export class LoadCustomerPlansWorkflowService implements DataWorkflow<WorkflowRequest, boolean> {
    constructor(
        private readonly _loadCustomerOffersWithCmsContent: LoadCustomerOffersWithCmsContent,
        private readonly _store: Store,
        @Inject(COUNTRY_SETTINGS) private readonly _countrySettings: CountrySettingsToken
    ) {
        this._store.dispatch(setCanUseDetailedGrid({ canUseDetailedGrid: this._countrySettings.countryCode.toLowerCase() === 'us' }));
    }

    build({ radioId, accountNumber }: WorkflowRequest): Observable<boolean> {
        return combineLatest([this._store.pipe(select(getLandingPageInboundUrlParams)), this._store.pipe(select(getSelectedProvince))]).pipe(
            take(1),
            switchMap(([{ programCode, promocode }, province]) => {
                return this._loadCustomerOffersWithCmsContent
                    .build({
                        programCode,
                        radioId,
                        marketingPromoCode: promocode,
                        province,
                        streaming: false,
                    })
                    .pipe(
                        withLatestFrom(this._store.pipe(select(getOffersPackageNames))),
                        tap(([_, packageNames]) => {
                            this._store.dispatch(setPickAPlanSelectedOfferPackageName({ selectedOfferPackageName: packageNames[0] }));
                            this._store.dispatch(setAccountNumber({ accountNumber }));
                            this._store.dispatch(setRadioId({ radioId }));
                            if (programCode) {
                                this._store.dispatch(behaviorEventReactionForProgramCode({ programCode }));
                            }
                        }),
                        mapTo(true)
                    );
            })
        );
    }
}
