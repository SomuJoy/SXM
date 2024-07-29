import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoadEnvironmentInfoWorkflowService } from './workflows/load-environment-info-workflow.service';

@Injectable({ providedIn: 'root' })
export class CanActivateLoadEnvironmentInfo implements CanActivate {
    constructor(private readonly _loadEnvironmentInfoWorkflowService: LoadEnvironmentInfoWorkflowService, private readonly _router: Router) {}

    canActivate(): Observable<boolean | UrlTree> {
        return this._loadEnvironmentInfoWorkflowService.build().pipe(
            catchError(() => {
                return of(this._router.createUrlTree(['/error']));
            })
        );
    }
}
