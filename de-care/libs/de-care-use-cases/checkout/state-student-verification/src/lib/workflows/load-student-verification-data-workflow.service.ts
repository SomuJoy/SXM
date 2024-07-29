import { Inject, Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { CollectInboundQueryParamsWorkflowService, setSelectedPlanCode } from '@de-care/de-care-use-cases/checkout/state-common';
import { LoadEnvironmentInfoWorkflowService } from '@de-care/domains/utility/state-environment-info';
import { UpdateUsecaseWorkflowService } from '@de-care/domains/utility/state-update-usecase';
import { LoadAllPackageDescriptionsWorkflowService } from '@de-care/domains/offers/state-package-descriptions';
import { LoadOffersAndFollowOnsForStreamingWithCmsContent } from '@de-care/domains/offers/state-offers-with-cms';
import { concatMap, map, switchMap, take, tap, withLatestFrom } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { getFirstOfferPlanCode } from '@de-care/domains/offers/state-offers';
import { studentStreamingGetOfferPayload } from '../state/selectors';
import { SHEER_ID_WIDGET_URLS, SheerIdWidgetUrls } from '@de-care/shared/configuration-tokens-sheer-url';
import * as actions from '../state/actions';

export type LoadStudentVerificationDataWorkflowServiceError = 'REGULAR_CHECKOUT_FLOW_REQUIRED';

@Injectable({ providedIn: 'root' })
export class LoadStudentVerificationDataWorkflowService implements DataWorkflow<void, boolean> {
    constructor(
        private readonly _store: Store,
        private readonly _collectInboundQueryParamsWorkflowService: CollectInboundQueryParamsWorkflowService,
        private readonly _loadEnvironmentInfoWorkflowService: LoadEnvironmentInfoWorkflowService,
        private readonly _updateUsecaseWorkflowService: UpdateUsecaseWorkflowService,
        private readonly _loadAllPackageDescriptionsWorkflowService: LoadAllPackageDescriptionsWorkflowService,
        private readonly _loadOffersAndFollowOnsForStreamingWithCmsContent: LoadOffersAndFollowOnsForStreamingWithCmsContent,
        @Inject(SHEER_ID_WIDGET_URLS) private readonly _sheerIdWidgetUrls: SheerIdWidgetUrls
    ) {
        this._store.dispatch(
            actions.setSheerIdWidgetStudentVerificationUrl({
                sheerIdWidgetIdentificationUrl: this._sheerIdWidgetUrls.sheerIdIdentificationWidgetUrl,
            })
        );
    }

    private _collectQueryParams$ = this._collectInboundQueryParamsWorkflowService.build();
    private _loadEnvInfo$ = this._loadEnvironmentInfoWorkflowService.build();
    private _updateUseCase$ = this._updateUsecaseWorkflowService.build({ useCase: 'STUDENT_STREAMING', keepCustomerInfo: true }).pipe(map(() => true));

    private _loadOfferDataStudentVerification$ = this._store.select(studentStreamingGetOfferPayload).pipe(
        take(1),
        concatMap((loadOfferPayload) =>
            this._loadOffersAndFollowOnsForStreamingWithCmsContent.build({ ...loadOfferPayload }).pipe(
                withLatestFrom(this._store.select(getFirstOfferPlanCode)),
                tap(([, planCode]) => {
                    this._store.dispatch(setSelectedPlanCode({ planCode }));
                }),
                map(() => true)
            )
        )
    );

    build(): Observable<boolean> {
        return this._loadEnvInfo$.pipe(
            tap(() => {
                // Async load what we can
                this._loadAllPackageDescriptionsWorkflowService.build().subscribe();
            }),
            switchMap(() => this._collectQueryParams$),
            switchMap(() => this._updateUseCase$),
            switchMap(() => this._loadOfferDataStudentVerification$),
            map(() => true)
        );
    }
}
