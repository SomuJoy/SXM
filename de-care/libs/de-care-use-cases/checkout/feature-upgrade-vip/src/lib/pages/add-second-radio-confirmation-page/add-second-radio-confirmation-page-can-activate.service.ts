import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { OrderCompletedForAddSecondRadioWorkflowService } from '@de-care/de-care-use-cases/checkout/state-upgrade-vip';
import { map } from 'rxjs/operators';
@Injectable()
export class AddSecondRadioConfirmationPageCanActivateService implements CanActivate {
    constructor(private readonly _orderCompletedForAddSecondRadioWorkflowService: OrderCompletedForAddSecondRadioWorkflowService, private readonly _router: Router) {}

    canActivate() {
        return this._orderCompletedForAddSecondRadioWorkflowService.build().pipe(
            map((isCompleted) => {
                if (isCompleted) {
                    return true;
                }
                return this._router.createUrlTree(['/error']);
            })
        );
    }
}
