import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { FormGroup, FormBuilder } from '@angular/forms';
import { take } from 'rxjs/operators';
import { getFieldsToDisplay, SubmitCustomerCollectionInfo } from '@de-care/de-care-use-cases/account/state-info-customer-collection';
import { Store } from '@ngrx/store';
import { SxmValidators } from '@de-care/shared/forms-validation';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'de-care-customer-info-collection-page',
    templateUrl: './customer-info-collection-page.component.html',
    styleUrls: ['./customer-info-collection-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerInfoCollectionPageComponent implements ComponentWithLocale, OnInit {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    infoForm: FormGroup;
    fieldFlag: { [key: string]: boolean } = {};
    loading$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    formErrors$: BehaviorSubject<number> = new BehaviorSubject(0);

    constructor(
        readonly translationsForComponentService: TranslationsForComponentService,
        private readonly _formBuilder: FormBuilder,
        private readonly _store: Store,
        private readonly _sxmValidators: SxmValidators,
        private readonly _submitCustomerCollectionInfo: SubmitCustomerCollectionInfo,
        private readonly _router: Router
    ) {
        translationsForComponentService.init(this);
        this.infoForm = this._formBuilder.group({
            firstName: [{ value: '', disabled: true }, this._sxmValidators.namePiece],
            lastName: [{ value: '', disabled: true }, this._sxmValidators.namePiece],
            phone: [{ value: '', disabled: true }, this._sxmValidators.phoneNumber],
            streetAddress: [{ value: '', disabled: true }, this._sxmValidators.streetAddressLine],
            city: [{ value: '', disabled: true }, this._sxmValidators.city],
            state: [{ value: '', disabled: true }, this._sxmValidators.stateProvince],
            zip: [{ value: '', disabled: true }, this._sxmValidators.postalCode],
            email: [{ value: '', disabled: true }, this._sxmValidators.emailForLookup],
            esn: [{ value: '', disabled: true }, this._sxmValidators.radioIdOrVin],
            accountNumber: [{ value: '', disabled: true }, this._sxmValidators.accountNumber],
            dateOfBirth: [{ value: '', disabled: true }, this._sxmValidators.dateOfBirth],
        });
    }

    ngOnInit(): void {
        const fieldsInForm = Object.keys(this.infoForm?.controls);
        this._store
            .select(getFieldsToDisplay)
            .pipe(take(1))
            .subscribe((fieldsInToken) => {
                fieldsInForm.forEach((fieldInForm) => {
                    const flagStatus = fieldsInToken.some((fieldInToken) => fieldInToken?.toLowerCase() === fieldInForm?.toLowerCase());
                    flagStatus && this.infoForm.controls[fieldInForm]?.enable();
                    this.fieldFlag = { ...this.fieldFlag, [fieldInForm]: flagStatus };
                });
            });
    }

    onSubmit(): void {
        this.infoForm.markAllAsTouched();
        if (this.infoForm.valid) {
            this.formErrors$.next(0);
            this.loading$.next(true);
            const contextVariables = Object.entries(this.infoForm?.value)?.map((formEntry) => ({ name: formEntry[0], value: formEntry[1] }));
            this._submitCustomerCollectionInfo.build(contextVariables).subscribe({
                next: () => {
                    this.loading$.next(false);
                    this._router.navigate(['account', 'info-collection', 'confirmation']);
                },
                error: () => {
                    this._router.navigate(['/error']);
                },
            });
        } else {
            const errorCounter = Object.entries(this.infoForm.controls).filter((control) => control[1]?.status === 'INVALID')?.length;
            errorCounter && this.formErrors$.next(errorCounter);
        }
        return;
    }
}
