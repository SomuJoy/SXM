import { Injectable } from '@angular/core';
import { DataValidationService } from '@de-care/data-services';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class PaymentInfoService {
    constructor(private _dataValidationService: DataValidationService) {}

    isValidCreditCardNumber(creditCardNumber: number): Observable<boolean> {
        return this._dataValidationService.validateCustomerInfo({ creditCard: { creditCardNumber } }).pipe(map(response => response.ccValidation.valid));
    }
}
