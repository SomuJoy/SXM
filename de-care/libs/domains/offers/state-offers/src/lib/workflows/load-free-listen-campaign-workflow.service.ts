import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { DataFreeListenPromoService } from '../data-services/data-free-listen-promo.service';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

interface LoadFreeListenCampaignWorkflowRequest {
    promoCode: string;
}
interface LoadFreeListenCampaignWorkflowResponse {
    endDate: string;
    isActive: boolean;
}

export type LoadFreeListenCampaignWorkflowErrors = 'PROMO_CODE_NOT_FOUND' | 'SYSTEM';

@Injectable({ providedIn: 'root' })
export class LoadFreeListenCampaignWorkflowService implements DataWorkflow<LoadFreeListenCampaignWorkflowRequest, LoadFreeListenCampaignWorkflowResponse> {
    constructor(private readonly _store: Store, private readonly _dataFreeListenPromoService: DataFreeListenPromoService) {}

    build(request: LoadFreeListenCampaignWorkflowRequest): Observable<LoadFreeListenCampaignWorkflowResponse> {
        return this._dataFreeListenPromoService.getCampaign(request).pipe(
            tap((response) => {
                // TODO: Add any behavior tracking needed here
            }),
            map(({ endDate, active }) => ({
                endDate,
                isActive: active,
            })),
            catchError((error) => {
                let errorType: LoadFreeListenCampaignWorkflowErrors = 'SYSTEM';
                if (['PROMO_CODE_NOT_FOUND'].includes(error.errorCode)) {
                    errorType = 'PROMO_CODE_NOT_FOUND';
                }
                return throwError(errorType);
            })
        );
    }
}
