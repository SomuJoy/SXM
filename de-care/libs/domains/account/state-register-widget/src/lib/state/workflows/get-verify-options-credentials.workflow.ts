import { map, tap, catchError } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { RegisterVerifyOptionsService } from '@de-care/domains/account/state-account';
import { fetchVerificationOptionsCompleted, setVerificationMethods } from '../actions/actions';
import { of } from 'rxjs';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';

@Injectable({
    providedIn: 'root',
})
export class GetVerifyOptionsCredentialsWorkflow implements DataWorkflow<string, boolean> {
    constructor(private readonly _registerVerifyOptionsService: RegisterVerifyOptionsService, private readonly _store: Store) {}

    build(lastFourOfAccountNumber: string) {
        return this._registerVerifyOptionsService.getVerifyOptions({ accountNumber: lastFourOfAccountNumber }).pipe(
            catchError((error) => {
                return of(error);
            })
        );
    }
}
