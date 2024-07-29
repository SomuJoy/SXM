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
export class GetVerifyOptionsWorkflow implements DataWorkflow<string, boolean> {
    constructor(private readonly _registerVerifyOptionsService: RegisterVerifyOptionsService, private readonly _store: Store) {}

    build(lastFourOfAccountNumber: string) {
        return this._registerVerifyOptionsService.getVerifyOptions({ accountNumber: lastFourOfAccountNumber }).pipe(
            tap(({ canUsePhone, canUseRadioId, canUseAccountNumber, canUseEmail }) =>
                this._store.dispatch(
                    setVerificationMethods({
                        verificationMethods: {
                            phone: { eligible: canUsePhone, verified: false },
                            radioId: { eligible: canUseRadioId, verified: false },
                            accountNumber: { eligible: canUseAccountNumber, verified: false },
                            email: { eligible: canUseEmail, verified: false },
                        },
                    })
                )
            ),
            map((res) => !!res),
            catchError(() => {
                this._store.dispatch(fetchVerificationOptionsCompleted({ hasError: true }));
                return of(false);
            })
        );
    }
}
