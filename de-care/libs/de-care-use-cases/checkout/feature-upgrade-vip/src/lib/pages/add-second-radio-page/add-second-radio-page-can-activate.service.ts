import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LoadAddSecondRadioDataWorkflowService } from '@de-care/de-care-use-cases/checkout/state-upgrade-vip';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
@Injectable()
export class AddSecondRadioPageCanActivateService implements CanActivate {
    constructor(private readonly _loadAddSecondRadioDataWorkflowService: LoadAddSecondRadioDataWorkflowService, private readonly _router: Router) {}

    canActivate() {
        return this._loadAddSecondRadioDataWorkflowService.build().pipe(
            catchError(() => {
                return of(this._router.createUrlTree(['/subscribe/upgrade-vip/error']));
            })
        );
    }
}
