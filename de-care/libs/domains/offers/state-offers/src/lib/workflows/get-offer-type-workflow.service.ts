import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { map } from 'rxjs/operators';
import { DataOffersService } from '../data-services/data-offers.service';

interface GetOfferTypeWorkflowParams {
    streaming: boolean;
    student?: boolean;
    programCode?: string;
    marketingPromoCode?: string;
    province?: string;
    retrieveFallbackOffer?: boolean;
}

@Injectable({
    providedIn: 'root',
})
export class GetOfferTypeWorkflowService implements DataWorkflow<GetOfferTypeWorkflowParams, string> {
    constructor(private readonly _dataOffersService: DataOffersService) {}

    build(request: GetOfferTypeWorkflowParams) {
        return this._dataOffersService.getOffers(request).pipe(map((offer) => offer[0].type));
    }
}
