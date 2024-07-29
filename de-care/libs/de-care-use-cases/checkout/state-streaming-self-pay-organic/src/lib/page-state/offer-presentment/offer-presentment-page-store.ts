import { ComponentStore } from '@ngrx/component-store';
import { LoadOffersForAnonymousUserWorkflowService } from '../../workflows/load-offers-for-anonymous-user-workflow.service';
import { suspensify } from '@jscutlery/operators';
import { Injectable } from '@angular/core';

@Injectable()
export class OfferPresentmentPageStore extends ComponentStore<object> {
    constructor(private readonly loadOffersForAnonymousUserWorkflowService: LoadOffersForAnonymousUserWorkflowService) {
        super({});
    }

    readonly viewModel$ = this.select(() => ({
        legalCopy: '',
        offerDescription: {
            packageData: null,
            theme: '',
            presentation: '',
        },
    }));

    readonly loadOfferPresentmentData$ = this.loadOffersForAnonymousUserWorkflowService.build().pipe(suspensify());
}
