import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { DataQuoteWorkflow, QuoteWorkflowStatus } from '@de-care/de-care-use-cases/trial-activation/rtp/state-shared';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class QuoteInformationGuard implements CanActivate {
    constructor(private readonly _dataQuoteWorkflow: DataQuoteWorkflow, private readonly _router: Router) {}

    canActivate() {
        return this._dataQuoteWorkflow.build().pipe(map(status => status === QuoteWorkflowStatus.success || this._router.createUrlTree(['error'])));
    }
}
