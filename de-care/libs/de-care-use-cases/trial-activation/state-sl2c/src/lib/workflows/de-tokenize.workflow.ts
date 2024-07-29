import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, mapTo, tap } from 'rxjs/operators';
import { Sl2cTokenService } from '../data-services/sl2c-token.service';
import { setLast4digitsOfRadioId, setVinNumber } from '../state/actions';

export enum DetokenizeWorkflowServiceStatus {
    'success' = 'success',
    'fail' = 'fail'
}

@Injectable({ providedIn: 'root' })
export class DetokenizeWorkflowService implements DataWorkflow<string, DetokenizeWorkflowServiceStatus> {
    constructor(private readonly _sl2cTokenService: Sl2cTokenService, private readonly _store: Store) {}

    build(token: string) {
        return this._sl2cTokenService.getVinFromSl2cToken(token).pipe(
            tap(response => {
                this._store.dispatch(setVinNumber({ vin: response.vin }));
                this._store.dispatch(setLast4digitsOfRadioId({ last4digits: response.last4DigitsOfRadioId }));
            }),
            mapTo(DetokenizeWorkflowServiceStatus.success),
            catchError(() => of(DetokenizeWorkflowServiceStatus.fail))
        );
    }
}
