import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { filter, map, takeUntil, tap } from 'rxjs/operators';
import { getSxmValidator } from '@de-care/shared/validation';
import { SxmLanguages } from '@de-care/app-common';
import { sxmCountries } from '@de-care/settings';

export class LookupByRadioIdOrAccountNumberForm extends FormGroup {
    readonly verifyType = this.get('verifyType');
    readonly identifier = this.get('identifier');
    private _previousRadioValue: string;
    private _previousAccountNumberValue: string;

    unsubscribe$ = new Subject();

    constructor(readonly language: SxmLanguages, readonly country: sxmCountries, readonly fb = new FormBuilder()) {
        super(
            fb.group({
                verifyType: ['radioId'],
                identifier: [null, { updateOn: 'blur' }]
            }).controls
        );

        this.identifier.setValidators(getSxmValidator('radioId', country, language));

        this.verifyType.valueChanges
            .pipe(
                filter(value => {
                    return !!value;
                }),
                takeUntil(this.unsubscribe$),
                map(value => this._cacheValue(value))
            )
            .subscribe((value: string) => {
                value === 'accountNumber' ? this.identifier.setValidators(getSxmValidator('accountNumber')) : this.identifier.setValidators(getSxmValidator('radioId'));
                this.identifier.updateValueAndValidity();
            });
    }

    private _cacheValue(value: string): string {
        return value === 'radioId' ? this._cacheRadioId(value) : this._cacheAccountNumber(value);
    }

    private _cacheRadioId(verifyType: string): string {
        this._previousAccountNumberValue = this.identifier.value;
        this.identifier.reset(this._previousRadioValue);
        return verifyType;
    }

    private _cacheAccountNumber(verifyType: string): string {
        this._previousRadioValue = this.identifier.value;
        this.identifier.reset(this._previousAccountNumberValue);
        return verifyType;
    }
}
