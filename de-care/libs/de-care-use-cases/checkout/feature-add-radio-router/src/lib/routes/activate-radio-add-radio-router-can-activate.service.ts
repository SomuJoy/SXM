import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
    GetDeviceStatusForRouterWorkflowService,
    GetDeviceStatusForRouterWorkflowServiceErrors,
    LoadAddRadioActivateRadioWorkflowService,
} from '@de-care/de-care-use-cases/checkout/state-add-radio-router';

@Injectable({
    providedIn: 'root',
})
export class ActivateRadioAddRadioRouterCanActivateService implements CanActivate {
    constructor(
        private readonly _loadAddRadioActivateRadioWorkflowService: LoadAddRadioActivateRadioWorkflowService,
        private readonly _getDeviceStatusForRouterWorkflowService: GetDeviceStatusForRouterWorkflowService,
        private readonly _router: Router
    ) {}

    canActivate(): Observable<any> {
        return this._loadAddRadioActivateRadioWorkflowService.build().pipe(
            map(() =>
                this._getDeviceStatusForRouterWorkflowService.build().subscribe({
                    next: (result) => {
                        if (result === 'ESN not in use') {
                            this._router.navigate(['/subscribe/checkout/purchase/satellite/add-radio-router/pick-a-plan']);
                        } else {
                            //TBD
                            this._router.navigate(['/subscribe/checkout/flepz']);
                        }
                    },
                    error: (error: { errorType: GetDeviceStatusForRouterWorkflowServiceErrors }) => {
                        if (error && error.errorType) {
                            this._router.createUrlTree(['/error']);
                        }
                    },
                })
            ),
            catchError(() => of(this._router.createUrlTree(['/error'])))
        );
    }
}
