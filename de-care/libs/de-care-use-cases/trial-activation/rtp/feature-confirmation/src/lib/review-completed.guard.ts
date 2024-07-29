import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LoadNewAccountWorkflowService, LoadNewAccountWorkflowServiceStatus } from '@de-care/de-care-use-cases/trial-activation/rtp/state-shared';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ReviewCompletedGuard implements CanActivate {
    constructor(private readonly _router: Router, private readonly _loadNewAccountWorkFlowService: LoadNewAccountWorkflowService) {}

    canActivate() {
        return this._loadNewAccountWorkFlowService
            .build()
            .pipe(map(result => result === LoadNewAccountWorkflowServiceStatus.success || this._router.createUrlTree(['activate/trial/rtp'])));
    }
}
