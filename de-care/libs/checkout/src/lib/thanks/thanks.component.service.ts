import { Injectable } from '@angular/core';
import { CheckoutNavigationService } from '../checkout-navigation.service';

@Injectable()
export class ThanksComponentService {
    constructor(private _checkoutNavigationService: CheckoutNavigationService) {}

    handleNoStateData(): void {
        this._checkoutNavigationService.goToConfirmationPageReloaded();
    }

    // TODO: move more of the logic out of ThanksComponent class and into here (the component "facade")
}
