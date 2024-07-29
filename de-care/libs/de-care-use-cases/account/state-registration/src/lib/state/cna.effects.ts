import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatMap, map, tap, withLatestFrom } from 'rxjs/operators';
import { clearValidateAddresError, setCNAFormData, setCNAFormDataOnSubmission, validateAddress, validateAddressError } from './actions';
import { AddressCorrectionAction, CustomerValidationAddressesWorkFlowService } from '@de-care/domains/customer/state-customer-verification';
import { getCNADataAVS } from './selectors';

@Injectable()
export class CNAEffects {
    constructor(
        private readonly _actions$: Actions,
        private readonly customerValidationAddressWorkflow: CustomerValidationAddressesWorkFlowService,
        private readonly _router: Router,
        private readonly _store: Store
    ) {}

    validateAddress$ = createEffect(() =>
        this._actions$.pipe(
            ofType(validateAddress),
            map(action => action.CNAFormData),
            concatMap(formData =>
                this.customerValidationAddressWorkflow
                    .build({
                        serviceAddress: {
                            addressLine1: formData.addressLine1,
                            city: formData.city,
                            state: formData.state,
                            zip: formData.zip
                        },
                        email: {
                            email: formData.email
                        }
                    })
                    .pipe(
                        map(results =>
                            results.serviceAddress.addressCorrectionAction === AddressCorrectionAction.AutoCorrect
                                ? setCNAFormData({
                                      CNAFormData: {
                                          ...formData,
                                          avsvalidated: results.serviceAddress.validated,
                                          serviceAddress: true
                                      }
                                  })
                                : validateAddressError({ CNAFormValidationError: results.serviceAddress })
                        )
                    )
            )
        )
    );

    submitAndRedirectAfterAddressFailure$ = createEffect(() =>
        this._actions$.pipe(
            ofType(setCNAFormDataOnSubmission),
            withLatestFrom(this._store.select(getCNADataAVS)),
            map(([action, cnaData]) =>
                validateAddress({
                    CNAFormData: {
                        ...action.CNAFormData,
                        ...cnaData
                    }
                })
            )
        )
    );

    clearCNAFormValidationErrorOnSubmit$ = createEffect(() =>
        this._actions$.pipe(
            ofType(setCNAFormData),
            map(() => clearValidateAddresError())
        )
    );

    submitAndRedirect$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(setCNAFormData),
                tap(() => this._router.navigate(['account', 'registration', 'register']))
            ),
        { dispatch: false }
    );
}
