import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mapTo } from 'rxjs/operators';
import { clearSuggestedRegistrationServiceAddressSuggestions } from './actions';
import { collectRegistrationServiceAddressAndPhoneNumber } from './public.actions';

@Injectable()
export class RegistrationEffects {
    constructor(private readonly _actions$: Actions) {}

    clearSuggestedAddresses$ = createEffect(() =>
        this._actions$.pipe(ofType(collectRegistrationServiceAddressAndPhoneNumber), mapTo(clearSuggestedRegistrationServiceAddressSuggestions()))
    );
}
