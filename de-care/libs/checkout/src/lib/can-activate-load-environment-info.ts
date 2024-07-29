import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { LoadEnvironmentInfoWorkflowService } from '@de-care/domains/utility/state-environment-info';
import { catchError } from 'rxjs/operators';
import { DataLayerService } from '@de-care/data-layer';

@Injectable({ providedIn: 'root' })
export class CanActivateLoadEnvironmentInfo implements CanActivate {
    constructor(
        private readonly _loadEnvironmentInfoWorkflowService: LoadEnvironmentInfoWorkflowService,
        private readonly _router: Router,
        private readonly _dataLayerService: DataLayerService
    ) {}

    canActivate(): Observable<boolean | UrlTree> {
        return this._loadEnvironmentInfoWorkflowService.build().pipe(
            catchError(error => {
                this._dataLayerService.buildErrorInfo(error);
                return of(this._router.createUrlTree(['/error']));
            })
        );
    }
}
